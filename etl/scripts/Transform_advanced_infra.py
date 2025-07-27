
import pandas as pd 

def calculate_advanced_infra_percent(df_paraiba, infra_avancada):
    porcentagem_escolas_com_infra_avancada = []

    for codigo, nome in infra_avancada.items():
        total = len(df_paraiba)
        com_infra = len(df_paraiba[df_paraiba[codigo] == 1])
        percentual_com_infra = (com_infra/total) * 100
        porcentagem_escolas_com_infra_avancada.append({ 'Item': nome, 'Com (%)': percentual_com_infra, 'Total': total})

    
    df_resultado_porcentagem_escolas_com_infra_avancada = pd.DataFrame(porcentagem_escolas_com_infra_avancada).sort_values('Com (%)', ascending=False)

    
    return df_resultado_porcentagem_escolas_com_infra_avancada
