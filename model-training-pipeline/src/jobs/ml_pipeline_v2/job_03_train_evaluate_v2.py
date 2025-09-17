import logging
import pandas as pd
from dotenv import load_dotenv
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
import mlflow
import mlflow.sklearn
from typing import Dict, Tuple

from src.common.utils import get_s3_storage_options, load_config

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)



def _load_featured_dataset(s3_config: Dict, paths: Dict, storage_options: Dict) -> pd.DataFrame:
    """Carrega o dataset com features do S3."""
    input_path = f"s3://{s3_config['bucket_name']}/{paths['featured_data_v2']}"
    logger.info(f"Lendo dados com features (V2) de: {input_path}")
    return pd.read_parquet(input_path, storage_options=storage_options)


def _prepare_training_data(df: pd.DataFrame, base_features: list) -> Tuple[pd.DataFrame, pd.Series]:
    """Isola a amostra de treinamento e prepara os dataframes X e y."""
    logger.info("Separando conjunto de treinamento (escolas com dados reais de IDEB)...")
    training_df = df.dropna(subset=['ideb_anos_iniciais']).copy()
    y = training_df['ideb_anos_iniciais']  # Usamos o IDEB real como alvo

    features_categoricas = [
        col for col in training_df.columns
        if col.startswith(('TP_DEPENDENCIA_', 'TP_LOCALIZACAO_'))
    ]
    feature_cols = base_features + features_categoricas

    existing_feature_cols = [col for col in feature_cols if col in training_df.columns]
    X = training_df[existing_feature_cols].fillna(0)

    logger.info(f"Amostra de treinamento contém {len(training_df)} escolas.")
    logger.info(f"Shape de X (features): {X.shape} | Shape de y (alvo): {y.shape}")
    return X, y

def _treat_socioeconomic_outliers(X: pd.DataFrame, treatment_params: Dict) -> pd.DataFrame:
    """Aplica o capping (winsorização) em colunas socioeconômicas com outliers."""
    if not treatment_params.get('enabled', False):
        logger.info("Tratamento de outliers desabilitado. Pulando esta etapa.")
        return X

    logger.info("Iniciando tratamento de outliers para features socioeconômicas...")
    X_copy = X.copy()
    quantile = treatment_params['quantile']
    columns_to_cap = treatment_params['columns_to_cap']

    for col in columns_to_cap:
        if col in X_copy.columns:
            cap_value = X_copy[col].quantile(quantile)
            logger.info(f"Limitando '{col}' no percentil {quantile*100:.0f} (valor: {cap_value:.2f})")
            X_copy[col] = X_copy[col].clip(upper=cap_value)
            
    return X_copy

def _train_and_evaluate(
    X: pd.DataFrame, 
    y: pd.Series, 
    params: dict
) -> Tuple[RandomForestRegressor, dict, pd.DataFrame]:
    """Executa o workflow de split, treino e avaliação do modelo."""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=params['test_size'], random_state=params['random_state']
    )

    logger.info("Treinando o modelo RandomForestRegressor (V2)...")
    model = RandomForestRegressor(**params['model_params'])
    model.fit(X_train, y_train)
    logger.info("Modelo V2 treinado com sucesso.")

    logger.info("Avaliando o modelo V2 no conjunto de teste...")
    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    metrics = {"r2_score": r2, "mean_absolute_error": mae}
    logger.info(f"Performance do Modelo V2 - R2: {r2:.4f} | MAE: {mae:.4f}")

    logger.info("Extraindo a importância das features do modelo V2...")
    importances = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    logger.info(f"Top 5 features mais importantes (V2):\n{importances.head().to_string()}")

    return model, metrics, importances


def _track_with_mlflow(model: RandomForestRegressor, metrics: dict, params: dict, importances: pd.DataFrame):
    """Faz o tracking do experimento localmente com MLflow."""
    logger.info("Iniciando tracking local com MLflow...")
    mlflow.set_experiment("Modelo_Diagnostico_IDEB_V2_Local")

    with mlflow.start_run():
        mlflow.log_params(params['model_params'])
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(model, "modelo_contextual_rf_v2")
        importances.to_csv("feature_importances_v2.csv", index=False)
        mlflow.log_artifact("feature_importances_v2.csv")

    logger.info("Experimento V2 logado com sucesso localmente na pasta 'mlruns'.")


def _save_weights_to_s3(importances_df: pd.DataFrame, s3_config: Dict, paths: Dict, storage_options: Dict):
    """Salva o DataFrame de importância de features no S3."""
    weights_s3_path = f"s3://{s3_config['bucket_name']}/{paths['feature_importances_v2']}"
    logger.info(f"Salvando pesos do modelo (feature importances) em: {weights_s3_path}")
    importances_df.to_json(weights_s3_path, storage_options=storage_options, orient='records', indent=4)
    logger.info("Pesos salvos com sucesso no S3.")


def run():
    """Orquestra o job de treinamento e avaliação para o Modelo V2."""
    logger.info("--- INICIANDO JOB 03 (V2): TRAIN & EVALUATE ---")
    try:
        load_dotenv()
        config = load_config("config/config.yaml")
        s3_config, paths = config["s3"], config["paths"]
        training_params = config["ml_pipeline_v2"]["training"]
        feature_defs = config["ml_pipeline_v2"]["feature_engineering"]["feature_definitions"]
        storage_options = get_s3_storage_options()

        df_featured = _load_featured_dataset(s3_config, paths, storage_options)

        X, y = _prepare_training_data(df_featured, feature_defs['base_model_features'])
        
        X_treated = _treat_socioeconomic_outliers(X, training_params.get('outlier_treatment', {}))

        model, metrics, importances = _train_and_evaluate(X, y, training_params)

        _track_with_mlflow(model, metrics, training_params, importances)

        _save_weights_to_s3(importances, s3_config, paths, storage_options)

        logger.info("--- JOB 03 (V2): TRAIN & EVALUATE FINALIZADO COM SUCESSO ---")
    except Exception as e:
        logger.error(f"O Job 03 (V2) falhou: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    run()
