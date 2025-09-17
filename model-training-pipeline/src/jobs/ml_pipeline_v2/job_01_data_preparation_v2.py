import logging
import pandas as pd
from dotenv import load_dotenv
from typing import Dict

from src.common.utils import get_s3_storage_options, load_config

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

def _load_dataframe(s3_path: str, storage_options: Dict, source_name: str) -> pd.DataFrame:
    """Carrega um único DataFrame a partir de um caminho S3, com logging contextual."""
    logger.info(f"Lendo dados da fonte '{source_name}' de: {s3_path}")
    df = pd.read_parquet(s3_path, storage_options=storage_options)
    logger.info(f"-> Encontradas {len(df)} linhas na base '{source_name}'.")
    return df

def _ensure_join_key_type(df: pd.DataFrame, key_col: str = "escolaIdInep") -> pd.DataFrame:
    """Garante que a coluna de join seja do tipo string para o merge."""
    if key_col in df.columns:
        df[key_col] = df[key_col].astype(str)
    return df

def _load_all_sources(s3_config: Dict, data_sources: Dict, storage_options: Dict) -> Dict[str, pd.DataFrame]:
    """Carrega todos os DataFrames de origem definidos no config."""
    df_ivir = _load_dataframe(f"s3://{s3_config['bucket_name']}/{data_sources['escolas_ivir_v1']}", storage_options, "IVIR (V1)")
    df_inse = _load_dataframe(f"s3://{s3_config['bucket_name']}/{data_sources['escolas_inse']}", storage_options, "INSE")
    df_setorial = _load_dataframe(f"s3://{s3_config['bucket_name']}/{data_sources['escolas_setorial']}", storage_options, "Setorial")
    return {"ivir": df_ivir, "inse": df_inse, "setorial": df_setorial}


def _prepare_sources_for_merge(sources: Dict[str, pd.DataFrame]) -> Dict[str, pd.DataFrame]:
    """Garante consistência das chaves de join em todos os DataFrames."""
    return {name: _ensure_join_key_type(df) for name, df in sources.items()}


def _merge_master_dataset(sources: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Realiza os merges entre IVIR, INSE e Setorial para formar o dataset mestre."""
    logger.info("Iniciando processo de merge para criar o Dataset Mestre...")

    df_mestre = pd.merge(
        sources["ivir"],
        sources["inse"][['escolaIdInep', 'inse_imputado_final', 'inse_valor']],
        on='escolaIdInep',
        how='left'
    )

    df_mestre = pd.merge(
        df_mestre,
        sources["setorial"][['escolaIdInep', 'contextoMunicipal', 'contextoVizinhança']],
        on='escolaIdInep',
        how='left'
    )

    logger.info(f"Merge concluído. Shape final do Dataset Mestre: {df_mestre.shape}")
    return df_mestre


def _save_master_dataset(df_mestre: pd.DataFrame, s3_config: Dict, paths: Dict, storage_options: Dict):
    """Salva o dataset mestre no S3."""
    output_s3_path = f"s3://{s3_config['bucket_name']}/{paths['mestre_data_v2']}"
    logger.info(f"Salvando Dataset Mestre no S3 em: {output_s3_path}")
    df_mestre.to_parquet(output_s3_path, index=False, storage_options=storage_options)


def run():
    """Orquestra a preparação dos dados para o Modelo V2."""
    logger.info("--- INICIANDO JOB 01 (V2): DATA PREPARATION ---")
    try:
        load_dotenv()
        config = load_config("config/config.yaml")
        s3_config, data_sources, paths = config["s3"], config["data_sources"], config["paths"]
        storage_options = get_s3_storage_options()

        sources = _load_all_sources(s3_config, data_sources, storage_options)
        sources = _prepare_sources_for_merge(sources)
        df_mestre = _merge_master_dataset(sources)
        _save_master_dataset(df_mestre, s3_config, paths, storage_options)

        logger.info("--- JOB 01 (V2): DATA PREPARATION FINALIZADO COM SUCESSO ---")
    except Exception as e:
        logger.error(f"O Job 01 (V2) falhou: {e}", exc_info=True)
        raise
    

if __name__ == "__main__":
    run()
