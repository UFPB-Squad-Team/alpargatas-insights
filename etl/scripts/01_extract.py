import logging
import os
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

dotenv_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(dotenv_path=dotenv_path)

def extract_data_from_source() -> pd.DataFrame:
    """
    Função principal para extrair os dados.
    A lógica do seu colega virá para cá.
    """
    logging.info("Iniciando o processo de extração...")

    data_path = os.getenv("RAW_DATA_PATH", "default/path/not/found")
    logging.info(f"Caminho do dado bruto (exemplo): {data_path}")

    # TODO: Implementar a lógica de leitura do CSV e filtro dos dados da Paraíba.
    # df = pd.read_csv(...)
    # df_paraiba = df[df['SG_UF'] == "PB"]

    df_paraiba = pd.DataFrame({"coluna_exemplo": [1, 2, 3]})

    logging.info("Extração concluída.")
    return df_paraiba

def save_raw_data(df: pd.DataFrame, file_path: Path) -> None:
    logging.info(f"Salvando dados brutos em {file_path}...")

    # Garante que o diretório de destino exista
    file_path.parent.mkdir(parents=True, exist_ok=True)

    df.to_parquet(file_path, index=False)
    logging.info("Dados brutos salvos com sucesso.")

def main() -> None:
    raw_df = extract_data_from_source()

    output_path = Path(__file__).resolve().parents[1] / "data/raw/escolas_paraiba.parquet"

    save_raw_data(raw_df, output_path)

if __name__ == "__main__":
    main()