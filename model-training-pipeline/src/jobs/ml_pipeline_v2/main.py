import logging
from src.jobs.ml_pipeline_v2 import (
    job_01_data_preparation_v2,
    job_02_feature_engineering_v2,
    job_03_train_evaluate_v2,
    job_04_calculate_context_score_v2,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [PIPELINE_V2] - [%(levelname)s] - %(message)s",
)
logger = logging.getLogger(__name__)


def run_pipeline():
    """
    Orquestra a execução sequencial de todos os jobs da pipeline de treinamento do Modelo V2.
    """
    try:
        logger.info(">>> INICIANDO A EXECUÇÃO DA PIPELINE DE TREINAMENTO DE MODELO V2 <<<")

        logger.info("--- Etapa 1 (V2): Preparação de Dados (Merge) ---")
        job_01_data_preparation_v2.run()
        logger.info("--- Etapa 1 (V2): Concluída com sucesso ---\n")

        logger.info("--- Etapa 2 (V2): Engenharia de Features (Flatten) ---")
        job_02_feature_engineering_v2.run()
        logger.info("--- Etapa 2 (V2): Concluída com sucesso ---\n")

        logger.info("--- Etapa 3 (V2): Treinamento e Avaliação do Modelo ---")
        job_03_train_evaluate_v2.run()
        logger.info("--- Etapa 3 (V2): Concluída com sucesso ---\n")

        logger.info("--- Etapa 4 (V2): Cálculo do Score de Risco Contextualizado ---")
        job_04_calculate_context_score_v2.run()
        logger.info("--- Etapa 4 (V2): Concluída com sucesso ---\n")

        logger.info(">>> PIPELINE DE TREINAMENTO DE MODELO V2 FINALIZADA COM SUCESSO! <<<")

    except Exception as e:
        logger.error(f"A pipeline V2 falhou devido a um erro: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run_pipeline()