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


def _create_vulnerability_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Inverte as features de infraestrutura para representar 'ausência' ou 'escassez'.
    Isso alinha todas as features na mesma direção: quanto maior o valor, maior a vulnerabilidade.
    """
    logger.info("Criando indicadores de vulnerabilidade (invertendo features)...")
    df_vuln = df.copy()

    inversoes = {
        'falta_biblioteca': 'IN_BIBLIOTECA',
        'falta_lab_info': 'IN_LABORATORIO_INFORMATICA',
        'falta_lab_ciencias': 'IN_LABORATORIO_CIENCIAS',
        'falta_quadra': 'IN_QUADRA_ESPORTES',
        'falta_internet_alunos': 'IN_INTERNET_ALUNOS',
        'falta_banda_larga': 'IN_BANDA_LARGA',
        'falta_agua_tratada': 'infra_agua_tratada',
        'falta_saneamento': 'infra_saneamento_adequado',
        'falta_energia': 'infra_energia_confiavel'
    }

    for nova_col, col_original in inversoes.items():
        df_vuln[nova_col] = 1 - df_vuln[col_original]

    comp_ratio = df_vuln['ratio_computadores_por_aluno']
    comp_ratio_norm = (comp_ratio - comp_ratio.min()) / (comp_ratio.max() - comp_ratio.min())
    df_vuln['escassez_computadores'] = 1 - comp_ratio_norm.fillna(0)

    return df_vuln


def _normalize_indicators(df_indicators: pd.DataFrame) -> pd.DataFrame:
    """Aplica MinMaxScaler para normalizar todos os indicadores entre 0 e 1."""
    logger.info("Normalizando indicadores de vulnerabilidade para a escala [0, 1]...")
    scaler = MinMaxScaler()
    df_scaled = pd.DataFrame(
        scaler.fit_transform(df_indicators),
        columns=df_indicators.columns,
        index=df_indicators.index
    )
    return df_scaled

def _log_top_schools(df: pd.DataFrame, score_col: str, n: int = 10):
    """Exibe no logger as top N escolas com maior score."""
    logger.info(f"Top {n} Escolas com Maior Risco ({score_col}):")
    top_n = df.sort_values(score_col, ascending=False).head(n)
    logger.info(f"\n{top_n[['NO_ENTIDADE', 'NO_MUNICIPIO', score_col]].to_string()}")


def _prepare_weights(importances_df: pd.DataFrame) -> pd.Series:
    """Converte o dataframe de importâncias em uma série de pesos normalizados."""
    logger.info("Preparando e normalizando os pesos a partir da importância das features...")
    pesos = importances_df.set_index('feature')['importance']

    mapping = {
        'ratio_alunos_por_docente': 'ratio_alunos_por_docente',
        'ratio_alunos_por_funcionario': 'ratio_alunos_por_funcionario',
        'ratio_alunos_por_turma': 'ratio_alunos_por_turma',
        'IN_ACESSIBILIDADE_INEXISTENTE': 'IN_ACESSIBILIDADE_INEXISTENTE',
        'escassez_computadores': 'ratio_computadores_por_aluno',
        'falta_biblioteca': 'IN_BIBLIOTECA',
        'falta_lab_info': 'IN_LABORATORIO_INFORMATICA',
        'falta_lab_ciencias': 'IN_LABORATORIO_CIENCIAS',
        'falta_quadra': 'IN_QUADRA_ESPORTES',
        'falta_internet_alunos': 'IN_INTERNET_ALUNOS',
        'falta_banda_larga': 'IN_BANDA_LARGA',
        'falta_agua_tratada': 'infra_agua_tratada',
        'falta_saneamento': 'infra_saneamento_adequado',
        'falta_energia': 'infra_energia_confiavel',
    }

    pesos_aplicaveis = {novo: pesos.get(origem, 0) for novo, origem in mapping.items()}
    pesos_series = pd.Series(pesos_aplicaveis)
    pesos_norm = pesos_series / pesos_series.sum()

    logger.info(f"Pesos normalizados para o cálculo do IVIR:\n{pesos_norm.round(4)}")
    return pesos_norm


def _calculate_ivir_score(df: pd.DataFrame, weights: pd.Series) -> pd.Series:
    """Calcula o score IVIR multiplicando indicadores normalizados pelos pesos."""
    df_scaled = _normalize_indicators(df[weights.index])
    return (df_scaled * weights).sum(axis=1)


def run():
    """Orquestra o job de cálculo do score de vulnerabilidade (IVIR)."""
    logger.info("--- INICIANDO JOB 04: CALCULATE IVIR SCORE ---")

    load_dotenv()
    config = load_config("config/config.yaml")
    s3_config = config["s3"]
    paths = config["paths"]
    storage_options = get_s3_storage_options()

    try:
        featured_data_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data']}"
        importances_path = f"s3://{s3_config['bucket_name']}/{paths['feature_importances']}"

        logger.info(f"Lendo dados com features de: {featured_data_path}")
        df_featured = pd.read_parquet(featured_data_path, storage_options=storage_options)

        logger.info(f"Lendo pesos (importância das features) de: {importances_path}")
        df_importances = pd.read_json(importances_path, storage_options=storage_options, orient='records')

        df_indicators = _create_vulnerability_indicators(df_featured)
        weights = _prepare_weights(df_importances)
        ivir_score = _calculate_ivir_score(df_indicators, weights)

        df_final_output = df_featured.copy()
        df_final_output['score_risco_ivir'] = ivir_score

        _log_top_schools(df_final_output, 'score_risco_ivir', n=10)

        output_path = f"s3://{s3_config['bucket_name']}/{paths['final_output_with_ivir']}"
        logger.info(f"Salvando dataset final com score IVIR em: {output_path}")
        df_final_output.to_parquet(output_path, index=False, storage_options=storage_options)

        logger.info("--- JOB 04: CALCULATE IVIR SCORE FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logger.error(f"Falha na execução do job de cálculo do IVIR: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
