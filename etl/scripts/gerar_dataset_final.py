import logging
import re
from pathlib import Path

import pandas as pd
from unidecode import unidecode

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


# aqui sao as nossoas funções de configurações básicas (em uma arquitetura profissional, elas seriam helpers ou utils)
def getdtb(file_path: Path) -> pd.DataFrame:
    logging.info(f"Lendo arquivo de municípios (DTB) de: {file_path}")
    data = pd.read_excel(
        file_path,
        skiprows=6,
        usecols=["UF", "Nome_UF", "Código Município Completo", "Nome_Município"],
    )
    data.columns = ["id_uf", "ds_uf", "id_mundv", "ds_mun"]
    return data.drop_duplicates(subset=["id_mundv"])


def formatar_nome_super(
    df: pd.DataFrame, coluna: str, novo_nome: str = "ds_formatada"
) -> pd.DataFrame:
    logging.info(f"Aplicando formatação avançada na coluna: {coluna}")
    temp_series = df[coluna].astype(str).str.upper().apply(unidecode)
    temp_series = (
        temp_series.str.replace("[-.!?'`()*]", "", regex=True)
        .str.replace("MIXING CENTER", "")
        .str.strip()
        .str.replace(" ", "")
    )
    df[novo_nome] = temp_series
    return df


# aqui são nossas funções de pipeline
def processar_dados_ia(path_ia: Path) -> pd.DataFrame:
    logging.info("ETAPA 1 - Iniciando processamento com o mapeamento por aba")

    config_abas = {
        "2020": {"header": 5, "iloc": [0, 1, 18, 20]},
        "2021": {"header": 5, "iloc": [0, 1, 25, 27]},
        "2022": {"header": 5, "iloc": [0, 1, 28, 30]},
        "2023": {"header": 5, "iloc": [0, 1, 34, 36]},
        "2024": {"header": 5, "iloc": [0, 1, 36, 38]},
        "2025": {"header": 5, "iloc": [0, 1, 36, 38]},
        "2022-Ed.Profissionalizante": {"header": 5, "usecols": "A,B,D,F"},
        "2023-Ed.Profissionalizante": {"header": 5, "usecols": "A,B,D,F"},
        "2024-Ed.Profissionalizante": {"header": 5, "usecols": "B,C,E,G"},
        "2025-Ed.Profissionalizante ": {"header": 5, "usecols": "B,C,E,G"},
    }

    df_full = []
    for aba, config in config_abas.items():
        try:
            logging.info(f"Processando aba: {aba.strip()}...")
            df = pd.read_excel(path_ia, sheet_name=aba, header=config["header"])

            if "iloc" in config:
                df = df.iloc[:, config["iloc"]]
            else:
                df = pd.read_excel(
                    path_ia,
                    sheet_name=aba,
                    header=config["header"],
                    usecols=config["usecols"],
                )

            df.columns = ["ds_mun", "sg_uf", "nprojetos", "nbeneficiados"]
            df["ano"] = int(re.search(r"\d{4}", aba).group())
            df_full.append(df)
        except Exception as e:
            logging.warning(f"Não foi possível processar a aba '{aba}'. Erro: {e}")

    df_consolidado = pd.concat(df_full, ignore_index=True)

    df_consolidado["nprojetos"] = pd.to_numeric(
        df_consolidado["nprojetos"], errors="coerce"
    ).fillna(0)
    df_consolidado["nbeneficiados"] = pd.to_numeric(
        df_consolidado["nbeneficiados"], errors="coerce"
    ).fillna(0)
    df_consolidado.dropna(subset=["ds_mun", "sg_uf"], inplace=True)
    ufs_validas = ["PB", "PE", "MG", "SP", "RJ"]
    df_consolidado = df_consolidado[df_consolidado["sg_uf"].isin(ufs_validas)]
    df_consolidado["ds_uf"] = df_consolidado["sg_uf"].map(
        {
            "PB": "Paraíba",
            "PE": "Pernambuco",
            "MG": "Minas Gerais",
            "SP": "São Paulo",
            "RJ": "Rio de Janeiro",
        }
    )

    logging.info(" ETAPA - 1 Concluída")
    return df_consolidado


def agregar_indicadores_municipais(df_temporal: pd.DataFrame) -> pd.DataFrame:
    logging.info(" ETAPA 2 - Agregando indicadores por município")
    df_temporal.dropna(subset=["ds_mun_x"], inplace=True)
    df_agg = (
        df_temporal.groupby("id_mundv")
        .agg(
            municipioNome=("ds_mun_x", "first"),
            municipioSomaProjetos=("nprojetos", "sum"),
            municipioSomaBeneficiados=("nbeneficiados", "sum"),
            municipioMediaIdeb2023=("ideb_2023", "mean"),
        )
        .reset_index()
    )
    df_agg.rename(columns={"id_mundv": "municipioIdIbge"}, inplace=True)
    logging.info("ETAPA 2 - Concluída")
    return df_agg


