
import pandas as pd

def extract_data(filepath):
    df = pd.read_csv(filepath, 
                    delimiter=";", 
                    encoding="latin-1", 
                    on_bad_lines="skip")

    df_paraiba = df[(df['SG_UF'] == "PB") & (df['TP_DEPENDENCIA'].isin([1,2,3])) & (df['TP_SITUACAO_FUNCIONAMENTO'] == 1)]

    return df_paraiba


