import logging
from pathlib import Path

import pandas as pd

from src.common.utils import load_config

BASE_DIR = Path(__file__).resolve().parents[3]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)


def _rename_initial_columns(df: pd.DataFrame, column_map: dict) -> pd.DataFrame:
    logging.info("Renomeando colunas para o padrão do projeto...")
    valid_column_map = {k: v for k, v in column_map.items() if k in df.columns}
    return df.rename(columns=valid_column_map)


def _enrich_with_coordinates(
    df_escolas: pd.DataFrame, df_municipios: pd.DataFrame
) -> pd.DataFrame:
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


def _calculate_risk_score(row: pd.Series, weights: dict) -> float:
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
    """Orquestra a execução do job de transformação."""
    logging.info("--- INICIANDO JOB DE TRANSFORMAÇÃO (PIPELINE DE ESCOLAS) ---")

    config = load_config()
    paths = config["paths"]
    transform_config = config["escolas_pipeline"]["transform"]

    try:
        df_escolas = pd.read_parquet(BASE_DIR / paths["raw_escolas_paraiba"])
        df_municipios = pd.read_csv(BASE_DIR / paths["raw_municipios_brasileiros"])

        df_renamed = _rename_initial_columns(df_escolas, transform_config["column_map"])
        df_with_coords = _enrich_with_coordinates(df_renamed, df_municipios)
        df_mapped = _map_categorical_values(
            df_with_coords, transform_config["categorical_maps"]
        )
        df_infra_processed = _process_infra_columns(df_mapped)
        df_structured = _structure_for_nosql(df_infra_processed)

        risk_weights = transform_config["risk_score_weights"]

        df_structured["score_de_risco"] = df_structured.apply(
            lambda row: _calculate_risk_score(row, risk_weights), axis=1
        )

        df_final = _finalize_schema(df_structured)

        output_path = BASE_DIR / paths["processed_escolas"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        df_final.to_parquet(output_path, index=False)

        logging.info(f"Dados transformados salvos com sucesso em {output_path}")
        logging.info("\n--- JOB DE TRANSFORMAÇÃO FINALIZADO COM SUCESSO ---")

    except Exception as e:
        logging.error(f"Falha na execução do job de transformação: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
