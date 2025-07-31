import logging
import pandas as pd
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)

# Constantes globais
COLUNAS_ESPERADAS_NO_RAW_DF = [
    'SG_UF', 'TP_DEPENDENCIA', 'TP_SITUACAO_FUNCIONAMENTO', 'TP_LOCALIZACAO',
    'IN_AGUA_POTAVEL', 'IN_AGUA_REDE_PUBLICA', 'IN_AGUA_POCO_ARTESIANO', 'IN_AGUA_CACIMBA',
    'IN_AGUA_FONTE_RIO', 'IN_AGUA_INEXISTENTE',
    'IN_ENERGIA_REDE_PUBLICA', 'IN_ENERGIA_GERADOR_FOSSIL', 'IN_ENERGIA_RENOVAVEL', 'IN_ENERGIA_INEXISTENTE',
    'IN_ESGOTO_REDE_PUBLICA', 'IN_ESGOTO_FOSSA_SEPTICA', 'IN_ESGOTO_FOSSA_COMUM', 'IN_ESGOTO_FOSSA', 'IN_ESGOTO_INEXISTENTE',
    'IN_LIXO_SERVICO_COLETA', 'IN_LIXO_QUEIMA', 'IN_LIXO_ENTERRA', 'IN_LIXO_DESTINO_FINAL_PUBLICO',
    'IN_LIXO_DESCARTA_OUTRA_AREA','IN_BANHEIRO', 'IN_BANHEIRO_PNE',
    'IN_QUADRA_ESPORTES','IN_INTERNET', 'IN_COMPUTADOR', 'IN_ACESSIBILIDADE_INEXISTENTE'
]

COLUMNS_MAP_COMPLETO = {
    # Colunas de Identidade
    'SG_UF': 'estado_sigla',
    'TP_DEPENDENCIA': 'dependencia_adm',
    'TP_SITUACAO_FUNCIONAMENTO': 'situacao_funcionamento',
    'TP_LOCALIZACAO': 'tipo_localizacao',

    # Colunas de Infraestrutura - Água
    'IN_AGUA_POTAVEL': 'infra_agua_potavel',
    'IN_AGUA_REDE_PUBLICA': 'infra_agua_rede_publica',
    'IN_AGUA_POCO_ARTESIANO': 'infra_agua_poco_artesiano',
    'IN_AGUA_CACIMBA': 'infra_agua_cacimba',
    'IN_AGUA_FONTE_RIO': 'infra_agua_fonte_rio',
    'IN_AGUA_INEXISTENTE': 'infra_agua_inexistente',

    # Colunas de Infraestrutura - Energia
    'IN_ENERGIA_REDE_PUBLICA': 'infra_energia_publica',
    'IN_ENERGIA_GERADOR_FOSSIL': 'infra_energia_gerador_fossil',
    'IN_ENERGIA_RENOVAVEL': 'infra_energia_renovavel',
    'IN_ENERGIA_INEXISTENTE': 'infra_energia_inexistente',

    # Colunas de Infraestrutura - Esgoto
    'IN_ESGOTO_REDE_PUBLICA': 'infra_esgoto_publico',
    'IN_ESGOTO_FOSSA_SEPTICA': 'infra_esgoto_fossa_septica',
    'IN_ESGOTO_FOSSA_COMUM': 'infra_esgoto_fossa_comum',
    'IN_ESGOTO_FOSSA': 'infra_esgoto_fossa',
    'IN_ESGOTO_INEXISTENTE': 'infra_esgoto_inexistente',

    # Colunas de Infraestrutura - Lixo
    'IN_LIXO_SERVICO_COLETA': 'infra_lixo_servico_coleta',
    'IN_LIXO_QUEIMA': 'infra_lixo_queima',
    'IN_LIXO_ENTERRA': 'infra_lixo_enterra',
    'IN_LIXO_DESTINO_FINAL_PUBLICO': 'infra_lixo_destino_final_publico',
    'IN_LIXO_DESCARTA_OUTRA_AREA': 'infra_lixo_descarta_outra_area',

    # Colunas de Infraestrutura - Outros
    'IN_BANHEIRO': 'infra_banheiro',
    'IN_BANHEIRO_PNE': 'infra_banheiro_pne',
    'IN_QUADRA_ESPORTES': 'infra_quadra_esportes',
    'IN_INTERNET': 'infra_internet',
    'IN_COMPUTADOR': 'infra_computador',
    'IN_ACESSIBILIDADE_INEXISTENTE': 'infra_acessibilidade_inexistente'
}

