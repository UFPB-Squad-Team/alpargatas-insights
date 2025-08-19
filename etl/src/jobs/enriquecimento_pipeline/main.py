import logging
from . import extract, transform

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")

def run_pipeline():
    """
    Executa o pipeline completo de enriquecimento de dados (Pipeline do Professor),
    com etapas desacopladas via S3.
    """
    try:
        logging.info("== INICIANDO PIPELINE DE ENRIQUECIMENTO DE DADOS (PROFESSOR)   ==")
        
        extract.run()
        
        transform.run()

    except Exception as e:
        logging.error(f"Ocorreu um erro fatal na execução do pipeline de enriquecimento: {e}")
        raise

if __name__ == "__main__":
    run_pipeline()
