import logging

from . import extract, transform

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def run_pipeline():
    """
    Executa o pipeline completo de enriquecimento de dados (Pipeline do Professor).
    """
    try:
        logging.info("INICIANDO PIPELINE DE ENRIQUECIMENTO DE DADOS")

        df_dtb, df_ia, df_ideb = extract.run()

        transform.run(df_dtb=df_dtb, df_ia=df_ia, df_ideb=df_ideb)

    except Exception as e:
        logging.error(
            f"Ocorreu um erro fatal na execução do pipeline de enriquecimento: {e}"
        )
        raise


if __name__ == "__main__":
    run_pipeline()
