import logging
import pandas as pd
from dotenv import load_dotenv
from typing import Dict, List

from src.common.utils import get_s3_storage_options, load_config

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _flatten_json_columns(df: pd.DataFrame, columns_to_flatten: List[str]) -> pd.DataFrame:
    """Expande colunas JSON em múltiplas colunas de features (achatamento)."""
    logger.info(f"Achatando as colunas JSON: {columns_to_flatten}...")
    df_copy = df.copy()

    if 'contextoVizinhança' in columns_to_flatten:
        df_viz_flat = pd.json_normalize(df_copy['contextoVizinhança'])
        df_copy = pd.concat([df_copy, df_viz_flat], axis=1)

    if 'contextoMunicipal' in columns_to_flatten:
        df_mun_flat = pd.json_normalize(df_copy['contextoMunicipal'])
        df_copy = pd.concat([df_copy, df_mun_flat], axis=1)

    df_copy.drop(columns=columns_to_flatten, inplace=True, errors='ignore')

    logger.info("Achatamento concluído. Novas colunas de features foram adicionadas.")
    return df_copy


def _perform_health_check(df: pd.DataFrame):
    """Executa um 'raio-x' simples nos dados, logando o shape e uma amostra das novas colunas criadas."""
    logger.info("--- Iniciando Raio-X dos Dados com Features ---")
    logger.info(f"Shape final do DataFrame: {df.shape}")

    sample_columns = [
        'escolaIdInep',
        'inse_imputado_final',
        'viz_renda_media_domiciliar_setor',
        'mun_renda_media_domiciliar_setor',
        'score_risco_ivir'
    ]

    existing_sample_cols = [col for col in sample_columns if col in df.columns]

    if existing_sample_cols:
        logger.info(f"Amostra das colunas chave após o achatamento:\n{df[existing_sample_cols].head().to_string()}")
    else:
        logger.warning("Nenhuma das colunas de amostra para o raio-x foi encontrada.")

    logger.info("--- Raio-X concluído ---")


def _load_master_dataset(s3_config: Dict, paths: Dict, storage_options: Dict) -> pd.DataFrame:
    """Carrega o Dataset Mestre do S3."""
    input_s3_path = f"s3://{s3_config['bucket_name']}/{paths['mestre_data_v2']}"
    logger.info(f"Lendo Dataset Mestre de: {input_s3_path}")
    return pd.read_parquet(input_s3_path, storage_options=storage_options)


def _save_featured_dataset(df: pd.DataFrame, s3_config: Dict, paths: Dict, storage_options: Dict):
    """Salva o dataset com features no S3."""
    output_s3_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data_v2']}"
    logger.info(f"Salvando dados com features (V2) no S3 em: {output_s3_path}")
    df.to_parquet(output_s3_path, index=False, storage_options=storage_options)


def run():
    """Orquestra a etapa de engenharia de features para o Modelo V2."""
    logger.info("--- INICIANDO JOB 02 (V2): FEATURE ENGINEERING ---")
    try:
        load_dotenv()
        config = load_config("config/config.yaml")
        s3_config, paths = config["s3"], config["paths"]
        storage_options = get_s3_storage_options()

        df_mestre = _load_master_dataset(s3_config, paths, storage_options)
        df_featured = _flatten_json_columns(df_mestre, ['contextoVizinhança', 'contextoMunicipal'])
        _perform_health_check(df_featured)
        _save_featured_dataset(df_featured, s3_config, paths, storage_options)

        logger.info("--- JOB 02 (V2): FEATURE ENGINEERING FINALIZADO COM SUCESSO ---")
    except Exception as e:
        logger.error(f"O Job 02 (V2) falhou: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
