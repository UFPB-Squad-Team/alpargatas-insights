import logging
import zipfile
from pathlib import Path

import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def extract_data_from_local_zip(zip_path: str) -> pd.DataFrame:
    logging.info(f"Iniciando extração de dados do arquivo local: {zip_path}")

    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            csv_file_name = next(
                (name for name in zf.namelist() if name.lower().endswith(".csv")), None
            )

            if not csv_file_name:
                logging.error("Nenhum arquivo CSV encontrado no ZIP.")
                return pd.DataFrame()

            logging.info(f"Arquivo CSV encontrado no ZIP: {csv_file_name}")

            with zf.open(csv_file_name) as csv_file:
                df_completo = pd.read_csv(
                    csv_file,
                    delimiter=";",
                    encoding="latin-1",
                    on_bad_lines="skip",
                    low_memory=False,
                )
                logging.info("Leitura do arquivo CSV para DataFrame concluída.")

        logging.info("Filtrando dados para o estado da Paraíba (PB).")
        df_paraiba = df_completo[
            (df_completo["SG_UF"] == "PB")
            & (df_completo["TP_DEPENDENCIA"].isin([1, 2, 3]))
            & (df_completo["TP_SITUACAO_FUNCIONAMENTO"] == 1)
        ].copy()

        logging.info(
            f"Extração finalizada. Encontrados {len(df_paraiba)} registros para a Paraíba."
        )
        return df_paraiba

    except FileNotFoundError:
        logging.error(
            f"Erro: O arquivo ZIP não foi encontrado no caminho '{zip_path}'. Verifique o Dockerfile."
        )
    except zipfile.BadZipFile:
        logging.error("Erro de descompactação: O arquivo não é um ZIP válido.")
    except Exception as e:
        logging.error(
            f"Ocorreu um erro inesperado durante a extração: {e}", exc_info=True
        )

    return pd.DataFrame()


def save_raw_data(df: pd.DataFrame, file_path: Path) -> None:
    if df.empty:
        logging.warning("DataFrame está vazio. Nenhum arquivo será salvo.")
        return

    logging.info(f"Salvando dados brutos em {file_path}...")
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_parquet(file_path, index=False)
        logging.info("Dados brutos salvos com sucesso.")
    except Exception as e:
        logging.error(f"Falha ao salvar o arquivo Parquet: {e}", exc_info=True)


def main():
    logging.info("--- INICIANDO SCRIPT DE EXTRAÇÃO (01_extract.py) ---")

    local_zip_path = "/app/data/censo_2023.zip"

    raw_df = extract_data_from_local_zip(local_zip_path)

    output_path = (
        Path(__file__).resolve().parents[1] / "data/raw/escolas_paraiba.parquet"
    )

    save_raw_data(raw_df, output_path)

    logging.info("--- SCRIPT DE EXTRAÇÃO FINALIZADO ---")


if __name__ == "__main__":
    main()
