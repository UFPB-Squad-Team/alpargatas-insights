import logging
import re
import os
import pandas as pd
from dotenv import load_dotenv
from src.common.utils import load_config, read_zipped_file_from_s3, get_s3_storage_options

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")

def _extract_dtb(bucket_name: str, raw_folder: str, source_config: dict) -> pd.DataFrame:
    """Extrai os dados do DTB de dentro de um ZIP no S3."""
    logging.info("Extraindo dados do DTB (municípios)...")
    df = read_zipped_file_from_s3(
        bucket_name=bucket_name,
        s3_zip_key=f"{raw_folder}/{source_config['output_filename']}",
        target_filename=source_config['target_filename_in_zip'],
        read_params={"skiprows": 6, "usecols": ["UF", "Nome_UF", "Código Município Completo", "Nome_Município"]}
    )
    df.columns = ["id_uf", "ds_uf", "id_mundv", "ds_mun"]
    df = df.drop_duplicates(subset=["id_mundv"])
    logging.info(f"Dados do DTB extraídos com sucesso: {len(df)} municípios.")
    return df

def _extract_ideb(bucket_name: str, raw_folder: str, source_config: dict) -> pd.DataFrame:
    """Extrai os dados do IDEB de dentro de um ZIP no S3."""
    logging.info("Extraindo dados do IDEB...")
    df = read_zipped_file_from_s3(
        bucket_name=bucket_name,
        s3_zip_key=f"{raw_folder}/{source_config['output_filename']}",
        target_filename=source_config['target_filename_in_zip'],
        read_params={"skiprows": 9, "na_values": ["-", "--"]}
    )
    
    ideb_cols = [col for col in df.columns if "VL_OBSERVADO" in col]
    ideb_new_cols = [f"ideb_{col.split('_')[-1]}" for col in ideb_cols]
    df.rename(columns=dict(zip(ideb_cols, ideb_new_cols)), inplace=True)
    df.rename(columns={"CO_MUNICIPIO": "id_mundv", "REDE": "rede"}, inplace=True)

    logging.info("Limpando e convertendo colunas de notas/IDEB para numérico...")
    numeric_cols = [col for col in df.columns if col.startswith('ideb_') or 'NOTA' in col]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    logging.info(f"Dados do IDEB extraídos e limpos com sucesso: {len(df)} registros.")
    return df

def _extract_ia_projects(bucket_name: str, raw_folder: str, ia_config: dict, storage_options: dict) -> pd.DataFrame:
    """Extrai dados de projetos IA de um arquivo Excel com múltiplas abas no S3."""
    logging.info("Extraindo dados de projetos do Instituto Alpargatas...")
    ia_path = f"s3://{bucket_name}/{raw_folder}/Projetos_de_Atuac807a771o_-_IA_-_2020_a_2025.xlsx"
    all_sheets = pd.read_excel(ia_path, sheet_name=None, storage_options=storage_options)
    
    df_full = []
    for sheet_name, sheet_config in ia_config.items():
        if sheet_name in all_sheets:
            try:
                df = all_sheets[sheet_name].copy()
                if "iloc" in sheet_config:
                    df = df.iloc[:, sheet_config["iloc"]]
                else:
                    df = pd.read_excel(ia_path, sheet_name=sheet_name, header=sheet_config['header'], usecols=sheet_config['usecols'], storage_options=storage_options)
                df.columns = ["ds_mun", "sg_uf", "nprojetos", "nbeneficiados"]
                df["ano"] = int(re.search(r"\d{4}", sheet_name).group())
                df_full.append(df)
            except Exception as e:
                logging.warning(f"Não foi possível processar a aba '{sheet_name}'. Erro: {e}")
    
    df_consolidado = pd.concat(df_full, ignore_index=True)
    
    df_consolidado['sg_uf'] = df_consolidado['sg_uf'].astype(str)
    df_consolidado['nprojetos'] = pd.to_numeric(df_consolidado['nprojetos'], errors='coerce').fillna(0).astype(int)
    df_consolidado['nbeneficiados'] = pd.to_numeric(df_consolidado['nbeneficiados'], errors='coerce').fillna(0).astype(int)
    
    logging.info(f"Dados de Projetos IA extraídos com sucesso: {len(df_consolidado)} registros.")
    return df_consolidado

def _extract_municipios(bucket_name: str, raw_folder: str, storage_options: dict) -> pd.DataFrame:
    """Extrai o arquivo CSV de municípios do S3."""
    logging.info("Extraindo dados de municípios brasileiros...")
    municipios_path = f"s3://{bucket_name}/{raw_folder}/municipios_brasileiros.csv"
    df = pd.read_csv(municipios_path, storage_options=storage_options)
    logging.info(f"Dados de Municípios extraídos com sucesso: {len(df)} registros.")
    return df

def run() -> None:
    """
    Orquestra a extração de todas as fontes de dados do S3 e salva
    os resultados na camada 'intermediate' do S3.
    """
    logging.info("INICIANDO EXTRAÇÃO (PIPELINE DO PROFESSOR) DO S3 ")
    load_dotenv()
    config = load_config()
    s3_config = config['s3']
    paths_config = config['paths']
    sources_config = config['ingestion_sources']
    ia_extract_config = config['professor_pipeline']['extract']['ia_projetos_abas_config']
    bucket_name = s3_config['bucket_name']
    raw_folder = s3_config['raw_folder']
    storage_options = get_s3_storage_options()

    try:
        df_dtb = _extract_dtb(bucket_name, raw_folder, sources_config['dtb_ibge'])
        df_ideb = _extract_ideb(bucket_name, raw_folder, sources_config['ideb'])
        df_ia = _extract_ia_projects(bucket_name, raw_folder, ia_extract_config, storage_options)
        df_municipios = _extract_municipios(bucket_name, raw_folder, storage_options)

        logging.info("Salvando artefatos intermediários no S3...")
        df_dtb.to_parquet(f"s3://{bucket_name}/{paths_config['intermediate_professor_dtb']}", storage_options=storage_options)
        df_ideb.to_parquet(f"s3://{bucket_name}/{paths_config['intermediate_professor_ideb']}", storage_options=storage_options)
        df_ia.to_parquet(f"s3://{bucket_name}/{paths_config['intermediate_professor_ia']}", storage_options=storage_options)
        df_municipios.to_parquet(f"s3://{bucket_name}/{paths_config['intermediate_professor_municipios']}", storage_options=storage_options)
        
        logging.info(" EXTRAÇÃO (PIPELINE DE ENRIQUECIMENTO) DO S3 FINALIZADA ")

    except Exception as e:
        logging.error(f"Falha na execução da extração do pipeline do professor: {e}", exc_info=True)
        raise

if __name__ == "__main__":
    run()
