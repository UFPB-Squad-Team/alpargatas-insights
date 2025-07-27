
import pandas as pd

def calculate_basic_infra_percent(df_paraiba, infra_basicas):

    porcentagem_escolas_sem_infra_basica = []

    for codigo, nome in infra_basicas.items():
        total = len(df_paraiba)
        sem_infra = len(df_paraiba[df_paraiba[codigo] == 0 ])
        percentual_sem_infra = (sem_infra / total) * 100
        porcentagem_escolas_sem_infra_basica.append({ 'Item': nome, 'Faltam (%)': percentual_sem_infra, 'Total': total})
    
    df_resultado_porcentagem_escolas_sem_infra_basica = pd.DataFrame(porcentagem_escolas_sem_infra_basica).sort_values('Faltam (%)', ascending=False)

    return df_resultado_porcentagem_escolas_sem_infra_basica
