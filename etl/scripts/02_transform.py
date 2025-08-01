import logging
from pathlib import Path

import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

# --- Constantes e Mapeamentos ---
COLUMNS_MAP = {
    "CO_ENTIDADE": "escola_id_inep",
    "NO_ENTIDADE": "escola_nome",
    "CO_MUNICIPIO": "municipio_id_ibge",
    "NO_MUNICIPIO": "municipio_nome",
    "SG_UF": "estado_sigla",
    "TP_DEPENDENCIA": "dependencia_adm",
    "TP_LOCALIZACAO": "tipo_localizacao",
    "QT_MAT_BAS": "total_alunos",
    "IN_BIBLIOTECA": "possui_biblioteca",
    "IN_INTERNET": "possui_internet",
    "IN_AGUA_POTAVEL": "possui_agua_potavel",
    "IN_ESGOTO_REDE_PUBLICA": "possui_saneamento_basico",
    "IN_ENERGIA_REDE_PUBLICA": "possui_energia_publica",
    "IN_QUADRA_ESPORTES": "possui_quadra_esportes",
    "IN_ACESSIBILIDADE_INEXISTENTE": "acessibilidade_inexistente",
}


def load_data(file_path: Path, is_csv=False) -> pd.DataFrame:
    """Carrega dados de um arquivo Parquet ou CSV."""
    logging.info(f"Carregando dados de: {file_path}")
    try:
        if is_csv:
            return pd.read_csv(file_path)
        return pd.read_parquet(file_path)
    except FileNotFoundError:
        logging.error(f"Arquivo não encontrado em {file_path}.")
        return pd.DataFrame()


def save_processed_data(df: pd.DataFrame, file_path: Path):
    """Salva o DataFrame processado."""
    logging.info(f"Salvando dados processados em {file_path}...")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(file_path, index=False)
    logging.info("Dados processados salvos com sucesso.")


def enrich_with_coordinates(
    df_escolas: pd.DataFrame, df_municipios: pd.DataFrame
) -> pd.DataFrame:
    """Enriquece os dados das escolas com coordenadas a partir do Código IBGE do município."""
    logging.info("Enriquecendo dados com coordenadas via Código IBGE do Município...")

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

    df_merged["latitude"] = df_merged["latitude"].fillna(0)
    df_merged["longitude"] = df_merged["longitude"].fillna(0)

    return df_merged


def transform_data(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica todas as lógicas de limpeza, estruturação e cálculo de score."""
    logging.info("Aplicando transformações finais...")
    dep_map = {1: "Federal", 2: "Estadual", 3: "Municipal", 4: "Privada"}
    df["dependencia_adm"] = df["dependencia_adm"].map(dep_map).fillna("Desconhecida")
    localizacao_map = {1: "Urbana", 2: "Rural"}
    df["tipo_localizacao"] = (
        df["tipo_localizacao"].map(localizacao_map).fillna("Desconhecida")
    )

    infra_cols = [
        v for k, v in COLUMNS_MAP.items() if k.startswith("IN_") and v in df.columns
    ]
    for col in infra_cols:
        df[col] = df[col].fillna(0).astype(bool)
    if "acessibilidade_inexistente" in df.columns:
        df["possui_acessibilidade_pcd"] = ~df["acessibilidade_inexistente"]

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

    def calculate_score(row):
        pontos = 0
        PONTUACAO_MAXIMA = 100
        infra = row.get("infraestrutura", {})
        if not infra.get("possui_saneamento_basico", True):
            pontos += 25
        if not infra.get("possui_agua_potavel", True):
            pontos += 20
        if not infra.get("possui_biblioteca", True):
            pontos += 20
        if not infra.get("possui_internet", True):
            pontos += 15
        if not infra.get("possui_quadra_esportes", True):
            pontos += 10
        if not infra.get("possui_acessibilidade_pcd", True):
            pontos += 10
        score_final = pontos / PONTUACAO_MAXIMA if PONTUACAO_MAXIMA > 0 else 0
        return min(round(score_final, 4), 1.0)

    df["score_de_risco"] = df.apply(calculate_score, axis=1)

    final_columns = [
        "escola_id_inep",
        "escola_nome",
        "municipio_id_ibge",
        "municipio_nome",
        "estado_sigla",
        "dependencia_adm",
        "tipo_localizacao",
        "infraestrutura",
        "indicadores",
        "localizacao",
        "score_de_risco",
    ]
    return df[final_columns]


def main():
    logging.info(
        "--- INICIANDO SCRIPT DE TRANSFORMAÇÃO E GEOCODING POR CÓDIGO IBGE ---"
    )

    base_path = Path(__file__).resolve().parents[1]
    escolas_path = base_path / "data/raw/escolas_paraiba.parquet"
    municipios_path = base_path / "data/municipios_brasileiros.csv"
    output_path = base_path / "data/processed/escolas_processado.parquet"

    df_escolas_raw = load_data(escolas_path)
    df_municipios = load_data(municipios_path, is_csv=True)

    if df_escolas_raw.empty or df_municipios.empty:
        logging.error(
            "Dados de escolas ou municípios não puderam ser carregados. Encerrando."
        )
        return

    df_renamed = df_escolas_raw.rename(
        columns={k: v for k, v in COLUMNS_MAP.items() if k in df_escolas_raw.columns}
    )

    df_with_coords = enrich_with_coordinates(df_renamed, df_municipios)

    df_final = transform_data(df_with_coords)

    save_processed_data(df_final, output_path)

    logging.info("\nDataFrame transformado final (primeiras 5 linhas):")
    logging.info(f"\n{df_final.head().to_string()}")

    logging.info("--- SCRIPT DE TRANSFORMAÇÃO E GEOCODING FINALIZADO ---")


if __name__ == "__main__":
    main()
