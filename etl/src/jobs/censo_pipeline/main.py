import logging
import sys

from .extract import run as run_extract
from .transform import run as run_transform

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - [PIPELINE_CENSO] - %(message)s",
    stream=sys.stdout,
)

def run_full_pipeline():
    """
    Orquestra a execução sequencial de todo o pipeline de censo.
    """
    logging.info("="*60)
    logging.info("INICIANDO A EXECUÇÃO COMPLETA DO PIPELINE")
    logging.info("="*60)

    try:
        # --- Etapa 1: Extração ---
        logging.info("\n>>> INICIANDO ETAPA 1: EXTRAÇÃO DOS DADOS DE RENDA...")
        run_extract()
        logging.info(">>> ETAPA 1: EXTRAÇÃO FINALIZADA COM SUCESSO!\n")

        # --- Etapa 2: Transformação ---
        logging.info(">>> INICIANDO ETAPA 2: TRANSFORMAÇÃO E ENRIQUECIMENTO...")
        run_transform()
        logging.info(">>> ETAPA 2: TRANSFORMAÇÃO FINALIZADA COM SUCESSO!\n")

        logging.info("="*60)
        logging.info("PIPELINE EXECUTADO COM SUCESSO!")
        logging.info("="*60)

    except Exception as e:
        logging.error("O PIPELINE FALHOU DURANTE A EXECUÇÃO.")
        logging.error(f"Um erro fatal ocorreu: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    run_full_pipeline()