import logging
from typing import List

from pymongo import MongoClient, UpdateOne
from pymongo.errors import ConnectionFailure, OperationFailure


class MongoLoader:
    """
    Uma classe para gerenciar a conexão e o carregamento de dados no MongoDB.
    """

    def __init__(self, db_uri: str, db_name: str):
        """
        Inicializa o loader, estabelecendo a conexão com o banco de dados

        Args:
            db_uri: A string de conexão do MongoDB (user/passoword)
            db_name: O nome do banco de dados a ser utilizado.
        """
        self.db_uri = db_uri
        self.db_name = db_name
        self.client = None
        self.db = None
        try:
            logging.info("Estabelecendo conexão com o MongoDB...")
            self.client = MongoClient(self.db_uri)
            self.client.admin.command("ping")
            self.db = self.client[self.db_name]
            logging.info("Conexão com o MongoDB estabelecida com sucesso.")
        except ConnectionFailure as e:
            logging.error(f"Falha ao conectar ao MongoDB: {e}")
            raise

    def bulk_upsert(self, operations: List[UpdateOne], collection_name: str):
        """
        Executa uma operação de 'bulk write' com 'upserts' na coleção especificada.

        Args:
            operations: Uma lista de operações UpdateOne.
            collection_name: O nome da coleção a ser atualizada.
        """
        if not operations:
            logging.waring(
                "A lista de operações está vazia. Nenhum dado será carregado"
            )
            return

        logging.info(
            f"Carregando {len(operations)} registros para a coleção '{collection_name}'"
        )
        try:
            collection = self.db[collection_name]
            result = collection.bulk_write(operations)
            logging.info(
                f"Carga concluída: {result.upserted_count} novos documentos inseridos, "
                f"{result.modified_count} documentos atualizados."
            )
        except OperationFailure as e:
            logging.error(f"Erro durante a operação de bulk write: {e}")
            raise
        except Exception as e:
            logging.error(
                f"Um erro inesperado ocorreu durante o carregamento: {e}", exc_info=True
            )
            raise

    def close_connection(self):
        """Fecha a conexão com o MongoDB, se estiver aberta."""
        if self.client:
            self.client.close()
            logging.info("Conexão com o MongoDB fechada.")
