import logging
from pathlib import Path

import pandas as pd
import yaml
from unidecode import unidecode


def load_config(config_path: str = "config/pipeline_config.yml") -> dict:
    """
    Carrega um arquivo de configuração YAML e o retorna como dicionario
    @args: config_path (o caminho para o arquivo de configuração)
    @returns: um dicionário com as configurações carregadas.
    """
    try:
        full_path = Path(__file__).resolve().parents[2] / config_path
        with open(full_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        logging.error(f"Arquivo de configuração não encontrado em: {full_path}")
        raise
    except Exception as e:
        logging.error(f"Erro ao carregar o arquivo de configuração: {e}")
        raise


def normalize_text_for_matching(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """
    Normaliza uma coluna de texto para facilitar merges, removendo acentos,
    caracteres especiais, espaços e convertendo para maiúsculas.
    """
    logging.info(f"Normalizando texto da coluna: {column_name}")

    df_copy = df.copy()

    temp_series = df_copy[column_name].astype(str).str.upper().apply(unidecode)
    temp_series = (
        temp_series.str.replace("[-.!?'`()*]", "", regex=True)
        .str.replace("MIXING CENTER", "")
        .str.strip()
        .str.replace(r"\s+", "", regex=True)
    )
    df_copy[f"{column_name}_normalized"] = temp_series
    return df_copy
