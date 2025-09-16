import logging
from src.jobs.ml_pipeline_v1 import (
    job_01_data_preparation,
    job_02_feature_engineering,
    job_03_train_evaluate,
    job_04_calculate_ivir,
)

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [PIPELINE] - [%(levelname)s] - %(message)s",
)

def run_pipeline():
    """
    Orquestra a execução sequencial de todos os jobs da pipeline de treinamento de modelo.
    """
    try:
        logger.info(">>> INICIANDO A EXECUÇÃO DA PIPELINE DE TREINAMENTO DE MODELO V1 <<<")

        logger.info("--- Etapa 1: Preparação de Dados ---")
        job_01_data_preparation.run()
        logger.info("--- Etapa 1: Concluída com sucesso ---\n")

        logger.info("--- Etapa 2: Engenharia de Features ---")
        job_02_feature_engineering.run()
        logger.info("--- Etapa 2: Concluída com sucesso ---\n")

        logger.info("--- Etapa 3: Treinamento e Avaliação do Modelo ---")
        job_03_train_evaluate.run()
        logger.info("--- Etapa 3: Concluída com sucesso ---\n")

        logger.info("--- Etapa 4: Cálculo do Score IVIR ---")
        job_04_calculate_ivir.run()
        logger.info("--- Etapa 4: Concluída com sucesso ---\n")

        logger.info(">>> PIPELINE DE TREINAMENTO DE MODELO V1 FINALIZADA COM SUCESSO! <<<")

    except Exception as e:
        logger.error(f"A pipeline falhou devido a um erro: {e}", exc_info=True)
        raise

if __name__ == "__main__":
    run_pipeline()