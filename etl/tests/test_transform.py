# etl/tests/test_escolas_pipeline.py


import pandas as pd
import pytest

from src.common.utils import load_config
from src.jobs.escolas_pipeline.transform import (
    _calculate_risk_score,
    _finalize_schema,
    _map_categorical_values,
)

CONFIG = load_config()


@pytest.fixture
def sample_raw_df() -> pd.DataFrame:
    """Fixture com dados que simulam a entrada da etapa de mapeamento categórico."""
    data = {
        "dependencia_adm": [1, 2, 3, 4, 5],  # 5 é um valor inválido
        "tipo_localizacao": [1, 2, 3, 1, 2],  # 3 é um valor inválido
    }
    return pd.DataFrame(data)


def test_map_categorical_values(sample_raw_df):
    """
    Testa a função de mapeamento de valores categóricos,
    incluindo o tratamento de valores desconhecidos.
    """
    categorical_maps = CONFIG["escolas_pipeline"]["transform"]["categorical_maps"]
    df_mapped = _map_categorical_values(sample_raw_df, categorical_maps)

    assert df_mapped.loc[0, "dependencia_adm"] == "Federal"
    assert df_mapped.loc[1, "dependencia_adm"] == "Estadual"
    assert df_mapped.loc[2, "dependencia_adm"] == "Municipal"
    assert df_mapped.loc[3, "dependencia_adm"] == "Privada"
    assert df_mapped.loc[4, "dependencia_adm"] == "Desconhecida"  # Testa o fallback

    assert df_mapped.loc[0, "tipo_localizacao"] == "Urbana"
    assert df_mapped.loc[1, "tipo_localizacao"] == "Rural"
    assert df_mapped.loc[2, "tipo_localizacao"] == "Desconhecida"  # Testa o fallback


@pytest.mark.parametrize(
    "infra_data, expected_score",
    [
        # Cenário 1: Escola perfeita, score 0.0
        (
            {
                "possui_saneamento_basico": True,
                "possui_agua_potavel": True,
                "possui_biblioteca": True,
                "possui_internet": True,
                "possui_quadra_esportes": True,
                "possui_acessibilidade_pcd": True,
            },
            0.0,
        ),
        # Cenário 2: Sem biblioteca e sem quadra, score 0.30 (20 + 10)
        (
            {
                "possui_saneamento_basico": True,
                "possui_agua_potavel": True,
                "possui_biblioteca": False,
                "possui_internet": True,
                "possui_quadra_esportes": False,
                "possui_acessibilidade_pcd": True,
            },
            0.30,
        ),
        # Cenário 3: Sem saneamento e sem água, score 0.45 (25 + 20)
        (
            {
                "possui_saneamento_basico": False,
                "possui_agua_potavel": False,
                "possui_biblioteca": True,
                "possui_internet": True,
                "possui_quadra_esportes": True,
                "possui_acessibilidade_pcd": True,
            },
            0.45,
        ),
        # Cenário 4: Faltando tudo, score 1.0
        (
            {
                "possui_saneamento_basico": False,
                "possui_agua_potavel": False,
                "possui_biblioteca": False,
                "possui_internet": False,
                "possui_quadra_esportes": False,
                "possui_acessibilidade_pcd": False,
            },
            1.0,
        ),
        # Cenário 5: Faltando apenas acessibilidade, score 0.10
        (
            {
                "possui_saneamento_basico": True,
                "possui_agua_potavel": True,
                "possui_biblioteca": True,
                "possui_internet": True,
                "possui_quadra_esportes": True,
                "possui_acessibilidade_pcd": False,
            },
            0.10,
        ),
    ],
)
def test_calculate_risk_score(infra_data, expected_score):
    """
    Testa a lógica de cálculo do score de risco com múltiplos cenários.
    """
    row = pd.Series({"infraestrutura": infra_data})
    risk_weights = CONFIG["escolas_pipeline"]["transform"]["risk_score_weights"]

    score = _calculate_risk_score(row, risk_weights)

    assert score == pytest.approx(expected_score)


def test_finalize_schema():
    """Testa se a função final de schema seleciona e renomeia as colunas corretamente."""
    data = {
        "escola_id_inep": [1],
        "escola_nome": ["Escola A"],
        "municipio_id_ibge": [123],
        "municipio_nome": ["Cidade A"],
        "estado_sigla": ["PB"],
        "dependencia_adm": ["Municipal"],
        "tipo_localizacao": ["Urbana"],
        "infraestrutura": [{}],
        "indicadores": [{}],
        "localizacao": [{}],
        "score_de_risco": [0.5],
        "coluna_extra_1": ["lixo"],
        "latitude": [0.0],
    }
    df = pd.DataFrame(data)

    df_final = _finalize_schema(df)

    expected_columns = [
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
    ]

    assert list(df_final.columns) == expected_columns
    assert "scoreRisco" in df_final.columns
    assert "score_de_risco" not in df_final.columns
