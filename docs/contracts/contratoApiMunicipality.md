# **Documentação de Contrato da API – Municipality Alpargatas Insight**

Versão: 1.1  
Data: 14 de agosto de 2025  
Status: Aprovado

## **1\. Introdução**

Este documento detalha a especificação dos endpoints da API RESTful necessários para distribuir detalhes sobre os municípios, para o  "Alpargatas Insight". O objetivo é estabelecer um contrato claro entre os serviços de Backend e a aplicação Frontend, garantindo um alinhamento técnico e agilizando o desenvolvimento paralelo.

Todos os endpoints seguem o prefixo base: /api/v1/municipalities

## **2\. Endpoints da API**

### **2.1. Detalhar Estatísticas dos municípios (KPI)**

* **Endpoint:** GET /:municipioIdIbge/statistics  
* **Descrição:** Retorna uma DTO contendo dados de um único município e suas estatísticas (scoreMédio, IdIbge, totalDeEscolas).  
* **Parâmetros:**  
  * municipioIdIbge (obrigatório, string): Define o município listado. 
* **Componente Frontend Associado:** Adicionar
* **Corpo da Resposta (200 OK):**  
    {
      "IbgeCode": "2516805",   
      "totalSchools": "14",  
      "averageRisk": 0.4
    },

* **Respostas de Erro:**  
  * 400 Bad Request: Ocorre se o parâmetro municipioIdIbge não for uma string válida.
  * 404 Not Found: Ocorre caso não se ache um município com esse municipioIdIbge.  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.2. Identificar um município especifico e seus atributos**

* **Endpoint:** GET /:codigoIbge
* **Descrição:** Identifica um município em especifico e retorna, com todos os detalhes sobre ele.  
* **Parâmetros:**  
  * codigoIbge (obrigatório, string): Define a escola listada.  
* **Componente Frontend Associado:** Adicionar 
* **Corpo da Resposta (200 OK):**  
{
    {
      "id": "68991ac53a36eea80ae380fe",  
      "codigoIbge": 25000050,  
      "nome": "Aguiar",  
      "scoreDeRisco":  0.5
    }
}

* **Respostas de Erro:**  
  * 400 Bad Request: Ocorre se o parâmetro id não for uma string válida.
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.3. Listar todos os municípios para o dropdown**

* **Endpoint:** GET /
* **Descrição:** Lista todos os municípios apenas com seus id e nome.  
* **Componente Frontend Associado:** Adicionar
* **Corpo da Resposta (200 OK):**  
  \[  
    {
      "id": "250010",  
      "nome": "Aguiar",  
    },
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
