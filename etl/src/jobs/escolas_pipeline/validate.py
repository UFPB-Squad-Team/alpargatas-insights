import logging
import sys

import pandas as pd
import pandera as pa
from dotenv import load_dotenv
from pandera.errors import SchemaError

from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def _define_schema() -> pa.DataFrameSchema:
    """Define o contrato de qualidade dos nossos dados processados."""
    return pa.DataFrameSchema(
        columns={
            "escolaIdInep": pa.Column(int, required=True),
            "escolaNome": pa.Column(str, required=True),
            "municipioIdIbge": pa.Column(int, required=True),
            "municipioNome": pa.Column(str, required=True),
            "estadoSigla": pa.Column(
                str, checks=pa.Check.str_length(min_value=2, max_value=2)
            ),
            "dependenciaAdm": pa.Column(
                str, checks=pa.Check.isin(["Federal", "Estadual", "Municipal"])
            ),
            "tipoLocalizacao": pa.Column(
                str, checks=pa.Check.isin(["Urbana", "Rural"])
            ),
            "infraestrutura": pa.Column(object, required=True),
            "indicadores": pa.Column(object, required=True),
            "localizacao": pa.Column(object, required=True),
            "scoreRisco": pa.Column(
                float, checks=pa.Check.in_range(min_value=0.0, max_value=1.0)
            ),
        },
        strict=True,
        ordered=True,
    )


def run():
    """Orquestra o job de validação dos dados processados lendo do S3."""
    logging.info(
        "--- INICIANDO JOB DE VALIDAÇÃO DE DADOS (PIPELINE DE ESCOLAS) DO S3 ---"
    )

    load_dotenv()
    config = load_config()
    s3_config = config["s3"]
    paths = config["paths"]
    storage_options = get_s3_storage_options()

    processed_s3_path = f"s3://{s3_config['bucket_name']}/{paths['processed_escolas']}"

    try:
        logging.info(f"Carregando dados processados de: {processed_s3_path}")
        df_processed = pd.read_parquet(
            processed_s3_path, storage_options=storage_options
        )

        logging.info("Definindo o schema de validação dos dados...")
        schema = _define_schema()

        logging.info("Validando os dados contra o schema...")
        schema.validate(df_processed)

        logging.info(
            " SUCESSO: Os dados processados são válidos e seguem o contrato de qualidade."
        )

    except FileNotFoundError:
        logging.error(
            f"ERRO: Arquivo de dados processados não encontrado em '{processed_s3_path}'."
        )
        sys.exit(1)
    except SchemaError as err:
        logging.error(
            " FALHA NA VALIDAÇÃO: Os dados não seguem o contrato de qualidade."
        )
        logging.error(f"Detalhes do erro:\n{err}")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Um erro inesperado ocorreu: {e}", exc_info=True)
        sys.exit(1)

    logging.info("--- JOB DE VALIDAÇÃO FINALIZADO ---")


if __name__ == "__main__":
    run()
