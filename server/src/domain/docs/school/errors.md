# Validações da Entidade Escola

## Código INEP

- **Erro**: `INEP_INVALID_LENGTH`
- **Regra**: Exatamente 8 números (`/^\d{8}$/`)
- **Mensagem**: 'The Inep code need be exactly 8 numbers'
- **Origem**: Censo Escolar INEP/ETL
- **Código relevante**: `SchoolValidator.ts`

## Score de Risco

- **Erro**: `SCORE_NEGATIVE`
- **Regra**: `scoreRisco >= 0`
- **Mensagem**: 'Score need be a positive number'
- **Origem**: ETL
- **Código relevante**: `SchoolValidator.ts`

## Nome

- **Erro**: `NAME_EMPTY`
- **Regra**: `name.trim().length > 0`
- **Mensagem**: 'Name need at least 1 caracter'
- **Origem**: Censo Escolar INEP/ETL
- **Código relevante**: `SchoolValidator.ts`

## Municipio Nome:

- **Erro**: `MunicipalityName_EMPTY`
- **Regra**: `municipioNome.trim().length > 0`
- **Mensagem**: 'Municipality name need at least 1 caracter'
- **Código relevante**: `SchoolValidator.ts`
