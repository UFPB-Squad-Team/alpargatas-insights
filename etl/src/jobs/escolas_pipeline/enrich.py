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


def _load_data_sources(s3_config: Dict, paths: Dict, storage_options: Dict) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Carrega o dataset base do ETL e o dataset enriquecido com scores de ML."""
    etl_processed_path = f"s3://{s3_config['bucket_name']}/{paths['processed_escolas']}"
    logger.info(f"Lendo dados base do ETL de: {etl_processed_path}")
    df_base_etl = pd.read_parquet(etl_processed_path, storage_options=storage_options)

    ml_scores_path = f"s3://{s3_config['bucket_name']}/{paths['processed_ml_scores']}"
    logger.info(f"Lendo dados enriquecidos com scores de ML de: {ml_scores_path}")
    df_ml_scores = pd.read_parquet(ml_scores_path, storage_options=storage_options)

    return df_base_etl, df_ml_scores


def _merge_datasets(df_base: pd.DataFrame, df_ml: pd.DataFrame) -> pd.DataFrame:
    """Unifica os dataframes do ETL e do ML."""
    logger.info("Iniciando a unificação dos dados do ETL com os scores de ML...")

    cols_to_add = [
        "escolaIdInep", "scoreRisco", "scoreRiscoContextualizado", "ideb_anos_iniciais",
        "ideb_imputado", "saeb_anos_iniciais", "inse_imputado_final",
        "ratio_alunos_por_docente", "ratio_alunos_por_funcionario", "ratio_alunos_por_turma",
        "viz_renda_media_domiciliar_setor", "mun_renda_media_domiciliar_setor",
        "viz_total_domicilios_particulares_permanentes"
    ]
    existing_cols_to_add = [col for col in cols_to_add if col in df_ml.columns]

    df_base["escolaIdInep"] = df_base["escolaIdInep"].astype(str)
    df_ml["escolaIdInep"] = df_ml["escolaIdInep"].astype(str)

    df_base_sem_score_antigo = df_base.drop(columns=["scoreRisco"], errors="ignore")

    df_enriquecido = pd.merge(
        df_base_sem_score_antigo,
        df_ml[existing_cols_to_add],
        on="escolaIdInep",
        how="left"
    )
    return df_enriquecido


def _expand_indicators_column(df: pd.DataFrame) -> pd.DataFrame:
    """Expande o campo 'indicadores' caso exista no dataframe."""
    if "indicadores" not in df.columns:
        return df

    df_indicadores_base = pd.json_normalize(df["indicadores"])
    return pd.concat([df.drop(columns=["indicadores"]), df_indicadores_base], axis=1)


def _structure_final_schema(df: pd.DataFrame) -> pd.DataFrame:
    """Estrutura o schema final para carregamento no MongoDB."""
    logger.info("Estruturando o schema final para o MongoDB...")
    df_final = df.copy()
    df_final = _expand_indicators_column(df_final)

    rename_map = {
        "total_alunos": "totalAlunos",
        "ideb_anos_iniciais": "idebAnosIniciais",
        "ideb_imputado": "idebImputado",
        "saeb_anos_iniciais": "saebAnosIniciais",
        "inse_imputado_final": "inseImputadoFinal",
        "ratio_alunos_por_docente": "ratioAlunosPorDocente",
        "ratio_alunos_por_funcionario": "ratioAlunosPorFuncionario",
        "ratio_alunos_por_turma": "ratioAlunosPorTurma",
        "viz_renda_media_domiciliar_setor": "rendaMediaVizinhança",
        "mun_renda_media_domiciliar_setor": "rendaMediaMunicipio",
        "viz_total_domicilios_particulares_permanentes": "totalDomiciliosVizinhança",
    }
    indicator_cols = [col for col in rename_map if col in df_final.columns]

    df_indicadores_nested = df_final[indicator_cols].rename(columns=rename_map)
    df_final["indicadores"] = df_indicadores_nested.to_dict(orient="records")

    df_final.drop(columns=indicator_cols, inplace=True, errors="ignore")

    logger.info("Estrutura final para carregamento no MongoDB está pronta.")
    return df_final


def _save_final_dataset(df: pd.DataFrame, s3_config: Dict, paths: Dict, storage_options: Dict):
    """Salva o dataset enriquecido no S3."""
    output_path = f"s3://{s3_config['bucket_name']}/{paths['processed_escolas_enriquecidas']}"
    logger.info(f"Salvando dataset super enriquecido no S3 em: {output_path}")
    df.to_parquet(output_path, index=False, storage_options=storage_options)


def run():
    """Orquestra o job de enriquecimento final da pipeline de ETL."""
    logger.info("--- INICIANDO JOB DE ENRIQUECIMENTO FINAL (ETL + ML) ---")
    try:
        load_dotenv()
        config = load_config("config/pipeline_config.yml")
        s3_config, paths = config["s3"], config["paths"]
        storage_options = get_s3_storage_options()

        df_base_etl, df_ml_scores = _load_data_sources(s3_config, paths, storage_options)

        df_merged = _merge_datasets(df_base_etl, df_ml_scores)

        df_final_structured = _structure_final_schema(df_merged)

        _save_final_dataset(df_final_structured, s3_config, paths, storage_options)

        logger.info("--- JOB DE ENRIQUECIMENTO FINAL CONCLUÍDO COM SUCESSO ---")

    except Exception as e:
        logger.error(f"O Job de Enriquecimento Final falhou: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
