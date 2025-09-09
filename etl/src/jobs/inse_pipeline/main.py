import logging

from . import extract, transform

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def run_pipeline():
    """
    Executa o pipeline completo de ETL para os dados do inse.
    """
    try:
        logging.info(" INICIANDO PIPELINE (INSE)")

        extract.run()

        transform.run()

    except Exception as e:
        logging.error(f"Ocorreu um erro fatal na execução do pipeline do inse: {e}")
        raise


if __name__ == "__main__":
    run_pipeline()
