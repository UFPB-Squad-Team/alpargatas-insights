
import logging
import pandas as pd
from dotenv import load_dotenv

from src.common.utils import (
    get_s3_storage_options,
    load_config,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _extract_and_transform_inse(
    bucket_name: str, raw_folder: str,
) -> pd.DataFrame:
    """
    Extrai o arquivo INSE de um ZIP no S3, filtra os dados para a Paraíba
    e seleciona as colunas de interesse.

    Args:
        bucket_name (str): Nome do bucket S3.
        raw_folder (str): Pasta onde o arquivo ZIP bruto está localizado.
        source_config (dict): Dicionário de configuração da fonte de dados INSE.

    Returns:
        pd.DataFrame: DataFrame com os dados filtrados e prontos para a carga.
    """
    logging.info("--- 1. INICIANDO EXTRAÇÃO E TRANSFORMAÇÃO DO ARQUIVO INSE ---")
    
    try:
        inse_path = f"s3://{bucket_name}/{raw_folder}/INSE_2021_escolas.xlsx"
        storage_options = get_s3_storage_options()
        
        logging.info(f"Lendo o arquivo INSE diretamente do S3: {inse_path}")
        
        
        df_inse_escolas = pd.read_excel(
            inse_path,
            dtype={'ID_ESCOLA': str},
            engine='openpyxl',
            storage_options=storage_options
        )

    except Exception as e:
        logging.error(f"Erro ao ler o arquivo INSE do S3: {e}", exc_info=True)
        raise

    logging.info("Filtrando os dados para a Paraíba (CO_UF == 25)...")
    df_pb = df_inse_escolas[df_inse_escolas['CO_UF'] == 25].copy()
    
    logging.info("Selecionando colunas e renomeando...")
    df_inse_bruto = df_pb[['ID_ESCOLA', 'MEDIA_INSE']].copy()
    df_inse_bruto.rename(columns={'ID_ESCOLA': 'escolaIdInep', 'MEDIA_INSE': 'inse_valor'}, inplace=True)
    
    logging.info("Transformação concluída. DataFrame com %s linhas.", len(df_inse_bruto))
    return df_inse_bruto

def run():
    """
    Orquestra o pipeline completo para o INSE: extração, transformação e carga no S3.
    """
    logging.info("--- INICIANDO PIPELINE DO INSE ---")
    
    load_dotenv()
    config = load_config()
    s3_config = config["s3"]

    try:
        
        df_inse_transformed = _extract_and_transform_inse(
            bucket_name=s3_config["bucket_name"],
            raw_folder=s3_config["raw_folder"],
        )

        
        output_s3_path = f"s3://{s3_config['bucket_name']}/{s3_config['intermediate_folder']}/inse_por_escola_pb.parquet"
        storage_options = get_s3_storage_options()
        
        logging.info(f"Salvando o arquivo Parquet na camada 'intermediate' do S3 em: {output_s3_path}")
        df_inse_transformed.to_parquet(output_s3_path, index=False, storage_options=storage_options)
        
        logging.info("--- PIPELINE DO INSE CONCLUÍDO COM SUCESSO. DADOS SALVOS NO S3. ---")
    except Exception as e:
        logging.error(f"Falha na execução do pipeline do INSE: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()