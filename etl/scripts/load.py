import logging
from pymongo import MongoClient, UpdateOne
import pandas as pd
import os
from pathlib import Path
from typing import List
import numpy as np
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

def read_processed_data(file_name: str):
    """Lê o arquivo parquet processado e retorna um DataFrame do Pandas."""

    logging.info("Iniciando a leitura do arquivo parquet processado.")
    base_path = Path(__file__).resolve().parents[1]
    data_path = base_path / file_name

    if not os.path.exists(data_path):
        logging.error(f"Arquivo '{data_path}' não encontrado.")
        return None
    else:
        try:
            logging.info(f"Lendo o arquivo parquet em'{data_path}'...")
            df_escolas = pd.read_parquet(data_path)

            logging.info("DataFrame carregado com sucesso.")
            return df_escolas
        except Exception as e:
            logging.error(f"Erro ao ler o arquivo parquet: {e}")
            return None
        
def prepare_data_for_mongo(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    '''Prepara os dados para serem compatíveis com o MongoDB.'''

    logging.info(f"Convertendo a coluna {column_name} para a formatação ideal para o MongoDB")
    df[column_name] = df[column_name].apply(
            lambda x: {**x, 'coordinates': x['coordinates'].tolist()} 
            if isinstance(x['coordinates'], np.ndarray) else x)
    return df

def prepare_bulk_upsert_operations(df: pd.DataFrame) -> List[UpdateOne]:
            """Prepara as operações de upsert para o MongoDB."""

            logging.info("Preparando a lista para operação de upsert.")
            operations = [
                UpdateOne(
                    {"escola_id_inep": doc["escola_id_inep"]},
                    {"$set": doc},
                    upsert=True
                )
                for doc in df.to_dict(orient='records')
            ]
            return operations

def load_to_mongo(operations: List[UpdateOne], db_name: str, collection_name: str, uri: str):
    """Executa as operações de upsert uma coleção do MongoDB."""

    try:
        logging.info("Iniciando o processo de Load para o MongoDB.")
        client = MongoClient(uri)
        db = client[db_name]
        collection = db[collection_name]

        if not operations:
            logging.warning("A lista de operações upsert está vazia. Nenhum dado será inserido na coleção.")
            return
        
        logging.info("Executando bulk write (upsert) para a coleção.")
        result = collection.bulk_write(operations)
        logging.info(
            f"Load do ETL concluído: {result.upserted_count} novos documentos inseridos {result.modified_count} documentos atualizados na coleção '{collection_name}'.")

    except Exception as e:
        logging.error(f"Erro durante o Load para o MongoDB: {e}")

    finally:
        if "client" in locals() and client:
            client.close()
            logging.info("Conexão com o MongoDB fechada.")
  
def main():
    """Função principal que orquestra o pipeline ETL de leitura e carga."""

    load_dotenv()
    
    logging.info("Iniciando o processo de ETL para carregar dados no MongoDB.")
    df_escolas = read_processed_data("data/processed/escolas_processado.parquet")
    if df_escolas is None:
        logging.error("Não foi possível carregar o DataFrame. Encerrando o processo.")
        return

    logging.info("Preparando os dados para o MongoDB.")
    df_escolas = prepare_data_for_mongo(df_escolas, "localizacao")
    
    logging.info("Preparando as operações de upsert para o MongoDB.")
    operations = prepare_bulk_upsert_operations(df_escolas)

    uri_mongo = os.getenv("MONGO_URI")
    db_mongo = "teste_load"
    collection_mongo = "teste2"
    
    if uri_mongo:
        load_to_mongo(operations=operations, db_name=db_mongo, collection_name=collection_mongo, uri=uri_mongo)
    else:
        logging.error("URI do MongoDB não encontrada nas variáveis de ambiente.")

if __name__ == "__main__":
    main()