import logging
import numpy as np
import math
import pandas as pd
from dotenv import load_dotenv

from src.common.utils import get_s3_storage_options, load_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _rename_initial_columns(df: pd.DataFrame, column_map: dict) -> pd.DataFrame:
    """Renomeia as colunas iniciais do DataFrame bruto."""
    logging.info("Renomeando colunas para o padrão do projeto...")
    valid_column_map = {k: v for k, v in column_map.items() if k in df.columns}
    return df.rename(columns=valid_column_map)


def _enrich_with_coordinates(
    df_escolas: pd.DataFrame, df_municipios: pd.DataFrame
) -> pd.DataFrame:
    """Enriquece os dados das escolas com coordenadas a partir do Código IBGE."""
    logging.info("Enriquecendo dados com coordenadas dos municípios...")
    df_coords = df_municipios[["codigo_ibge", "latitude", "longitude"]].copy()
    df_escolas["municipio_id_ibge"] = pd.to_numeric(
        df_escolas["municipio_id_ibge"], errors="coerce"
    )
    df_coords["codigo_ibge"] = pd.to_numeric(df_coords["codigo_ibge"], errors="coerce")
    df_merged = pd.merge(
        df_escolas,
        df_coords,
        left_on="municipio_id_ibge",
        right_on="codigo_ibge",
        how="left",
    )
    df_merged.drop(columns=["codigo_ibge"], inplace=True)
    df_merged[["latitude", "longitude"]] = df_merged[["latitude", "longitude"]].fillna(
        0
    )
    return df_merged


def _map_categorical_values(df: pd.DataFrame, categorical_maps: dict) -> pd.DataFrame:
    """Mapeia valores numéricos de colunas categóricas para strings descritivas."""
    logging.info("Mapeando valores de colunas categóricas...")
    df["dependencia_adm"] = (
        df["dependencia_adm"]
        .map(categorical_maps["dependencia_adm"])
        .fillna("Desconhecida")
    )
    df["tipo_localizacao"] = (
        df["tipo_localizacao"]
        .map(categorical_maps["tipo_localizacao"])
        .fillna("Desconhecida")
    )
    return df


