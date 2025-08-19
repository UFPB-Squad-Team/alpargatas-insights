import logging

from . import extract, load, transform, validate

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def run_pipeline():
    """
    Executa o pipeline completo de ETL para os dados das escolas.
    """
    try:
        logging.info(" INICIANDO PIPELINE PRINCIPAL (ESCOLAS)")

        extract.run()

        transform.run()

        validate.run()

        load.run()

    except Exception as e:
        logging.error(f"Ocorreu um erro fatal na execução do pipeline de escolas: {e}")
        raise


if __name__ == "__main__":
    run_pipeline()
