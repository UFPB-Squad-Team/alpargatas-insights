import logging
import os
from pathlib import Path

import numpy as np
import pandas as pd
from pymongo import MongoClient

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

        data_to_load = df.to_dict(orient="records")

        if data_to_load:
            collection.delete_many({})

            result = collection.insert_many(data_to_load)
            logging.info(
                f"Load do ETL concluído: {len(result.inserted_ids)} documentos inseridos na coleção '{collection_name}'."
            )
        else:
            logging.error("Nenhum dado para inserir.")
    except Exception as e:
        logging.error(f"Erro durante o Load para o MongoDB: {e}")
    finally:
        if "client" in locals() and client:
            client.close()
            logging.info("Conexão com o MongoDB fechada.")


def main():
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

            uri_mongo = "mongodb+srv://alpargatas_user:hGJZbmrO46NPksBb@alpargatas-insights-clu.2iuzc4b.mongodb.net/?retryWrites=true&w=majority&appName=alpargatas-insights-cluster"
            db_mongo = "teste_load"
            collection_mongo = "teste1"

            logging.info("Inserindo os dados no MongoDB")
            load_to_mongo(
                df=df_escolas,
                db_name=db_mongo,
                collection_name=collection_mongo,
                uri=uri_mongo,
            )
        except Exception as e:
            logging.error(f"Ocorreu um erro ao processar o arquivo: {e}")


main()