def _process_infra_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Converte colunas de infraestrutura para booleano e cria a coluna de acessibilidade."""
    logging.info("Processando e limpando colunas de infraestrutura...")
    infra_cols = [col for col in df.columns if col.startswith("possui_")]
    if "acessibilidade_inexistente" in df.columns:
        infra_cols.append("acessibilidade_inexistente")
        df["possui_acessibilidade_pcd"] = ~df["acessibilidade_inexistente"].fillna(
            0
        ).astype(bool)
    for col in infra_cols:
        df[col] = df[col].fillna(0).astype(bool)
    return df

def add_jitter_to_coordinates(df: pd.DataFrame) -> pd.DataFrame:
    """Adiciona jitter às coordenadas geográficas para evitar sobreposição."""
    logging.info("Adicionando jitter às coordenadas geográficas...")

    MAX_JITTER_KM = 2.5 # Jitter radius in kilometers
    KM_PER_DEGREE = 111.32 # Degrees to kilometers conversion factor 

    df['jitter_radius_km'] = np.random.uniform(0, MAX_JITTER_KM, size=len(df))
    df['jitter_angle_rad'] = np.random.uniform(0, 2 * math.pi, size=len(df))

    delta_x_km = df['jitter_radius_km'] * np.cos(df['jitter_angle_rad'])
    delta_y_km = df['jitter_radius_km'] * np.sin(df['jitter_angle_rad'])

    df['longitude'] = df['longitude'] + delta_x_km / (KM_PER_DEGREE * np.cos(np.radians(df['latitude'])))
    df['latitude'] = df['latitude'] + delta_y_km / KM_PER_DEGREE

    return df

def _calculate_risk_score(row: pd.Series, weights: dict) -> float:
    """Calcula o score de risco para uma única linha (escola), baseado nos pesos."""
    pontos = 0
    infra = row.get("infraestrutura", {})
    if not infra.get("possui_saneamento_basico", True):
        pontos += weights["saneamento_basico"]
    if not infra.get("possui_agua_potavel", True):
        pontos += weights["agua_potavel"]
    if not infra.get("possui_biblioteca", True):
        pontos += weights["biblioteca"]
    if not infra.get("possui_internet", True):
        pontos += weights["internet"]
    if not infra.get("possui_quadra_esportes", True):
        pontos += weights["quadra_esportes"]
    if not infra.get("possui_acessibilidade_pcd", True):
        pontos += weights["acessibilidade_pcd"]
    score_final = pontos / weights["pontuacao_maxima"]
    return min(round(score_final, 4), 1.0)


def _structure_for_nosql(df: pd.DataFrame) -> pd.DataFrame:
    """Estrutura colunas em sub-documentos para compatibilidade com NoSQL (MongoDB)."""
    logging.info(
        "Estruturando colunas em sub-documentos (infraestrutura, localizacao)..."
    )
    df["total_alunos"] = pd.to_numeric(df["total_alunos"], errors="coerce").fillna(0)
    infra_cols_final = [col for col in df.columns if col.startswith("possui_")]
    df["infraestrutura"] = df[infra_cols_final].to_dict(orient="records")
    df["indicadores"] = df[["total_alunos"]].to_dict(orient="records")
    df["localizacao"] = df.apply(
        lambda row: {
            "type": "Point",
            "coordinates": [row["longitude"], row["latitude"]],
        },
        axis=1,
    )
    return df


def _finalize_schema(df: pd.DataFrame) -> pd.DataFrame:
    """Renomeia colunas para camelCase e seleciona/ordena o schema final."""
    logging.info(
        "Finalizando o schema: renomeando para camelCase e ordenando colunas..."
    )
    rename_map = {
        "escola_id_inep": "escolaIdInep",
        "escola_nome": "escolaNome",
        "municipio_id_ibge": "municipioIdIbge",
        "municipio_nome": "municipioNome",
        "estado_sigla": "estadoSigla",
        "dependencia_adm": "dependenciaAdm",
        "tipo_localizacao": "tipoLocalizacao",
        "score_de_risco": "scoreRisco",
    }
    df_renamed = df.rename(columns=rename_map)
    final_columns = [
        "escolaIdInep",
        "escolaNome",
        "municipioIdIbge",
        "municipioNome",
        "estadoSigla",
        "dependenciaAdm",
        "tipoLocalizacao",
        "infraestrutura",
        "indicadores",
        "localizacao",
        "scoreRisco",
    ]
    return df_renamed[final_columns]


def run():
    """Orquestra a execução do job de transformação lendo e escrevendo no S3."""
    logging.info("--- INICIANDO JOB DE TRANSFORMAÇÃO (PIPELINE DE ESCOLAS) DO S3 ---")

    load_dotenv()
    config = load_config()
    s3_config = config["s3"]
    paths = config["paths"]
    transform_config = config["escolas_pipeline"]["transform"]
    storage_options = get_s3_storage_options()

    try:
        escolas_path = (
            f"s3://{s3_config['bucket_name']}/{paths['intermediate_escolas_paraiba']}"
        )
        municipios_path = (
            f"s3://{s3_config['bucket_name']}/{paths['raw_municipios_brasileiros']}"
        )

        logging.info(f"Lendo dados de escolas de: {escolas_path}")
        df_escolas = pd.read_parquet(escolas_path, storage_options=storage_options)

        logging.info(f"Lendo dados de municípios de: {municipios_path}")
        df_municipios = pd.read_csv(municipios_path, storage_options=storage_options)


        df_renamed = _rename_initial_columns(df_escolas, transform_config["column_map"])
        df_with_coords = _enrich_with_coordinates(df_renamed, df_municipios)
        df_mapped = _map_categorical_values(
            df_with_coords, transform_config["categorical_maps"]
        )
        df_jittered = add_jitter_to_coordinates(df_mapped)
        df_infra_processed = _process_infra_columns(df_mapped)
        df_structured = _structure_for_nosql(df_infra_processed)

        risk_weights = transform_config["risk_score_weights"]
        df_structured["score_de_risco"] = df_structured.apply(
            lambda row: _calculate_risk_score(row, risk_weights), axis=1
        )

        df_final = _finalize_schema(df_structured)

        output_path = f"s3://{s3_config['bucket_name']}/{paths['processed_escolas']}"
        logging.info(f"Salvando dados transformados no S3 em: {output_path}")
        df_final.to_parquet(output_path, index=False, storage_options=storage_options)

        logging.info("\n--- JOB DE TRANSFORMAÇÃO (S3) FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(f"Falha na execução do job de transformação: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
