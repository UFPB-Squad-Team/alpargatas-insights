# **Documentação de Contrato da API – Dashboard Alpargatas Insight**

Versão: 1.1  
Data: 11 de agosto de 2025  
Status: Aprovado

## **1\. Introdução**

Este documento detalha a especificação dos endpoints da API RESTful necessários para alimentar os componentes visuais do Dashboard "Alpargatas Insight". O objetivo é estabelecer um contrato claro entre os serviços de Backend e a aplicação Frontend, garantindo um alinhamento técnico e agilizando o desenvolvimento paralelo.

Todos os endpoints seguem o prefixo base: /api/v1/dashboard

## **2\. Endpoints da API**

### **2.1. Indicadores Chave (KPIs)**

* **Endpoint:** GET /kpis  
* **Descrição:** Retorna um objeto único contendo os quatro principais indicadores de performance (KPIs) calculados para uma visão geral do sistema.  
* **Componente Frontend Associado:** KpiCard.tsx  
* **Corpo da Resposta (200 OK):**  
  {  
    "totalEscolas": 1250,  
    "escolasAltoRisco": 105,  
    "municipioMaiorRisco": "Cabaceiras",  
    "principalCarencia": "Falta de Biblioteca"  
  }

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.2. Lista de Escolas em Atenção Prioritária**

* **Endpoint:** GET /high-risk-schools  
* **Descrição:** Retorna uma lista das escolas com o maior scoreDeRisco, ordenadas de forma decrescente.  
* **Parâmetros de Query:**  
  * limit (opcional, number): Define o número máximo de escolas a serem retornadas. Padrão: 5\.  
* **Componente Frontend Associado:** HighRiskSchoolsList.tsx  
* **Corpo da Resposta (200 OK):**  
  \[  
    {  
      "id": "68991ac53a36eea80ae380fe",  
      "inep": 25000050,  
      "nome": "ESCOLA ISOLADA ALTO SERTÃO",  
      "municipio": "Cabaceiras",  
      "scoreDeRisco": 0.98  
    },  
    {  
      "id": "a45f1bc98a76eeb91bf291aa",  
      "inep": 25000051,  
      "nome": "EMEF PEDRA FURADA",  
      "municipio": "Sumé",  
      "scoreDeRisco": 0.92  
    }  
  \]

* **Respostas de Erro:**  
  * 400 Bad Request: Ocorre se o parâmetro limit não for um número inteiro válido.  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.3. Gráfico de Distribuição de Risco**

* **Endpoint:** GET /risk-distribution  
* **Descrição:** Agrega o total de escolas por faixas de risco pré-definidas (Crítico, Alto, Moderado, Baixo) para visualização em gráfico.  
* **Componente Frontend Associado:** RiskDistributionChart.tsx  
* **Corpo da Resposta (200 OK):**  
  \[  
    { "faixa": "Crítico", "quantidade": 25, "cor": "\#dc2626" },  
    { "faixa": "Alto Risco", "quantidade": 80, "cor": "\#f97316" },  
    { "faixa": "Risco Moderado", "quantidade": 350, "cor": "\#facc15" },  
    { "faixa": "Baixo Risco", "quantidade": 545, "cor": "\#9CA3AF" }  
  \]

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.4. Gráfico de Principais Carências**

* **Endpoint:** GET /top-deficiencies  
* **Descrição:** Identifica as carências de infraestrutura mais comuns entre as escolas consideradas de alto risco (scoreDeRisco \>= 0.75). O endpoint deve contar a ocorrência de cada flag false no objeto de infraestrutura para este subconjunto e retornar as mais frequentes.  
* **Componente Frontend Associado:** TopDeficienciesChart.tsx  
* **Corpo da Resposta (200 OK):**  
  \[  
    {  
      "carencia": "Falta de Biblioteca",  
      "escolas\_afetadas": 75  
    },  
    {  
      "carencia": "Falta de Acessibilidade",  
      "escolas\_afetadas": 68  
    },  
    {  
      "carencia": "Falta de Saneamento",  
      "escolas\_afetadas": 55  
    },  
    {  
      "carencia": "Falta de Internet",  
      "escolas\_afetadas": 49  
    },  
    {  
      "carencia": "Falta de Quadra",  
      "escolas\_afetadas": 42  
    }  
  \]

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.5. Lista de Municípios Prioritários**

* **Endpoint:** GET /top-municipalities-by-risk  
* **Descrição:** Agrupa as escolas por município, calcula a média do scoreDeRisco para cada um e retorna os 5 municípios com as maiores médias, indicando concentração de risco.  
* **Componente Frontend Associado:** TopMunicipalitiesChart.tsx  
* **Corpo da Resposta (200 OK):**  
  \[  
    {  
      "municipioNome": "Cabaceiras",  
      "riscoMedio": 0.88  
    },  
    {  
      "municipioNome": "Sumé",  
      "riscoMedio": 0.85  
    },  
    {  
      "municipioNome": "Alagoa Grande",  
      "riscoMedio": 0.79  
    },  
    {  
      "municipioNome": "Boqueirão",  
      "riscoMedio": 0.75  
    },  
    {  
      "municipioNome": "Pocinhos",  
      "riscoMedio": 0.72  
    }  
  \]

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

## **3\. Tratamento de Erros**

Todas as respostas de erro da API seguirão um formato padronizado para facilitar o tratamento pelo Frontend.

* **Estrutura da Resposta de Erro:**  
  {  
    "status": "error",  
    "message": "Uma descrição clara e concisa do erro que ocorreu."  
  }

* **Exemplo de Resposta (400 Bad Request):**  
  {  
    "status": "error",  
    "message": "O parâmetro 'limit' deve ser um número inteiro positivo."  
  }

* **Exemplo de Resposta (500 Internal Server Error):**  
  {  
    "status": "error",  
    "message": "Ocorreu um erro inesperado no servidor ao processar a solicitação."  
  }  
