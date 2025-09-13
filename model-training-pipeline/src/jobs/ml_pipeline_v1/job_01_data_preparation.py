import logging
from typing import Dict, List
from io import StringIO

import numpy as np
import pandas as pd
from dotenv import load_dotenv # type: ignore

from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _load_censo_data(s3_path: str, storage_options: dict) -> pd.DataFrame:
    """Carrega os dados do Censo Escolar (já processados pelo ETL) do S3."""
    logging.info(f"Lendo base de escolas de: {s3_path}")
    df = pd.read_parquet(s3_path, storage_options=storage_options)
    
    if "CO_ENTIDADE" in df.columns and "escolaIdInep" not in df.columns:
        df.rename(columns={"CO_ENTIDADE": "escolaIdInep"}, inplace=True)
        
    logging.info(f"Encontradas {len(df)} escolas no Censo da Paraíba.")
    return df


def _read_ideb_data(s3_path: str, storage_options: dict) -> pd.DataFrame:
    """Lê o arquivo Excel bruto do IDEB a partir do S3."""
    logging.info(f"Lendo dados de performance de: {s3_path}")
    return pd.read_excel(s3_path, storage_options=storage_options)


def _select_and_rename_ideb_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Seleciona e renomeia as colunas de interesse do DataFrame do IDEB."""
    logging.info("Selecionando e renomeando colunas do IDEB...")
    colunas_ideb_iniciais = {
        "Escola_ID": "escolaIdInep",
        "Media_IDEB_inicial_2023": "ideb_anos_iniciais",
        "Media_SAEB_inicial_2023": "saeb_anos_iniciais",
    }
    cols_to_select = [col for col in colunas_ideb_iniciais if col in df.columns]
    df_selected = df[cols_to_select].copy()
    df_selected.rename(columns=colunas_ideb_iniciais, inplace=True)
    return df_selected


def _clean_ideb_numeric_columns(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """Limpa e converte colunas numéricas, substituindo marcadores por NaN."""
    logging.info(f"Limpando colunas numéricas: {columns}")
    for col in columns:
        if col in df.columns:
            df[col] = df[col].replace(["-", "ND"], np.nan)
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def load_and_process_ideb_data(s3_path: str, storage_options: Dict) -> pd.DataFrame:
    """Orquestra o carregamento e processamento dos dados do IDEB."""
    df_raw = _read_ideb_data(s3_path, storage_options)
    df_renamed = _select_and_rename_ideb_columns(df_raw)
    df_clean = _clean_ideb_numeric_columns(df_renamed, ["ideb_anos_iniciais", "saeb_anos_iniciais"])
    logging.info(f"Dados de performance do IDEB processados para {len(df_clean)} escolas.")
    return df_clean


def _ensure_merge_key_type(df: pd.DataFrame, key_col: str) -> pd.DataFrame:
    """Garante que a coluna chave para o merge seja do tipo inteiro."""
    if key_col in df.columns:
        df[key_col] = pd.to_numeric(df[key_col], errors="coerce").astype("Int64")
    return df


def merge_dataframes(df_escolas: pd.DataFrame, df_ideb: pd.DataFrame) -> pd.DataFrame:
    """Unifica os dataframes de escolas e IDEB, preparando as chaves para o merge."""
    logging.info("Iniciando unificação dos dados do Censo e IDEB...")
    
    key_col = "escolaIdInep"
    df_escolas = _ensure_merge_key_type(df_escolas, key_col)
    df_ideb = _ensure_merge_key_type(df_ideb, key_col)

    df_final = pd.merge(df_escolas, df_ideb, on=key_col, how="left")
    
    logging.info(f"Merge concluído. Shape final do DataFrame: {df_final.shape}")
    missing_ideb_count = df_final["ideb_anos_iniciais"].isnull().sum()
    logging.info(f"Verificando dados faltantes para o IDEB após o merge: {missing_ideb_count} escolas sem nota.")
    
    return df_final


def run():
    """Orquestra a execução completa do job de preparação de dados."""
    logging.info(" INICIANDO JOB 01: DATA PREPARATION ")

    load_dotenv()
    config = load_config(config_path="config/config.yaml")
    s3_config = config["s3"]
    data_sources = config["data_sources"]
    paths = config["paths"]
    storage_options = get_s3_storage_options()

    try:
        censo_s3_path = f"s3://{s3_config['bucket_name']}/{data_sources['escolas_censo_intermediate']}"
        ideb_s3_path = f"s3://{s3_config['bucket_name']}/{data_sources['ideb_raw']}"

        df_escolas_censo = _load_censo_data(censo_s3_path, storage_options)
        
        df_ideb_processed = load_and_process_ideb_data(ideb_s3_path, storage_options)
        
        df_prepared = merge_dataframes(df_escolas_censo, df_ideb_processed)
        
        output_s3_path = f"s3://{s3_config['bucket_name']}/{paths['prepared_data']}"
        logging.info(f"Salvando dados preparados no S3 em: {output_s3_path}")
        df_prepared.to_parquet(output_s3_path, index=False, storage_options=storage_options)

        logging.info("--- JOB 01: DATA PREPARATION FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(f"Falha na execução do job de preparação de dados: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()