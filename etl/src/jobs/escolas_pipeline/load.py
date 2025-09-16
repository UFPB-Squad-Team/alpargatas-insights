import logging
import os
from typing import List

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pymongo import UpdateOne

from src.common.database import MongoLoader
from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _prepare_data_for_mongo(df: pd.DataFrame) -> pd.DataFrame:
    """Converte estruturas de dados do Pandas/Numpy para tipos compatíveis com o MongoDB."""
    if "localizacao" in df.columns:
        df["localizacao"] = df["localizacao"].apply(
            lambda loc: {**loc, "coordinates": loc["coordinates"].tolist()}
            if isinstance(loc, dict) and isinstance(loc.get("coordinates"), np.ndarray)
            else loc
        )
    return df


def _prepare_bulk_upsert_operations(df: pd.DataFrame) -> List[UpdateOne]:
    """Converte um DataFrame em uma lista de operações UpdateOne para o MongoDB."""
    logging.info("Preparando operações de 'upsert' em lote para os dados finais...")
    return [
        UpdateOne({"escolaIdInep": doc["escolaIdInep"]}, {"$set": doc}, upsert=True)
        for doc in df.to_dict(orient="records")
    ]


def run():
    """
    Orquestra o job de carregamento final, lendo o dataset enriquecido do S3
    e salvando no MongoDB.
    """
    logging.info("--- INICIANDO JOB DE CARREGAMENTO FINAL (DADOS ENRIQUECIDOS) ---")

    load_dotenv()
    config = load_config()
    s3_config = config["s3"]
    paths = config["paths"]
    db_config = config["database"]
    mongo_uri = os.getenv("MONGO_URI")
    storage_options = get_s3_storage_options()

    if not mongo_uri:
        logging.error("Variável de ambiente MONGO_URI não definida.")
        raise ValueError("MONGO_URI não pode ser nula.")

    loader = None
    try:
        final_data_s3_path = (
            f"s3://{s3_config['bucket_name']}/{paths['processed_escolas_enriquecidas']}"
        )
        logging.info(f"Lendo dados finais super enriquecidos de: {final_data_s3_path}")
        df_final = pd.read_parquet(final_data_s3_path, storage_options=storage_options)

        df_ready_to_load = _prepare_data_for_mongo(df_final)
        operations = _prepare_bulk_upsert_operations(df_ready_to_load)

        loader = MongoLoader(db_uri=mongo_uri, db_name=db_config["db_name"])
        
        loader.bulk_upsert(
            operations=operations, collection_name=db_config["escolas_enrich_collection_name"]
        )
        logging.info("--- JOB DE CARREGAMENTO FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(
            f"Falha na execução do job de carregamento final: {e}", exc_info=True
        )
        raise
    finally:
        if loader:
            loader.close_connection()


if __name__ == "__main__":
    run()
