import logging
import re
from pathlib import Path

import pandas as pd

from src.common.utils import load_config

BASE_DIR = Path(__file__).resolve().parents[3]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def _extract_ia_projects_data(path: Path, config: dict) -> pd.DataFrame:
    """Extrai e consolida dados de projetos de múltiplas abas de um arquivo Excel."""
    logging.info("Iniciando extração dos dados de projetos do Instituto Alpargatas...")
    df_full = []
    for sheet_name, sheet_config in config.items():
        try:
            logging.info(f"Processando aba: {sheet_name.strip()}...")
            read_params = {"sheet_name": sheet_name, "header": sheet_config["header"]}
            if "iloc" in sheet_config:
                df = pd.read_excel(path, **read_params)
                df = df.iloc[:, sheet_config["iloc"]]
            else:
                read_params["usecols"] = sheet_config["usecols"]
                df = pd.read_excel(path, **read_params)

            df.columns = ["ds_mun", "sg_uf", "nprojetos", "nbeneficiados"]
            df["ano"] = int(re.search(r"\d{4}", sheet_name).group())
            df_full.append(df)
        except Exception as e:
            logging.warning(
                f"Não foi possível processar a aba '{sheet_name}'. Erro: {e}"
            )

    df_consolidado = pd.concat(df_full, ignore_index=True)
    return df_consolidado


def run() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Orquestra a extração de todas as fontes de dados para o pipeline de enriquecimento."""
    logging.info("INICIANDO EXTRAÇÃO (PIPELINE DE ENRIQUECIMENTO)")
    config = load_config()
    paths = config["paths"]
    extract_config = config["professor_pipeline"]["extract"]

    df_dtb = pd.read_excel(
        BASE_DIR / paths["raw_professor_dtb"],
        skiprows=6,
        usecols=["UF", "Nome_UF", "Código Município Completo", "Nome_Município"],
    )
    df_dtb.columns = ["id_uf", "ds_uf", "id_mundv", "ds_mun"]
    df_dtb = df_dtb.drop_duplicates(subset=["id_mundv"])
    logging.info(
        f"Dados do DTB extraídos com sucesso: {len(df_dtb)} municípios únicos."
    )

    df_ia = _extract_ia_projects_data(
        path=BASE_DIR / paths["raw_professor_ia_projetos"],
        config=extract_config["ia_projetos_abas_config"],
    )
    logging.info(f"Dados de Projetos IA extraídos com sucesso: {len(df_ia)} registros.")

    ideb_cols = [f"VL_OBSERVADO_{x}" for x in range(2005, 2025, 2)]
    df_ideb = pd.read_excel(
        BASE_DIR / paths["raw_professor_ideb"],
        skiprows=9,
        usecols=["CO_MUNICIPIO", "REDE"] + ideb_cols,
        na_values=["-", "--"],
    )
    ideb_new_cols = [f"ideb_{x}" for x in range(2005, 2025, 2)]
    df_ideb.columns = ["id_mundv", "rede"] + ideb_new_cols
    logging.info(f"Dados do IDEB extraídos com sucesso: {len(df_ideb)} registros.")

    logging.info("--- EXTRAÇÃO (PIPELINE DE ENRIQUECIMENTO) FINALIZADA ---")
    return df_dtb, df_ia, df_ideb


if __name__ == "__main__":
    df_dtb, df_ia, df_ideb = run()
    print("DTB Head:")
    print(df_dtb.head())
    print("\nIA Head:")
    print(df_ia.head())
    print("\nIDEB Head:")
    print(df_ideb.head())