def enriquecer_dados_escolas(
    path_escolas: Path, df_municipios_agg: pd.DataFrame
) -> pd.DataFrame:
    logging.info("ETAPA 3 - Enriquecendo dataset de escolas ")
    df_escolas = pd.read_parquet(path_escolas)
    df_escolas["municipioIdIbge"] = pd.to_numeric(df_escolas["municipioIdIbge"]).astype(
        "int64"
    )
    df_municipios_agg["municipioIdIbge"] = pd.to_numeric(
        df_municipios_agg["municipioIdIbge"]
    ).astype("int64")
    df_escolas_enriquecidas = pd.merge(
        df_escolas, df_municipios_agg, on="municipioIdIbge", how="left"
    )

    if "municipioNome_x" in df_escolas_enriquecidas.columns:
        df_escolas_enriquecidas.rename(
            columns={"municipioNome_x": "municipioNome"}, inplace=True
        )
    if "municipioNome_y" in df_escolas_enriquecidas.columns:
        df_escolas_enriquecidas.drop(columns=["municipioNome_y"], inplace=True)

    df_escolas_enriquecidas["risco_ideb_municipio"] = 1 - (
        df_escolas_enriquecidas["municipioMediaIdeb2023"] / 10
    )
    df_escolas_enriquecidas["scoreRiscoContextualizado"] = (
        0.6 * df_escolas_enriquecidas["scoreRisco"]
        + 0.4 * df_escolas_enriquecidas["risco_ideb_municipio"]
    ).fillna(df_escolas_enriquecidas["scoreRisco"])
    logging.info("ETAPA - 3 Concluída")
    return df_escolas_enriquecidas


# aqui a main vai orquestrar todas as funções
def main():
    logging.info("Iniciando a geração do dataset final enriquecido")
    base_path = Path(__file__).resolve().parent.parent
    data_path_raw = base_path / "data" / "raw_professor"

    df_dtb = getdtb(data_path_raw / "RELATORIO_DTB_BRASIL_2024_MUNICIPIOS.xls")
    df_dtb_formatado = formatar_nome_super(df_dtb, "ds_mun")

    lista_ideb = [f"VL_OBSERVADO_{x}" for x in range(2005, 2025, 2)]
    nomes_ideb = [f"ideb_{x}" for x in range(2005, 2025, 2)]
    df_ideb = pd.read_excel(
        data_path_raw / "divulgacao_anos_iniciais_municipios_2023.xlsx",
        skiprows=9,
        usecols=["CO_MUNICIPIO", "REDE"] + lista_ideb,
        na_values=["-", "--"],
    )
    df_ideb.columns = ["id_mundv", "rede"] + nomes_ideb
    df_ideb_publica = df_ideb[df_ideb["rede"] == "Pública"].copy()

    df_ia_bruto = processar_dados_ia(
        path_ia=data_path_raw / "Projetos_de_Atuac807a771o_-_IA_-_2020_a_2025.xlsx"
    )
    if df_ia_bruto.empty:
        logging.error("O processamento dos dados do IA não retornou nenhum dado.")
        return

    df_ia_formatado = formatar_nome_super(df_ia_bruto, "ds_mun")

    df_temporal = pd.merge(
        df_ia_formatado, df_dtb_formatado, on=["ds_formatada", "ds_uf"], how="inner"
    )
    df_temporal = pd.merge(df_temporal, df_ideb_publica, on="id_mundv", how="left")

    (base_path / "data/processed").mkdir(parents=True, exist_ok=True)
    df_temporal.to_parquet(
        base_path / "data/processed/dados_temporais_para_auditoria.parquet", index=False
    )
    logging.info("Arquivo de auditoria (df_temporal) salvo com sucesso.")

    df_municipios_agg = agregar_indicadores_municipais(df_temporal)

    df_final = enriquecer_dados_escolas(
        path_escolas=base_path / "data" / "processed" / "escolas_processado.parquet",
        df_municipios_agg=df_municipios_agg,
    )

    caminho_final = (
        base_path / "data" / "processed" / "ENTREGAVEL_escolas_enriquecidas.parquet"
    )
    df_final.to_parquet(caminho_final, index=False)
    logging.info(
        f" O processo foi concluido com sucesso: O entregável final foi salvo em: {caminho_final} ---"
    )


if __name__ == "__main__":
    main()
