import logging

import numpy as np
import pandas as pd

# Importa as funções EXATAMENTE como estão no seu utils.py
from src.common.utils import (
    get_s3_storage_options,
    load_config,
    read_zipped_file_from_s3,
)

# Configuração do logging padrão para o pipeline
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def _rename_censo_renda_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Renomeia as colunas do arquivo DomicilioRenda do Censo 2010
    para nomes padronizados em snake_case.
    """
    logging.info("Renomeando colunas do Censo (Renda)...")

    # Mapeamento exato das colunas do arquivo do IBGE
    rename_map = {
        "Cod_setor": "id_setor_censitario",
        "Situacao_setor": "situacao_setor",
        "V001": "total_domicilios_particulares_permanentes",
        "V002": "total_rendimento_domicilios_particulares_permanentes",
        "V003": "domicilios_renda_ate_1_4_salario",
        "V004": "domicilios_renda_mais_1_4_a_1_2_salario",
        "V005": "domicilios_renda_mais_1_2_a_1_salario",
        "V006": "domicilios_renda_mais_1_a_2_salarios",
        "V007": "domicilios_renda_mais_2_a_3_salarios",
        "V008": "domicilios_renda_mais_3_a_5_salarios",
        "V009": "domicilios_renda_mais_5_a_10_salarios",
        "V010": "domicilios_renda_mais_10_salarios",
        "V011": "domicilios_sem_renda_nominal",
    }

    # Seleciona apenas as colunas que vamos usar e as renomeia
    df_renamed = df[list(rename_map.keys())].rename(columns=rename_map)
    return df_renamed


def _clean_censo_renda_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Realiza a limpeza e tratamento dos dados de renda do Censo.
    """
    logging.info("Iniciando limpeza e tratamento dos dados de renda...")
    df_clean = df.copy()

    # Garante que o ID do setor seja uma string, pois é um código
    df_clean["id_setor_censitario"] = df_clean["id_setor_censitario"].astype(str)

    # Identifica as colunas de valores que precisam ser limpas
    value_cols = [
        col for col in df_clean.columns if col.startswith(("total_", "domicilios_"))
    ]

    # Substitui o caractere 'X' (usado pelo IBGE para dados suprimidos) por NaN
    for col in value_cols:
        df_clean[col] = df_clean[col].replace("X", np.nan)
        df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")

    # Preenchemos os valores nulos com 0, assumindo que NaN significa ausência de contagem
    df_clean[value_cols] = df_clean[value_cols].fillna(0)

    logging.info("Limpeza de dados finalizada.")
    return df_clean


def _create_censo_renda_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cria novas features (colunas) a partir dos dados de renda.
    """
    logging.info("Criando features de renda...")
    df_featured = df.copy()

    # Feature 1: Renda média por domicílio no setor censitário
    # Evita divisão por zero, resultando em 0 caso não haja domicílios com renda
    total_rendimento = df_featured[
        "total_rendimento_domicilios_particulares_permanentes"
    ]
    total_domicilios = df_featured["total_domicilios_particulares_permanentes"]

    # Usamos np.divide para tratar a divisão por zero de forma segura
    df_featured["renda_media_domiciliar_setor"] = np.divide(
        total_rendimento,
        total_domicilios,
        out=np.zeros_like(total_rendimento, dtype=float),
        where=(total_domicilios != 0),
    )

    logging.info("Criação de features finalizada.")
    return df_featured


def run():
    """
    Orquestra a extração, processamento e salvamento dos dados de renda do Censo 2010
    a nível de setor censitário.
    """
    logging.info(
        "--- INICIANDO PIPELINE DE EXTRAÇÃO: CENSO RENDA (SETOR CENSITÁRIO) ---"
    )

    try:
        # Carrega as configurações do arquivo YAML usando sua função do utils
        config = load_config()
        s3_config = config["s3"]
        source_config = config["ingestion_sources"]["domicilio_renda"]

        # Lê o arquivo diretamente do S3 usando sua função do utils
        df_raw = read_zipped_file_from_s3(
            bucket_name=s3_config["bucket_name"],
            s3_zip_key=f"{s3_config['raw_folder']}/{source_config['output_filename']}",
            target_filename=source_config["target_filename_in_zip"],
            read_params={"header": 0},
        )

        # Aplica a sequência de transformações
        df_renamed = _rename_censo_renda_columns(df_raw)
        df_cleaned = _clean_censo_renda_data(df_renamed)
        df_final = _create_censo_renda_features(df_cleaned)

        # Define o caminho de saída no S3
        output_path = f"s3://{s3_config['bucket_name']}/{s3_config['intermediate_folder']}/censo_renda_por_setor_censitario.parquet"

        # Obtém as opções de armazenamento com as credenciais da AWS
        storage_options = get_s3_storage_options()

        logging.info(f"Salvando dados processados em: {output_path}")
        df_final.to_parquet(output_path, index=False, storage_options=storage_options)

        logging.info(
            f"--- PIPELINE FINALIZADA COM SUCESSO! {len(df_final)} setores censitários processados. ---"
        )

    except Exception as e:
        logging.error(f"Ocorreu um erro na execução do pipeline: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
