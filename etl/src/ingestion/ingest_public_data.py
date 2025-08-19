import logging
import os
import boto3
import requests
from botocore.exceptions import ClientError
from dotenv import load_dotenv

from src.common.utils import load_config

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")

def _ingest_source(source_name: str, source_config: dict, s3_client, bucket_name: str, raw_folder: str):
    """Baixa um arquivo de uma URL e o carrega para o S3."""
    url = source_config['url']
    output_filename = source_config['output_filename']
    s3_key = f"{raw_folder}/{output_filename}"
    
    logging.info(f"Iniciando ingestão para a fonte: '{source_name}'")
    logging.info(f"Baixando de: {url}")
    
    try:
        with requests.get(url, stream=True) as response:
            response.raise_for_status()
            logging.info(f"Upload para S3: s3://{bucket_name}/{s3_key}")
            s3_client.upload_fileobj(response.raw, bucket_name, s3_key)
        logging.info(f"SUCESSO: Fonte '{source_name}' ingerida com sucesso.")
        return True
    
    except requests.exceptions.RequestException as e:
        logging.error(f"FALHA: Erro de rede ao baixar '{source_name}': {e}")
    except ClientError as e:
        logging.error(f"FALHA: Erro do S3 ao carregar '{source_name}': {e}")
    except Exception as e:
        logging.error(f"FALHA: Erro inesperado para a fonte '{source_name}': {e}", exc_info=True)
    return False

def run():
    """Orquestra a ingestão de todas as fontes de dados públicos para o S3."""
    logging.info("--- INICIANDO JOB DE INGESTÃO DE DADOS PÚBLICOS PARA O S3 ---")
    
    load_dotenv()
    config = load_config()
    s3_config = config['s3']
    sources_to_ingest = config['ingestion_sources']

    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_DEFAULT_REGION")
        )
        logging.info("Cliente S3 inicializado com sucesso usando credenciais do .env.")
    except Exception as e:
        logging.error(f"Não foi possível inicializar o cliente S3. Verifique suas credenciais no .env. Erro: {e}")
        return

    bucket_name = s3_config['bucket_name']
    raw_folder = s3_config['raw_folder']
    
    success_count = 0
    for source_name, source_config in sources_to_ingest.items():
        if _ingest_source(source_name, source_config, s3_client, bucket_name, raw_folder):
            success_count += 1
            
    logging.info("--- JOB DE INGESTÃO FINALIZADO ---")
    logging.info(f"Resumo: {success_count} de {len(sources_to_ingest)} fontes ingeridas com sucesso.")

if __name__ == "__main__":
    run()
