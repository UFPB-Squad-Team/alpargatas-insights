import logging

import geopandas as gpd
import numpy as np
import pandas as pd

from src.common.utils import (
    get_s3_storage_options,
    load_config,
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)


def _calculate_direct_weighted_average(
    gdf_escolas_proj: gpd.GeoDataFrame,
    gdf_malha_proj: gpd.GeoDataFrame,
    socioeconomic_cols: list,
) -> pd.DataFrame:
    """
    Calcula a média ponderada por área para todas as escolas.
    """
    logging.info("Etapa 1: Calculando a média ponderada por intersecção de área...")

    intersection_gdf = gpd.overlay(gdf_escolas_proj, gdf_malha_proj, how="intersection")
    intersection_gdf["intersection_area"] = intersection_gdf.geometry.area

    for col in socioeconomic_cols:
        intersection_gdf[f"weighted_{col}"] = (
            intersection_gdf[col].fillna(0) * intersection_gdf["intersection_area"]
        )

    grouped = intersection_gdf.groupby("escolaIdInep").agg(
        total_intersection_area=("intersection_area", "sum"),
        **{
            f"sum_weighted_{col}": (f"weighted_{col}", "sum")
            for col in socioeconomic_cols
        },
    )

    df_neighborhood = pd.DataFrame(index=grouped.index)
    for col in socioeconomic_cols:
        numerator = grouped.get(f"sum_weighted_{col}", 0)
        denominator = grouped.get("total_intersection_area", 0)
        df_neighborhood[f"viz_{col}"] = np.divide(
            numerator,
            denominator,
            out=np.zeros_like(numerator, dtype=float),
            where=(denominator != 0),
        )

    return df_neighborhood


def _impute_missing_with_knn_median(
    df_neighborhood: pd.DataFrame,
    gdf_escolas: gpd.GeoDataFrame,
    gdf_malha_completa: gpd.GeoDataFrame,
    socioeconomic_cols: list,
) -> pd.DataFrame:
    """
    Identifica dados faltantes e os imputa com a mediana dos 5 vizinhos mais próximos.
    """
    df_imputed = df_neighborhood.copy()
    df_imputed["viz_dados_imputados"] = False

    escolas_sem_dados_ids = df_imputed[
        df_imputed[f"viz_{socioeconomic_cols[0]}"] <= 0
    ].index

    logging.info(
        f"Encontradas {len(escolas_sem_dados_ids)} escolas para imputação. Iniciando busca por vizinhos..."
    )
    if len(escolas_sem_dados_ids) == 0:
        return df_imputed

    gdf_good_sectors = gdf_malha_completa[
        gdf_malha_completa["renda_media_domiciliar_setor"] > 0
    ].copy()

    target_crs = "EPSG:31985"
    gdf_escolas_to_impute_proj = gdf_escolas[
        gdf_escolas["escolaIdInep"].isin(escolas_sem_dados_ids)
    ].to_crs(target_crs)
    gdf_good_sectors_proj = gdf_good_sectors.to_crs(target_crs)
    gdf_good_sectors_proj["centroid"] = gdf_good_sectors_proj.geometry.centroid

    for escola_tuple in gdf_escolas_to_impute_proj.itertuples():
        escola_id = escola_tuple.escolaIdInep
        ponto_escola = escola_tuple.geometry

        distancias = gdf_good_sectors_proj["centroid"].distance(ponto_escola)
        nearest_sectors_idx = distancias.nsmallest(5).index

        median_values = gdf_good_sectors.loc[
            nearest_sectors_idx, socioeconomic_cols
        ].median()

        for col in socioeconomic_cols:
            df_imputed.loc[escola_id, f"viz_{col}"] = median_values[col]

        df_imputed.loc[escola_id, "viz_dados_imputados"] = True

    return df_imputed


def _calculate_municipal_profile(df_censo_renda: pd.DataFrame) -> pd.DataFrame:
    """
    Agrega os dados de renda dos setores para o nível de município.
    """
    logging.info("Calculando perfil socioeconômico por município...")
    df_valid_renda = df_censo_renda[
        df_censo_renda["renda_media_domiciliar_setor"] > 0
    ].copy()
    df_valid_renda["municipioIdIbge"] = (
        df_valid_renda["id_setor_censitario"].str[:7].astype(int)
    )
    socioeconomic_cols = [
        col
        for col in df_valid_renda.columns
        if col.startswith(("total_", "domicilios_", "renda_"))
    ]
    rename_map = {col: f"mun_{col}" for col in socioeconomic_cols}
    df_municipio_profile = (
        df_valid_renda.groupby("municipioIdIbge")[socioeconomic_cols]
        .mean()
        .rename(columns=rename_map)
    )
    return df_municipio_profile.reset_index()


def _calculate_neighborhood_profile(
    gdf_escolas: gpd.GeoDataFrame, gdf_malha_completa: gpd.GeoDataFrame
) -> pd.DataFrame:
    """
    Orquestra o cálculo do perfil da vizinhança.
    """
    logging.info(
        "Calculando perfil socioeconômico da vizinhança (abordagem híbrida)..."
    )

    target_crs = "EPSG:31985"
    gdf_escolas_proj = gdf_escolas.to_crs(target_crs)
    gdf_escolas_proj["geometry_buffer"] = gdf_escolas_proj.geometry.buffer(500)
    gdf_escolas_proj.set_geometry("geometry_buffer", inplace=True)
    gdf_malha_proj = gdf_malha_completa.to_crs(target_crs)

    socioeconomic_cols = [
        col
        for col in gdf_malha_completa.columns
        if col.startswith(("total_", "domicilios_", "renda_"))
    ]

    # 1. Calcula os valores diretos
    df_direct_avg = _calculate_direct_weighted_average(
        gdf_escolas_proj, gdf_malha_proj, socioeconomic_cols
    )

    # 2. Imputa os valores faltantes
    df_final_profile = _impute_missing_with_knn_median(
        df_direct_avg, gdf_escolas, gdf_malha_completa, socioeconomic_cols
    )

    logging.info("Cálculo do perfil da vizinhança finalizado.")
    return df_final_profile.reset_index().rename(columns={"index": "escolaIdInep"})


