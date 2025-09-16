import logging
from typing import Dict, List

import numpy as np
import pandas as pd
from dotenv import load_dotenv # type: ignore

from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _impute_target_variable(df: pd.DataFrame) -> pd.DataFrame:
    """Imputa valores faltantes do IDEB usando mediana por município e estado."""
    logging.info("Iniciando imputação de dados faltantes para 'ideb_anos_iniciais'...")
    df_copy = df.copy()

    medianas_municipais = df_copy.groupby("CO_MUNICIPIO")["ideb_anos_iniciais"].transform("median")
    df_copy["ideb_imputado"] = df_copy["ideb_anos_iniciais"].fillna(medianas_municipais)

    mediana_estadual = df_copy["ideb_imputado"].median()
    df_copy["ideb_imputado"].fillna(mediana_estadual, inplace=True)
    
    return df_copy


def _create_aggregated_infra_features(df: pd.DataFrame, infra_cols: Dict[str, List[str]]) -> pd.DataFrame:
    """Cria features agregadas de infraestrutura a partir da configuração."""
    logging.info("Criando features agregadas de infraestrutura...")
    df_copy = df.copy()

    cols_agua = [c for c in infra_cols['agua'] if c in df_copy.columns]
    cols_saneamento = [c for c in infra_cols['saneamento'] if c in df_copy.columns]
    cols_energia = [c for c in infra_cols['energia'] if c in df_copy.columns]

    df_copy['infra_agua_tratada'] = df_copy[cols_agua].any(axis=1).astype(int)
    df_copy['infra_saneamento_adequado'] = df_copy[cols_saneamento].any(axis=1).astype(int)
    df_copy['infra_energia_confiavel'] = df_copy[cols_energia].any(axis=1).astype(int)

    return df_copy


def _create_ratio_features(df: pd.DataFrame, staff_cols: Dict[str, List[str]]) -> pd.DataFrame:
    """Cria features de razão para medir eficiência e recursos por aluno."""
    logging.info("Criando features de razão (alunos por docente/turma/funcionário)...")
    df_copy = df.copy()
    
    cols_funcionarios_existentes = [c for c in staff_cols['funcionarios'] if c in df_copy.columns]
    df_copy['QT_FUNCIONARIOS'] = df_copy[cols_funcionarios_existentes].sum(axis=1)

    for col in ["QT_DOC_BAS", "QT_TUR_BAS", "QT_FUNCIONARIOS"]:
        if col in df_copy.columns:
            df_copy[col] = df_copy[col].replace(0, np.nan)

    df_copy['ratio_alunos_por_docente'] = df_copy.get('QT_MAT_BAS', 0) / df_copy.get('QT_DOC_BAS', np.nan)
    df_copy['ratio_alunos_por_turma'] = df_copy.get('QT_MAT_BAS', 0) / df_copy.get('QT_TUR_BAS', np.nan)
    df_copy['ratio_alunos_por_funcionario'] = df_copy.get('QT_MAT_BAS', 0) / df_copy.get('QT_FUNCIONARIOS', np.nan)
    df_copy['ratio_computadores_por_aluno'] = df_copy.get('QT_DESKTOP_ALUNO', 0) / df_copy.get('QT_MAT_BAS', 0)

    ratio_cols = [col for col in df_copy.columns if col.startswith('ratio_')]
    df_copy[ratio_cols] = df_copy[ratio_cols].fillna(0)
    df_copy.replace([np.inf, -np.inf], 0, inplace=True)

    return df_copy


def _cap_ratio_outliers(df: pd.DataFrame, quantile: float, cols_to_cap: List[str]) -> pd.DataFrame:
    """Limita valores extremos das features de razão usando um quantil."""
    logging.info(f"Limitando outliers nas features de razão com quantil {quantile}...")
    df_copy = df.copy()

    for col in cols_to_cap:
        if col in df_copy.columns:
            teto = df_copy[col].quantile(quantile)
            logging.info(f"Teto para '{col}' (percentil {quantile*100:.0f}): {teto:.2f}")
            df_copy[col] = df_copy[col].clip(upper=teto)
    return df_copy


def _encode_categorical_features(df: pd.DataFrame, cols_to_encode: List[str]) -> pd.DataFrame:
    """Aplica one-hot encoding em variáveis categóricas."""
    logging.info("Aplicando One-Hot Encoding em variáveis categóricas...")
    
    existing_cols = [col for col in cols_to_encode if col in df.columns]
    if not existing_cols:
        logging.warning("Nenhuma das colunas categóricas configuradas foi encontrada para encoding.")
        return df
        
    df_encoded = pd.get_dummies(df, columns=existing_cols, dummy_na=False)
    return df_encoded

def _perform_final_validation_checks(df: pd.DataFrame):
    """Executa e loga validações no DataFrame final com features."""
    logging.info("--- INICIANDO VALIDAÇÃO FINAL DO DATAFRAME COM FEATURES ---")
    logging.info(f"Shape do DataFrame: {df.shape}")
    if "ideb_imputado" in df.columns:
        imputed_nulls = df["ideb_imputado"].isnull().sum()
        logging.info(f"Total de nulos em 'ideb_imputado': {imputed_nulls} (esperado: 0)")
    else:
        logging.warning("'ideb_imputado' não encontrada no DataFrame.")
    feature_cols = [
        'ideb_imputado', 'infra_saneamento_adequado', 'ratio_alunos_por_docente',
        'TP_DEPENDENCIA_1', 'TP_DEPENDENCIA_2'
    ]
    cols_to_display = [col for col in feature_cols if col in df.columns]
    if cols_to_display:
        logging.info(f"Amostra das novas features (head):\n{df[cols_to_display].head().to_string()}")
    else:
        logging.warning("Nenhuma das colunas de features para display foi encontrada.")


def run():
    """Orquestra a execução do job de engenharia de features."""
    logging.info(" INICIANDO JOB 02: FEATURE ENGINEERING ")

    load_dotenv()
    config = load_config(config_path="config/config.yaml")
    s3_config = config["s3"]
    paths = config["paths"]
    params = config["ml_pipeline_v1"]["feature_engineering"]
    feature_defs = params["feature_definitions"] # Carrega a nova seção de definições
    storage_options = get_s3_storage_options()

    try:
        input_path = f"s3://{s3_config['bucket_name']}/{paths['prepared_data']}"
        logging.info(f"Lendo dados preparados de: {input_path}")
        df_prepared = pd.read_parquet(input_path, storage_options=storage_options)

        df_imputed = _impute_target_variable(df_prepared)
        df_agg = _create_aggregated_infra_features(df_imputed, feature_defs['infra_columns'])
        df_ratios = _create_ratio_features(df_agg, feature_defs['staff_columns'])
        df_capped = _cap_ratio_outliers(df_ratios, params['outlier_cap_quantile'], feature_defs['ratio_columns']['cap_targets'])
        df_featured = _encode_categorical_features(df_capped, feature_defs['categorical_columns'])

        _perform_final_validation_checks(df_featured)

        output_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data']}"
        logging.info(f"Salvando dados com features no S3 em: {output_path}")
        df_featured.to_parquet(output_path, index=False, storage_options=storage_options)

        logging.info("--- JOB 02: FEATURE ENGINEERING FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(f"Falha na execução do job de engenharia de features: {e}", exc_info=True)
        raise

if __name__ == "__main__":
    run()