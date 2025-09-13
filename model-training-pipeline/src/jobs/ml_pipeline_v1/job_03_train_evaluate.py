import logging
import io
import joblib
import pandas as pd
from dotenv import load_dotenv
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from src.common.utils import get_s3_storage_options, load_config

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")


def _prepare_training_data(df: pd.DataFrame, base_features: list) -> tuple[pd.DataFrame, pd.Series]:
    logger.info("Separando conjunto de treinamento (escolas com dados reais de IDEB)...")
    training_df = df.dropna(subset=['ideb_anos_iniciais']).copy()
    y = training_df['ideb_imputado']
    features_categoricas = [col for col in training_df.columns if col.startswith(('TP_DEPENDENCIA_', 'TP_LOCALIZACAO_'))]
    feature_cols = base_features + features_categoricas
    existing_feature_cols = [col for col in feature_cols if col in training_df.columns]
    X = training_df[existing_feature_cols].fillna(0)
    logger.info(f"{len(training_df)} escolas com dados reais de IDEB para o treinamento.")
    logger.info(f"Shape X (features): {X.shape} | y (target): {y.shape}")
    return X, y

def _train_model(X_train: pd.DataFrame, y_train: pd.Series, model_params: dict) -> RandomForestRegressor:
    logger.info("Treinando o modelo RandomForestRegressor")
    model = RandomForestRegressor(**model_params)
    model.fit(X_train, y_train)
    logger.info("Modelo treinado com sucesso.")
    return model

def _evaluate_model(model: RandomForestRegressor, X_test: pd.DataFrame, y_test: pd.Series) -> dict:
    logger.info("Avaliando o modelo no conjunto de teste...")
    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    metrics = {"r2_score": r2, "mean_absolute_error": mae}
    logger.info(f"Performance do Modelo - R2 (R-squared): {r2:.4f}")
    logger.info(f"Performance do Modelo - MAE (Erro Médio Absoluto): {mae:.4f}")
    return metrics

def _get_feature_importance(model: RandomForestRegressor, features: list) -> pd.DataFrame:
    logger.info("Extraindo a importância das features do modelo...")
    importances_df = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    logger.info(f"Top 5 features mais importantes:\n{importances_df.head().to_string()}")
    return importances_df

def _save_model_to_s3(model, s3_path: str, storage_options: dict):
    """Salva o modelo usando joblib em um buffer e envia para o S3 via pandas."""
    logger.info(f"Salvando modelo em: {s3_path}")
    buffer = io.BytesIO()
    joblib.dump(model, buffer)
    buffer.seek(0)
    df_buffer = pd.DataFrame([{'model_binary': buffer.read()}])
    df_buffer.to_parquet(s3_path, index=False, storage_options=storage_options)

def _save_artifacts_to_s3(model, metrics: dict, importances: pd.DataFrame, paths: dict, s3_config: dict, storage_options: dict):
    """Orquestra o salvamento de todos os artefatos do modelo no S3."""
    bucket = s3_config['bucket_name']
    
    _save_model_to_s3(model, f"s3://{bucket}/{paths['model_artifact']}", storage_options)
    
    metrics_s3_path = f"s3://{bucket}/{paths['model_metrics']}"
    importances_s3_path = f"s3://{bucket}/{paths['feature_importances']}"
    
    pd.Series(metrics).to_json(metrics_s3_path, storage_options=storage_options, indent=4)
    logger.info(f"Métricas salvas em: {metrics_s3_path}")
    
    importances.to_json(importances_s3_path, storage_options=storage_options, orient='records', indent=4)
    logger.info(f"Importância das features salva em: {importances_s3_path}")

def run():
    """Orquestra o job de treinamento e avaliação do modelo."""
    logger.info("--- INICIANDO JOB 03: TRAIN & EVALUATE MODEL ---")
    
    try:
        load_dotenv()
        config = load_config("config/config.yaml")
        s3_config = config["s3"]
        paths = config["paths"]
        training_params = config["ml_pipeline_v1"]["training"]
        feature_defs = config["ml_pipeline_v1"]["feature_engineering"]["feature_definitions"]
        storage_options = get_s3_storage_options()

        input_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data']}"
        logger.info(f"Lendo dados com features de: {input_path}")
        df_featured = pd.read_parquet(input_path, storage_options=storage_options)

        X, y = _prepare_training_data(df_featured, feature_defs['base_model_features'])
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=training_params['test_size'], 
            random_state=training_params['random_state']
        )

        model = _train_model(X_train, y_train, training_params['model_params'])
        metrics = _evaluate_model(model, X_test, y_test)
        importances = _get_feature_importance(model, list(X_train.columns))

        _save_artifacts_to_s3(model, metrics, importances, paths, s3_config, storage_options)

    except Exception as e:
        logger.error(f"O Job 03 falhou: {e}", exc_info=True)
        raise
        
    logger.info("--- JOB 03: TRAIN & EVALUATE MODEL FINALIZADO COM SUCESSO ---")

if __name__ == "__main__":
    run()