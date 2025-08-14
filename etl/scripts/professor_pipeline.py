import pandas as pd
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

def getdtb(file: str) -> pd.DataFrame:
    """
    Leitura de Dados de Divisão Geográfica do Brasil - Municípios.
    """
    logging.info(f"Lendo arquivo de {file}")
    data = pd.read_excel(file, skiprows=6,
                       usecols=['UF', 'Nome_UF', 'Nome Região Geográfica Imediata',
                                'Código Município Completo', 'Nome_Município'])
    data.columns = ['id_uf', 'ds_uf', 'ds_rgi', 'id_mundv', 'ds_mun']
    data = data.drop_duplicates(subset=['id_mundv'])
    return data

def formatar_nome(df: pd.DataFrame, coluna: str, novo_nome: str = "ds_formatada") -> pd.DataFrame:
    """
    Padroniza uma coluna de nomes para facilitar o cruzamento (merge).
    """
    logging.info(f"Formatando coluna '{coluna}'...")
    df[novo_nome] = (df[coluna].str.upper()
                           .str.replace("[-.!?'`()]", "", regex=True)
                           .str.replace("MIXING CENTER", "")
                           .str.strip()
                           .str.replace(" ", ""))
    return df


def main():
    """
    Função principal que orquestra a execução do pipeline.
    """
    logging.info("--- INICIANDO O PIPELINE ---")

    base_path = Path(__file__).resolve().parent.parent
    data_path = base_path / "data" / "raw_professor"

    path_dtb = data_path / "RELATORIO_DTB_BRASIL_2024_MUNICIPIOS.xls"
    path_ia = data_path / "Projetos_de_Atuac807a771o_-_IA_-_2020_a_2025.xlsx"
    path_ideb = data_path / "divulgacao_anos_iniciais_municipios_2023.xlsx"

    df_dtb = getdtb(path_dtb)
    df_dtb = formatar_nome(df=df_dtb, coluna="ds_mun")
    logging.info("\n[✔] Dados do IBGE processados.")

    logging.info(f"\nLendo arquivo de projetos do IA: {path_ia}")
    df_ia = pd.read_excel(path_ia, sheet_name="2024", skiprows=5)
    df_ia = df_ia[['CIDADES', 'UF', 'Nº \nProjetos.7', 'Nº \nInstituições.1', 'Nº \nBeneficiados.4']]
    df_ia.columns = ['ds_mun', 'sg_uf', 'nprojetos', 'ninstituicoes', 'nbeneficiados']
    df_ia = formatar_nome(df=df_ia, coluna="ds_mun")
    df_ia['ds_uf'] = df_ia['sg_uf'].map({"PB": "Paraíba", "PE": "Pernambuco", "MG": "Minas Gerais", "SP": "São Paulo"})
    logging.info("\n[✔] Dados do IA processados.")

    logging.info("\nCruzando dados do IA com IBGE...")
    data_merged = pd.merge(df_ia, df_dtb, how="inner", on=["ds_formatada", "ds_uf"],
                           suffixes=["_ia", ""], indicator="tipo_merge")
    logging.info("\n[✔] Cruzamento realizado.")


    lista_ideb = [f'VL_OBSERVADO_{x}' for x in range(2005, 2025, 2)]
    nomes_ideb = [f'ideb_{x}' for x in range(2005, 2025, 2)]
    logging.info(f"\nLendo arquivo do IDEB: {path_ideb}")
    df_ideb = pd.read_excel(path_ideb,
                          skiprows=9,
                          usecols=['CO_MUNICIPIO', 'REDE'] + lista_ideb,
                          na_values=['-', '--'])
    df_ideb.columns = ['id_mundv', 'rede'] + nomes_ideb
    logging.info("\n[✔] Dados do IDEB processados.")

    logging.info("\nCruzando dados com IDEB...")
    data_final = data_merged.merge(df_ideb, how='left', on='id_mundv')

    logging.info("\n--- PIPELINE CONCLUÍDO ---")

    
    caminho_saida = base_path / "data" / "processed" / "data_final_professor.parquet"
    caminho_saida.parent.mkdir(parents=True, exist_ok=True) 
    data_final.to_parquet(caminho_saida, index=False)

    logging.info(f"\n[✔] Arquivo final salvo com sucesso em: {caminho_saida}")


if __name__ == "__main__":
    main()
    
    
    