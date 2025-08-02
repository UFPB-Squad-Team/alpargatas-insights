import pandas as pd
import pytest
import sys

from pathlib import Path
from scripts.transform import transform_data

project_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project_root))

@pytest.fixture
def sample_df_for_transformation() -> pd.DataFrame:
    """
    Cria um DataFrame de exemplo (um "mock") que simula os dados
    APÓS a etapa de renomeação e enriquecimento com coordenadas.
    Esta é a entrada exata que a função 'transform_data' espera.
    """
    data = {
        'escola_id_inep': [1, 2, 3],
        'escola_nome': ['Escola A', 'Escola B', 'Escola C'],
        'municipio_id_ibge': [250010, 250020, 250030],
        'municipio_nome': ['Cidade A', 'Cidade B', 'Cidade C'],
        'estado_sigla': ['PB', 'PB', 'PB'],
        'dependencia_adm': [2, 3, 2], # 2: Estadual, 3: Municipal
        'tipo_localizacao': [1, 2, 1], # 1: Urbana, 2: Rural
        'total_alunos': [100.0, 200.0, 300.0],
        'latitude': [-7.11, -7.12, -7.13],
        'longitude': [-34.80, -34.81, -34.82],
        
        # Cenários de Infraestrutura para testar o score
        # Escola 1: Perfeita (Score esperado = 0.0)
        'possui_agua_potavel': [True, True, False],
        'possui_energia_publica': [True, True, True],
        'possui_saneamento_basico': [True, True, False],
        'possui_biblioteca': [True, False, True],
        'possui_quadra_esportes': [True, False, True],
        'possui_internet': [True, True, True],
        # Escola 2: Sem biblioteca e sem quadra (Score = 0.3)
        # Escola 3: Sem saneamento e sem água (Score = 0.45)
        'acessibilidade_inexistente': [False, False, False] # Todas possuem acessibilidade
    }
    return pd.DataFrame(data)

def test_transform_data_integration(sample_df_for_transformation):
    """
    Testa a função 'transform_data' de forma integrada, verificando limpeza,
    estruturação de sub-documentos e o cálculo do score de risco.
    """
    df_final = transform_data(sample_df_for_transformation)
    
    # a) verifica se a estrutura final das colunas está correta
    expected_columns = [
        'escola_id_inep', 'escola_nome', 'municipio_id_ibge', 'municipio_nome',
        'estado_sigla', 'dependencia_adm', 'tipo_localizacao',
        'infraestrutura', 'indicadores', 'localizacao', 'score_de_risco'
    ]
    
    assert list(df_final.columns) == expected_columns
    
    # b) verifica se os dados foram limpos e traduzidos corretamente
    
    assert df_final.loc[0, 'dependencia_adm'] == 'Estadual'
    assert df_final.loc[1, 'dependencia_adm'] == 'Municipal'
    assert df_final.loc[1, 'tipo_localizacao'] == 'Rural'
    
    assert isinstance(df_final.loc[0, 'infraestrutura'], dict)
    assert isinstance(df_final.loc[0, 'localizacao'], dict)
    
    # c) Verifica se as coordenadas foram criadas corretamente (tipo e valor)
    assert isinstance(df_final.loc[0, 'localizacao']['coordinates'], list)
    assert df_final.loc[0, 'localizacao']['coordinates'] == [-34.80, -7.11]
    
    # d) verifica se a lógica de acessibilidade foi invertida e inclída
    assert df_final.loc[0, "infraestrutura"]["possui_acessibilidade_pcd"]   
     
    # e) verifica se o score de risco foi calculado corretamente para cada cenário
    assert df_final.loc[0, 'score_de_risco'] == 0.0
    assert df_final.loc[1, 'score_de_risco'] == 0.3  # (20 biblioteca + 10 quadra) / 100
    assert df_final.loc[2, 'score_de_risco'] == 0.45 # (25 saneamento + 20 agua) / 100
    