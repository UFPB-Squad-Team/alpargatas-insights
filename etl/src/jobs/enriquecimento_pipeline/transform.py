import logging
from pathlib import Path

import pandas as pd

from src.common.utils import load_config, normalize_text_for_matching

BASE_DIR = Path(__file__).resolve().parents[3]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def _process_extracted_data(
    df_dtb: pd.DataFrame, df_ia: pd.DataFrame, df_ideb: pd.DataFrame, config: dict
) -> tuple:
    """Aplica limpezas e normalizações iniciais nos DataFrames extraídos."""
    logging.info("Processando e normalizando dados extraídos...")

    df_dtb_processed = normalize_text_for_matching(df_dtb, "ds_mun")
    df_ia_processed = normalize_text_for_matching(df_ia, "ds_mun")

    df_ia_processed["nprojetos"] = pd.to_numeric(
        df_ia_processed["nprojetos"], errors="coerce"
    ).fillna(0)
    df_ia_processed["nbeneficiados"] = pd.to_numeric(
        df_ia_processed["nbeneficiados"], errors="coerce"
    ).fillna(0)
    df_ia_processed.dropna(subset=["ds_mun", "sg_uf"], inplace=True)
    df_ia_processed = df_ia_processed[
        df_ia_processed["sg_uf"].isin(config["valid_ufs"])
    ]
    df_ia_processed["ds_uf"] = df_ia_processed["sg_uf"].map(config["uf_map"])

    df_ideb_processed = df_ideb[df_ideb["rede"] == "Pública"].copy()
    return df_dtb_processed, df_ia_processed, df_ideb_processed


def _create_municipal_summary(
    df_dtb: pd.DataFrame, df_ia: pd.DataFrame, df_ideb: pd.DataFrame
) -> pd.DataFrame:
    """Cria um DataFrame agregado com indicadores por município."""
    logging.info("Criando sumário de indicadores por município...")

    df_merged = pd.merge(df_ia, df_dtb, on=["ds_mun_normalized", "ds_uf"], how="inner")

    df_merged = pd.merge(df_merged, df_ideb, on="id_mundv", how="left")

    df_agg = (
        df_merged.groupby("id_mundv")
        .agg(
            municipioSomaProjetos=("nprojetos", "sum"),
            municipioSomaBeneficiados=("nbeneficiados", "sum"),
            municipioMediaIdeb2023=("ideb_2023", "mean"),
        )
        .reset_index()
    )
    df_agg.rename(columns={"id_mundv": "municipioIdIbge"}, inplace=True)
    return df_agg


def _enrich_school_data(
    df_escolas: pd.DataFrame, df_municipal: pd.DataFrame, weights: dict
) -> pd.DataFrame:
    """Enriquece os dados das escolas com os indicadores municipais e o score contextualizado."""
    logging.info("Enriquecendo dados das escolas com o contexto municipal...")

    df_escolas["municipioIdIbge"] = pd.to_numeric(df_escolas["municipioIdIbge"]).astype(
        "int64"
    )
    df_municipal["municipioIdIbge"] = pd.to_numeric(
        df_municipal["municipioIdIbge"]
    ).astype("int64")

    df_enriched = pd.merge(df_escolas, df_municipal, on="municipioIdIbge", how="left")

    df_enriched["risco_ideb_municipio"] = 1 - (
        df_enriched["municipioMediaIdeb2023"] / 10
    )

    df_enriched["scoreRiscoContextualizado"] = (
        weights["base_score_peso"] * df_enriched["scoreRisco"]
        + weights["ideb_score_peso"] * df_enriched["risco_ideb_municipio"]
    ).fillna(df_enriched["scoreRisco"])

    return df_enriched


def run(df_dtb: pd.DataFrame, df_ia: pd.DataFrame, df_ideb: pd.DataFrame):
    """Orquestra a transformação e enriquecimento dos dados das escolas."""
    logging.info(" INICIANDO TRANSFORMAÇÃO (PIPELINE DE ENRIQUECIMENTO)")

    config = load_config()
    paths = config["paths"]
    transform_config = config["professor_pipeline"]["transform"]

    df_dtb_p, df_ia_p, df_ideb_p = _process_extracted_data(
        df_dtb, df_ia, df_ideb, transform_config
    )

    df_municipal_summary = _create_municipal_summary(df_dtb_p, df_ia_p, df_ideb_p)
    path_auditoria = BASE_DIR / paths["processed_professor_auditoria"]
    path_auditoria.parent.mkdir(parents=True, exist_ok=True)
    df_municipal_summary.to_parquet(path_auditoria, index=False)
    logging.info(f"Arquivo de auditoria municipal salvo em: {path_auditoria}")

    df_escolas_base = pd.read_parquet(BASE_DIR / paths["processed_escolas"])
    df_final = _enrich_school_data(
        df_escolas=df_escolas_base,
        df_municipal=df_municipal_summary,
        weights=transform_config["contextualized_score_weights"],
    )

    path_final = BASE_DIR / paths["processed_professor_final"]
    df_final.to_parquet(path_final, index=False)
    logging.info(f"Dataset final enriquecido salvo em: {path_final}")
    logging.info(" TRANSFORMAÇÃO (PIPELINE DE ENRIQUECIMENTO) FINALIZADA ")
