import logging
import pandas as pd
from dotenv import load_dotenv
from sklearn.preprocessing import MinMaxScaler

from src.common.utils import get_s3_storage_options, load_config

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _invert_positive_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Inverte indicadores onde um valor ALTO é BOM, para que um valor ALTO signifique VULNERABILIDADE.
    """
    logger.info("Invertendo indicadores positivos para representar vulnerabilidade...")
    df_inv = df.copy()

    infra_cols = [
        'IN_BIBLIOTECA', 'IN_LABORATORIO_CIENCIAS', 'IN_LABORATORIO_INFORMATICA',
        'IN_QUADRA_ESPORTES', 'IN_INTERNET_ALUNOS', 'IN_BANDA_LARGA'
    ]
    infra_features = [col for col in df.columns if col.startswith('infra_') or col in infra_cols]

    for col in infra_features:
        df_inv[f"falta_{col.lower()}"] = 1 - df_inv[col]

    # INSE
    inse_norm = (df_inv['inse_imputado_final'] - df_inv['inse_imputado_final'].min()) / \
                (df_inv['inse_imputado_final'].max() - df_inv['inse_imputado_final'].min())
    df_inv['vulnerabilidade_inse'] = 1 - inse_norm.fillna(0)

    # Ratio de computadores
    comp_ratio_norm = (df_inv['ratio_computadores_por_aluno'] - df_inv['ratio_computadores_por_aluno'].min()) / \
                      (df_inv['ratio_computadores_por_aluno'].max() - df_inv['ratio_computadores_por_aluno'].min())
    df_inv['escassez_computadores'] = 1 - comp_ratio_norm.fillna(0)

    return df_inv


def _prepare_weights(importances_df: pd.DataFrame) -> pd.Series:
    """Normaliza as importâncias em pesos aplicáveis ao score."""
    logger.info("Preparando e normalizando os pesos a partir da importância das features...")
    pesos = importances_df.set_index('feature')['importance']

    pesos_aplicaveis = {}
    for feature, importance in pesos.items():
        if feature.startswith('infra_') or feature in [
            'IN_BIBLIOTECA', 'IN_LABORATORIO_CIENCIAS', 'IN_LABORATORIO_INFORMATICA',
            'IN_QUADRA_ESPORTES', 'IN_INTERNET_ALUNOS', 'IN_BANDA_LARGA'
        ]:
            pesos_aplicaveis[f"falta_{feature.lower()}"] = importance
        elif feature == 'inse_imputado_final':
            pesos_aplicaveis['vulnerabilidade_inse'] = importance
        elif feature == 'ratio_computadores_por_aluno':
            pesos_aplicaveis['escassez_computadores'] = importance
        else:
            pesos_aplicaveis[feature] = importance

    pesos_series = pd.Series(pesos_aplicaveis)
    return pesos_series / pesos_series.sum()


def _load_data(s3_config: dict, paths: dict, storage_options: dict) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Carrega dataset de features e pesos do S3."""
    featured_data_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data_v2']}"
    importances_path = f"s3://{s3_config['bucket_name']}/{paths['feature_importances_v2']}"

    logger.info(f"Lendo dados com features de: {featured_data_path}")
    df_featured = pd.read_parquet(featured_data_path, storage_options=storage_options)

    logger.info(f"Lendo pesos (importância das features) de: {importances_path}")
    df_importances = pd.read_json(importances_path, storage_options=storage_options, orient='records')

    return df_featured, df_importances


def _calculate_contextual_score(df_indicators: pd.DataFrame, weights: pd.Series) -> pd.Series:
    """Normaliza indicadores e calcula o score final."""
    indicadores_para_score = [col for col in weights.index if col in df_indicators.columns]
    df_subset = df_indicators[indicadores_para_score]

    scaler = MinMaxScaler()
    df_scaled = pd.DataFrame(
        scaler.fit_transform(df_subset),
        columns=df_subset.columns,
        index=df_subset.index
    )

    return (df_scaled * weights[indicadores_para_score]).sum(axis=1)


def _log_top_10(df: pd.DataFrame):
    """Mostra as 10 escolas com maior risco contextualizado."""
    logger.info("Top 10 Escolas com Maior Risco Contextualizado:")
    top_10_cols = ['NO_ENTIDADE', 'NO_MUNICIPIO', 'scoreRisco', 'scoreRiscoContextualizado', 'inse_imputado_final']
    top_10 = df.sort_values('scoreRiscoContextualizado', ascending=False).head(10)
    logger.info(f"\n{top_10[top_10_cols].to_string()}")


def _save_final_output(df: pd.DataFrame, s3_config: dict, paths: dict, storage_options: dict):
    """Salva dataset final no S3."""
    output_path = f"s3://{s3_config['bucket_name']}/{paths['final_output_with_context_score']}"
    logger.info(f"Salvando dataset final com scores em: {output_path}")
    df.to_parquet(output_path, index=False, storage_options=storage_options)


def run():
    """Orquestra o cálculo do score de risco contextualizado (V2)."""
    logger.info("--- INICIANDO JOB 04 (V2): CALCULATE CONTEXTUALIZED SCORE ---")
    try:
        load_dotenv()
        config = load_config("config/config.yaml")
        s3_config, paths = config["s3"], config["paths"]
        storage_options = get_s3_storage_options()

        df_featured, df_importances = _load_data(s3_config, paths, storage_options)

        df_indicators = _invert_positive_indicators(df_featured)
        weights = _prepare_weights(df_importances)

        score_contextualizado = _calculate_contextual_score(df_indicators, weights)

        df_final = df_featured.copy()
        df_final.rename(columns={'score_risco_ivir': 'scoreRisco'}, inplace=True)
        df_final['scoreRiscoContextualizado'] = score_contextualizado

        _log_top_10(df_final)

        _save_final_output(df_final, s3_config, paths, storage_options)

        logger.info("--- JOB 04 (V2): CALCULATE CONTEXTUALIZED SCORE FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logger.error(f"O Job 04 (V2) falhou: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
