

# Validações da Entidade Municipio

## Código IBGE
- **Erro**: `IBGE_INVALID_LENGTH`
- **Regra**: Exatamente 8 números (`/^\d{7}$/`)
- **Mensagem**: 'The Inep code need be exactly 7 numbers'
- **Origem**: Censo Escolar INEP/ETL
- **Código relevante**: `MunicipalityValidator.ts`



## Nome
- **Erro**: `NAME_EMPTY`
- **Regra**: `name.trim().length > 0`
- **Mensagem**: 'Name need at least 1 caracter'
- **Origem**: Censo Escolar INEP/ETL
- **Código relevante**: `MunicipalityValidator.ts`



## Total Escolas:
- **Erro**: `TotalEscolas_NEGATIVE_NUMBER`
- **Regra**: `totalEscolas > 0`
- **Mensagem**: 'No can be a negative number' 
- **Código relevante**: `MunicipalityValidator.ts`