COLUNAS_DE_INFRA_RENOMEADAS = [
    'infra_agua_potavel',
    'infra_agua_rede_publica',
    'infra_agua_poco_artesiano',
    'infra_agua_cacimba',
    'infra_agua_fonte_rio',
    'infra_agua_inexistente',
    'infra_energia_publica',
    'infra_energia_gerador_fossil',
    'infra_energia_renovavel',
    'infra_energia_inexistente',
    'infra_esgoto_publico',
    'infra_esgoto_fossa_septica',
    'infra_esgoto_fossa_comum',
    'infra_esgoto_fossa',
    'infra_esgoto_inexistente',
    'infra_lixo_servico_coleta',
    'infra_lixo_queima',
    'infra_lixo_enterra',
    'infra_lixo_destino_final_publico',
    'infra_lixo_descarta_outra_area',
    'infra_banheiro',
    'infra_banheiro_pne',
    'infra_quadra_esportes',
    'infra_internet',
    'infra_computador',
    'infra_acessibilidade_inexistente'
]

def select_and_rename_columns(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Recebe o df_raw e seleciona as colunas definidas em: "COLUNAS_ESPERADAS_NO_RAW_DF" e as renomeia utilizando o dicionário: "COLUMNS_MAP_COMPLETO"
    '''
    logging.info("Selecionando e renomeando colunas...")
    
    cols_to_rename = {old_name: new_name for old_name, new_name in COLUMNS_MAP_COMPLETO.items() if old_name in df.columns}
    columns_to_select_original_names = list(cols_to_rename.keys()) 

    for col in COLUNAS_ESPERADAS_NO_RAW_DF:
        if col not in COLUMNS_MAP_COMPLETO.keys() and col in df.columns:
            if col not in columns_to_select_original_names:
                columns_to_select_original_names.append(col)

    existing_cols_to_select = [col for col in columns_to_select_original_names if col in df.columns]
    
    if not existing_cols_to_select:
        logging.warning("Nenhuma coluna relevante encontrada para seleção e renomeio. Retornando DataFrame vazio.")
        return pd.DataFrame()

    df_selected = df[existing_cols_to_select].copy()
    df_renamed = df_selected.rename(columns=cols_to_rename)
    
    logging.debug(f"Colunas após seleção e renomeio: {df_renamed.columns.tolist()}")
    return df_renamed

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Preenche o df com valores booleanos, evitando valores vazios.
    Mapeia as colunas de identidade e caso tenha valor ausente preenche com "Desconhecida"
    '''
    logging.info("Limpando e convertendo tipos de dados...")
    
    df_cleaned = df.copy()

    for col in COLUNAS_DE_INFRA_RENOMEADAS:
        if col in df_cleaned.columns:
            df_cleaned[col] = df_cleaned[col].fillna(0).astype(bool)
            logging.debug(f"Coluna '{col}' convertida para bool.")
        else:
            logging.warning(f"Coluna '{col}' não encontrada no DataFrame para conversão de tipo.")

    if 'dependencia_adm' in df_cleaned.columns:
        dep_map = {1: 'Federal', 2: 'Estadual', 3: 'Municipal', 4: 'Privada'}
        df_cleaned['dependencia_adm'] = df_cleaned['dependencia_adm'].map(dep_map).fillna('Desconhecida')
        logging.debug("Coluna 'dependencia_adm' mapeada.")

    if 'situacao_funcionamento' in df_cleaned.columns:
        situacao_map = {1: 'Em atividade', 2: 'Paralisada', 3: 'Extinta'}
        df_cleaned['situacao_funcionamento'] = df_cleaned['situacao_funcionamento'].map(situacao_map).fillna('Desconhecida')
        logging.debug("Coluna 'situacao_funcionamento' mapeada.")
    
    if 'tipo_localizacao' in df_cleaned.columns:
        localizacao_map = {1: 'Urbana', 2: 'Rural'}
        df_cleaned['tipo_localizacao'] = df_cleaned['tipo_localizacao'].map(localizacao_map).fillna('Desconhecida')
        logging.debug("Coluna 'tipo_localizacao' mapeada.")

    return df_cleaned

def structure_data_as_documents(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Cria uma cópia do df e estrutura as colunas de infraestrutura em um dicionário para a inserção no banco de dados
    '''
    logging.info("Estruturando dados de infraestrutura em formato de documento...")
    
    df_structured = df.copy()

    existing_infra_cols_for_doc = [col for col in COLUNAS_DE_INFRA_RENOMEADAS if col in df_structured.columns]
    
    if existing_infra_cols_for_doc:
        df_structured['infraestrutura'] = df_structured[existing_infra_cols_for_doc].to_dict(orient='records')
        df_structured = df_structured.drop(columns=existing_infra_cols_for_doc)
        logging.debug("Colunas de infraestrutura agrupadas em 'infraestrutura' e removidas do DF principal.")
    else:
        logging.warning("Nenhuma coluna de infraestrutura encontrada para estruturar em sub-documento.")
    
    return df_structured

def load_raw_data(file_path: Path) -> pd.DataFrame:
    '''
    Lê o arquivo .parquet e o retorna como df Pandas
    '''
    try:
        df_raw = pd.read_parquet(file_path)
        return df_raw
    except FileNotFoundError:
        logging.warning("O arquivo não foi encontrado, garanta que o arquivo '01_extract.py' foi executado anteriormente.")
        return pd.DataFrame()
    except Exception as e:
        logging.error(f"Erro ao carregar dados brutos de {file_path}: {e}", exc_info=True)
        return pd.DataFrame()
    
def save_transformed_data(df: pd.DataFrame, file_path: Path) -> None:
    if df.empty:
        logging.warning("DataFrame está vazio. Nenhum arquivo será salvo.")
        return

    logging.info(f"Salvando dados brutos em {file_path}...")
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_parquet(file_path, index=False)
        logging.info("Dados transformados salvos com sucesso.")
    except Exception as e:
        logging.error(f"Falha ao salvar o arquivo Parquet: {e}", exc_info=True)
    
def enrich_with_risk_score(df: pd.DataFrame) -> pd.DataFrame:
    logging.info("Enriquecendo dados com score de risco (placeholder)...")
    # In building process
    return df

def main():
    '''
    Função main básica, orquestra todas as funções em prol do funcionamento do script
    '''
    logging.info("--- INICIANDO SCRIPT DE TRANSFORMAÇÃO (02_transform.py) ---")

    input_path = Path("C:/Users/Gustavo/OneDrive/codigos VScode/alpargatas-insights/etl/data/raw/escolas_paraiba.parquet")
    
    output_path = (
        Path(__file__).resolve().parents[1] / "data/transformed/escolas_paraiba.parquet"
    )

    df_raw = load_raw_data(input_path)
    
    if not df_raw.empty:
        df_renamed = select_and_rename_columns(df_raw)
        df_cleaned = clean_data(df_renamed)
        df_structured = structure_data_as_documents(df_cleaned)
        df_transformed = save_transformed_data(df_structured, output_path)

        # Still building
        df_final = enrich_with_risk_score(df_structured)
        
        logging.info("\nDataFrame transformado final (primeiras 5 linhas):")
        logging.info(f"\n{df_final.head().to_string()}")
        logging.info(f"Colunas do DataFrame final: {df_final.columns.tolist()}")
    else:
        logging.error("Nenhum dado bruto para transformar. Encerrando o processo de transformação.")

    logging.info("--- SCRIPT DE TRANSFORMAÇÃO FINALIZADO ---")

if __name__ == "__main__":
    main()