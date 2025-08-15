import logging
import zipfile
from pathlib import Path

import pandas as pd

from src.common.utils import load_config

BASE_DIR = Path(__file__).resolve().parents[3]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _read_source_data_from_zip(zip_path: Path, file_config: dict) -> pd.DataFrame:
    """Lê o arquivo CSV de dentro de um ZIP para um DataFrame"""
    logging.info(f"Lendo os dados de origem do arquivo ZIP: {zip_path}")

    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            csv_file_name = next(
                (name for name in zf.namelist() if name.lower().endswith(".csv")), None
            )
            if not csv_file_name:
                raise FileNotFoundError("Nenhum arquivo CSV encontrado no ZIP.")

            logging.info(f"Arquivo CSV encontrad: {csv_file_name}")
            with zf.open(csv_file_name) as csv_file:
                return pd.read_csv(
                    csv_file,
                    delimiter=file_config["csv_delimiter"],
                    encoding=file_config["csv_encoding"],
                    on_bad_lines="skip",
                    low_memory=False,
                )
    except FileNotFoundError as e:
        logging.error(f"Erro ao encontrar arquivo: {e}")
        raise
    except Exception as e:
        logging.error(f"Erro inesperado ao ler o arquivo ZIP: {e}", exc_info=True)


def _filter_data(df: pd.DataFrame, filter_config: dict) -> pd.DataFrame:
    """Aplica filtros de UF, dependência e situação no DataFrame."""
    logging.info("Aplicando filtros para selecionar o escopo dos dados...")
    df_filtered = df[
        (df["SG_UF"] == filter_config["filtro_uf"])
        & (df["TP_DEPENDENCIA"].isin(filter_config["filtro_dependencia_adm"]))
        & (
            df["TP_SITUACAO_FUNCIONAMENTO"]
            == filter_config["filtro_situacao_funcionamento"]
        )
    ].copy()
    logging.info(f"Filtros aplicados. {len(df_filtered)} registros selecionados.")
    return df_filtered


def _save_data_to_parquet(df: pd.DataFrame, output_path: Path):
    """Salva um DataFrame em formato Parquet."""
    logging.info(f"Salvando dados em formato Parquet em: {output_path}")
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_parquet(output_path, index=False)
        logging.info("Dados salvos com sucesso.")
    except Exception as e:
        logging.error(f"Falha ao salvar o arquivo Parquet: {e}", exc_info=True)
        raise


def run():
    """
    Orquestra o job de extração do Censo Escolar.
    Coordena a leitura, filtragem e salvamento dos dados.
    """
    logging.info("INICIANDO JOB DE EXTRAÇÃO (PIPELINE DE ESCOLAS)")

    config = load_config()
    etl_config = config["escolas_pipeline"]["extract"]
    paths_config = config["paths"]

    try:
        df_raw = _read_source_data_from_zip(
            zip_path=BASE_DIR / paths_config["raw_censo_escolar_zip"],
            file_config=etl_config,
        )

        df_filtered = _filter_data(df_raw, filter_config=etl_config)

        _save_data_to_parquet(
            df=df_filtered, output_path=BASE_DIR / paths_config["raw_escolas_paraiba"]
        )

        logging.info("--- JOB DE EXTRAÇÃO FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(f"Falha na execução do job de extração: {e}")
        raise


if __name__ == "__main__":
    run()
