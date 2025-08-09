import logging
import os
from pathlib import Path

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def load_to_mongo(df: pd.DataFrame, db_name: str, collection_name: str, uri: str):
    """Carrega um DataFrame do Pandas para uma coleção do MongoDB."""

    try:
        client = MongoClient(uri)

        db = client[db_name]
        collection = db[collection_name]

        logging.info("Verificando se o DataFrame está vazio.")
        if df.empty:
            logging.error("O DataFrame está vazio. Nenhum dado será inserido.")
            return

        logging.info("Preparando a lista para operação de upsert.")
        data_to_load = df.to_dict(orient="records")

        operations = [
            UpdateOne(
                {"escola_id_inep": doc["escola_id_inep"]}, {"$set": doc}, upsert=True
            )
            for doc in data_to_load
        ]

        if operations:
            logging.info("Executando bulk write (upsert) para a database.")
            result = collection.bulk_write(operations)
            logging.info(
                f"Load do ETL concluído: {result.upserted_count} novos documentos inseridos e {result.modified_count} documentos atualizados. na coleção '{collection_name}' "
            )
        else:
            logging.error("Nenhuma operação de upsert para executar.")

    except Exception as e:
        logging.error(f"Erro durante o Load para o MongoDB: {e}")

    finally:
        if "client" in locals() and client:
            client.close()
            logging.info("Conexão com o MongoDB fechada.")


def main():
    load_dotenv()

    base_path = Path(__file__).resolve().parents[1]
    data_path = base_path / "data/processed/escolas_processado.parquet"

    if not os.path.exists(data_path):
        logging.error(f"Arquivo '{data_path}' não encontrado.")
        return
    else:
        try:
            logging.info(f"Lendo o arquivo parquet em'{data_path}'...")
            df_escolas = pd.read_parquet(data_path)

            logging.info("DataFrame carregado com sucesso.")

            logging.info(
                "Convertendo a coluna 'localizacao' para a formatação ideal para o MongoDB"
            )
            df_escolas["localizacao"] = df_escolas["localizacao"].apply(
                lambda x: {**x, "coordinates": x["coordinates"].tolist()}
                if isinstance(x["coordinates"], np.ndarray)
                else x
            )

            uri_mongo = os.getenv("MONGO_URI")
            db_mongo = "teste_load"
            collection_mongo = "teste1"

            if uri_mongo:
                logging.info("Inserindo os dados no MongoDB")
                load_to_mongo(
                    df=df_escolas,
                    db_name=db_mongo,
                    collection_name=collection_mongo,
                    uri=uri_mongo,
                )
            else:
                logging.error("URI do MongoDB não encontrada no arquivo .env")
        except Exception as e:
            logging.error(f"Ocorreu um erro ao processar o arquivo: {e}")


main()
