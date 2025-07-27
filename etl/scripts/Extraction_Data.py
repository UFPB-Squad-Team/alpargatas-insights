import pandas as pd
import requests
import io
import zipfile

def extract_data(filepath):
    df_paraiba = pd.DataFrame()

    try:
        response = requests.get(filepath)
        response.raise_for_status()

        zip_file_in_memory = io.BytesIO(response.content)

        with zipfile.ZipFile(zip_file_in_memory, 'r') as zf:
            
            csv_file_name = None
            for name in zf.namelist():
                if name.lower().endswith('.csv'):
                    csv_file_name = name
                    print(f"Arquivo CSV encontrado no ZIP: {csv_file_name}")
                    break
            
            if csv_file_name is None:
                print("Nenhum arquivo CSV encontrado no ZIP.")
                return pd.DataFrame()

            conteudo_csv_bytes = zf.read(csv_file_name)
            
            conteudo_csv_str = conteudo_csv_bytes.decode('latin-1') 

            df = pd.read_csv(io.StringIO(conteudo_csv_str),
                             delimiter=";",
                             encoding="latin-1", 
                             on_bad_lines="skip")

            df_paraiba = df[(df['SG_UF'] == "PB") & 
                            (df['TP_DEPENDENCIA'].isin([1,2,3])) & 
                            (df['TP_SITUACAO_FUNCIONAMENTO'] == 1)]

    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar ou acessar o arquivo: {e}")
    except zipfile.BadZipFile:
        print("Erro: O arquivo baixado não é um ZIP válido.")
    except KeyError:
        print(f"Erro: O arquivo CSV esperado '{csv_file_name}' não foi encontrado no ZIP.")
    except Exception as e:
        print(f"Erro inesperado ao processar o arquivo: {e}")

    return df_paraiba