def _treat_outliers(
    df: pd.DataFrame, columns: list, lower_quantile=0.01, upper_quantile=0.99
) -> pd.DataFrame:
    """
    Trata outliers em colunas especificadas usando a técnica de capping (Winsorizing).
    """
    logging.info(f"Tratando outliers para as colunas: {columns}")
    df_capped = df.copy()
    for col in columns:
        if col in df_capped.columns:
            lower_bound = df_capped[col].quantile(lower_quantile)
            upper_bound = df_capped[col].quantile(upper_quantile)
            df_capped[col] = df_capped[col].clip(lower=lower_bound, upper=upper_bound)
            logging.info(
                f"Coluna '{col}': valores limitados entre {lower_bound:.2f} e {upper_bound:.2f}"
            )
    return df_capped


def _structure_final_output(df: pd.DataFrame) -> pd.DataFrame:
    """
    Estrutura o DataFrame final para o formato aninhado, com os dois contextos.
    """
    logging.info("Estruturando o DataFrame final para o formato aninhado...")
    municipal_cols = [col for col in df.columns if col.startswith("mun_")]
    neighborhood_cols = [col for col in df.columns if col.startswith("viz_")]
    df["contextoMunicipal"] = df[municipal_cols].to_dict(orient="records")
    df["contextoVizinhança"] = df[neighborhood_cols].to_dict(orient="records")
    final_schema_order = [
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
        "contextoMunicipal",
        "contextoVizinhança",
    ]
    df_structured = df.drop(columns=municipal_cols + neighborhood_cols)
    return df_structured[
        [col for col in final_schema_order if col in df_structured.columns]
    ]


def run():
    """
    Função principal que orquestra todo o pipeline de transformação.
    """
    logging.info(
        "--- INICIANDO PIPELINE DE TRANSFORMAÇÃO: RENDA CENSO (SETOR CENSITÁRIO) ---"
    )
    try:
        config = load_config()
        s3_config = config["s3"]
        paths_config = config["paths"]
        storage_options = get_s3_storage_options()

        # 1. Carregamento dos dados
        logging.info("Carregando dados de entrada...")
        df_escolas = pd.read_parquet(
            f"s3://{s3_config['bucket_name']}/{paths_config['processed_escolas']}",
            storage_options=storage_options,
        )
        df_censo_renda = pd.read_parquet(
            f"s3://{s3_config['bucket_name']}/{paths_config['intermediate_malha_setorial']}",
            storage_options=storage_options,
        )
        gdf_malha_setores = gpd.read_file(
            f"s3://{s3_config['bucket_name']}/{paths_config['raw_malha_setorial']}",
            storage_options=storage_options,
            engine="fiona",
        )

        # 2. Preparação dos dados
        id_setor_col_name = next(
            (col for col in gdf_malha_setores.columns if "CD_SETOR" in col.upper())
        )
        gdf_malha_setores["id_setor_censitario"] = gdf_malha_setores[
            id_setor_col_name
        ].astype(str)
        df_censo_renda["id_setor_censitario"] = df_censo_renda[
            "id_setor_censitario"
        ].astype(str)
        gdf_malha_completa = gdf_malha_setores.merge(
            df_censo_renda, on="id_setor_censitario", how="left"
        )
        coords = df_escolas["localizacao"].apply(
            lambda loc: loc.get("coordinates", [None, None])
        )
        gdf_escolas = gpd.GeoDataFrame(
            df_escolas,
            geometry=gpd.points_from_xy(
                coords.apply(lambda c: c[0]), coords.apply(lambda c: c[1])
            ),
            crs="EPSG:4326",
        ).dropna(subset=["geometry"])

        # 3. Execução das etapas de cálculo
        df_municipal_profile = _calculate_municipal_profile(df_censo_renda)
        df_neighborhood_profile = _calculate_neighborhood_profile(
            gdf_escolas, gdf_malha_completa
        )

        # 4. Junção dos resultados
        logging.info("Unindo todos os perfis calculados...")
        df_merged_1 = pd.merge(
            gdf_escolas.drop(columns="geometry"),
            df_municipal_profile,
            on="municipioIdIbge",
            how="left",
        )

        df_final_merged = pd.merge(
            df_merged_1, df_neighborhood_profile, on="escolaIdInep", how="left"
        )

        # 5. Tratamento de outliers
        cols_to_cap = [col for col in df_final_merged.columns if "renda_media" in col]
        df_treated = _treat_outliers(df_final_merged, cols_to_cap)
        municipal_cols_final = [
            col for col in df_treated.columns if col.startswith("mun_")
        ]
        df_treated[municipal_cols_final] = df_treated[municipal_cols_final].fillna(0)

        # 6. Estruturação final
        df_final = _structure_final_output(df_treated)

        # 7. Salvamento
        output_path = f"s3://{s3_config['bucket_name']}/{paths_config['processed_escolas_setorial']}"
        logging.info(f"Salvando base de dados final em: {output_path}")
        df_final.to_parquet(output_path, index=False, storage_options=storage_options)
        logging.info("--- PIPELINE FINALIZADA COM SUCESSO! ---")

    except Exception as e:
        logging.error(f"Ocorreu um erro na execução do pipeline: {e}", exc_info=True)
        raise
