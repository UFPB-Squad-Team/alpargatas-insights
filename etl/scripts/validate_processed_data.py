import logging
import pandas as pd
import pandera.pandas as pa

from pandera.errors import SchemaError
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)

def define_data_schema() -> pa.DataFrameSchema:
    """Define o contrato de qualidade dos nossos dados processados."""
    schema = pa.DataFrameSchema({
        "escola_id_inep": pa.Column(int, required=True),
        "escola_nome": pa.Column(str, required=True),
        "municipio_id_ibge": pa.Column(int, required=True),
        "municipio_nome": pa.Column(str, required=True),
        "estado_sigla": pa.Column(str, checks=pa.Check.str_length(min_value=2, max_value=2)),
        "dependencia_adm": pa.Column(str, checks=pa.Check.isin(["Federal", "Estadual", "Municipal"])),
        "tipo_localizacao": pa.Column(str, checks=pa.Check.isin(["Urbana", "Rural"])),
        "infraestrutura": pa.Column(object, required=True), 
        "indicadores": pa.Column(object, required=True),
        "localizacao": pa.Column(object, required=True),
        "score_de_risco": pa.Column(float, checks=pa.Check.in_range(min_value=0.0, max_value=1.0)),
    },
    strict=True,
    ordered=True
    )
    return schema
    
    
def main():
    logging.info("INICIANDO O SCRIPT DE VALIDAÇÃO DE DADOS (validate_processed_data.py)")
    
    base_path = Path(__file__).resolve().parents[1]
    processed_data_path = base_path / "data/processed/escolas_processado.parquet"
    
    try:
        logging.info(f"Carregando dados processados de {processed_data_path}...")
        df_processed = pd.read_parquet(processed_data_path)
        
        logging.info("Definindo o schema de validação dos dados...")
        schema  = define_data_schema()
        
        logging.info("Validando os dados contra o schema...")
        schema.validate(df_processed)
        
        logging.info("Boa! Deu tudo certo. Os dados processados sáo válidos e seguem o contrato de qualidade.")
    
    except FileNotFoundError:
        logging.error(f"ERRO: o arquivo de dados processados não foi encontrado. Execute o ETL primeiro.")
        exit(1)
    except SchemaError as err:
        logging.error("Falha na validação: Os dados não seguem o contrato de qualidade.")
        exit(1)
    except Exception as e:
        logging.error(f"Um erro inesperado ocorreu: {e}.")
        exit(1)
        
if __name__ == "__main__":
    main()