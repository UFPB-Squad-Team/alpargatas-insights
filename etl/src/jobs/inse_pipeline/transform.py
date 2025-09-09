import logging

import numpy as np
import pandas as pd
from dotenv import load_dotenv

from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def merge_censo_and_inse(
    df_inse: pd.DataFrame, df_censo_pb: pd.DataFrame
) -> pd.DataFrame:
    """Realiza a mesclagem (merge) dos DataFrames de Censo e INSE."""
    logging.info("Mesclando os dados do Censo e INSE.")

    df_censo_pb["CO_ENTIDADE"] = df_censo_pb["CO_ENTIDADE"].astype(str)
    df_inse["escolaIdInep"] = df_inse["escolaIdInep"].astype(str)

    df_completo = pd.merge(
        df_censo_pb, df_inse, left_on="CO_ENTIDADE", right_on="escolaIdInep", how="left"
    )

    print(f"Número de escolas do Censo na Paraíba: {len(df_censo_pb)}")
    print(f"Número de escolas no INSE 2021 na Paraíba: {len(df_inse)}")
    print(f"Número de escolas após a junção: {len(df_completo)}")

    return df_completo


def impute_inse_values(df_completo: pd.DataFrame) -> pd.DataFrame:
    """
    Aplica a lógica de tratamento de outliers e imputação de valores ausentes
    no DataFrame mesclado.
    """
    logging.info("Aplicando a lógica de tratamento e imputação.")

    inse_reais = df_completo["inse_valor"].dropna()
    Q1 = inse_reais.quantile(0.25)
    Q3 = inse_reais.quantile(0.75)
    IQR = Q3 - Q1
    limite_inferior = Q1 - 1.5 * IQR
    limite_superior = Q3 + 1.5 * IQR

    df_completo["inse_ajustado"] = df_completo["inse_valor"].copy()
    df_completo["inse_ajustado"] = np.clip(
        df_completo["inse_ajustado"], limite_inferior, limite_superior
    )

    logging.info(
        "Imputação por grupo (dependência + localização) usando a mediana ajustada."
    )
    mediana_por_grupo = df_completo.groupby(["TP_DEPENDENCIA", "TP_LOCALIZACAO"])[
        "inse_ajustado"
    ].transform("median")
    mediana_geral = df_completo["inse_ajustado"].median()
    mediana_corrigida = mediana_por_grupo.fillna(mediana_geral)

    logging.info("Criando a coluna final com os valores imputados.")
    df_completo["inse_imputado_final"] = df_completo["inse_valor"].fillna(
        mediana_corrigida
    )

    return df_completo


def run():
    """
    Orquestra a execução completa do pipeline de ETL.
    Lê os arquivos do S3 e executa as transformações em sequência.
    """
    logging.info("--- INICIANDO ORQUESTRAÇÃO COMPLETA DO PIPELINE DE ETL ---")

    load_dotenv()
    config = load_config()
    s3_config = config["s3"]
    storage_options = get_s3_storage_options()

    try:
        # Etapa 1: Carrega os DataFrames do S3
        logging.info("Carregando arquivos do S3 para a mesclagem...")
        df_censo = pd.read_parquet(
            f"s3://{s3_config['bucket_name']}/{s3_config['intermediate_folder']}/escolas_paraiba.parquet",
            storage_options=storage_options,
        )
        df_inse = pd.read_parquet(
            f"s3://{s3_config['bucket_name']}/{s3_config['intermediate_folder']}/inse_por_escola_pb.parquet",
            storage_options=storage_options,
        )

        logging.info(
            f"Censo carregado: {len(df_censo)} linhas, {len(df_censo.columns)} colunas"
        )

        logging.info(
            f"INSE carregado: {len(df_inse)} linhas, {len(df_inse.columns)} colunas"
        )

        logging.info("Arquivos carregados com sucesso.")

        logging.info("\n--- EXECUTANDO ETAPA 2: MESCLAGEM ---")
        df_completo = merge_censo_and_inse(df_inse=df_inse, df_censo_pb=df_censo)

        logging.info("\n--- EXECUTANDO ETAPA 3: IMPUTAÇÃO ---")
        df_final = impute_inse_values(df_completo=df_completo)

        logging.info("\n--- SALVANDO NO S3 ---")

        output_path = f"s3://{s3_config['bucket_name']}/{s3_config['processed_folder']}/censo_e_inse_publicas_pb.parquet"

        logging.info(f"Salvando o arquivo final em: {output_path}")

        df_final.to_parquet(output_path, index=False, storage_options=storage_options)

        logging.info("\n--- PIPELINE DE ETL CONCLUÍDO COM SUCESSO! ---")

        logging.info(f"Total de escolas processadas: {len(df_final)}")

        logging.info(
            f"Escolas com INSE original: {df_final['inse_valor'].notna().sum()}"
        )

        logging.info(
            f"Escolas com INSE imputado: {df_final['inse_valor'].isna().sum()}"
        )

        logging.info(
            f"Taxa de imputação: {(df_final['inse_valor'].isna().sum() / len(df_final) * 100):.2f}%"
        )

    except Exception as e:
        logging.error(f"Ocorreu um erro na execução do pipeline: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
