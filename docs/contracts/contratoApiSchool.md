# **Documentação de Contrato da API – Schools Alpargatas Insight**

Versão: 1.1  
Data: 12 de agosto de 2025  
Status: Aprovado

## **1\. Introdução**

Este documento detalha a especificação dos endpoints da API RESTful necessários para distribuir detalhes sobre as escolas, para o  "Alpargatas Insight". O objetivo é estabelecer um contrato claro entre os serviços de Backend e a aplicação Frontend, garantindo um alinhamento técnico e agilizando o desenvolvimento paralelo.

Todos os endpoints seguem o prefixo base: /api/v1/schools

## **2\. Endpoints da API**

### **2.1. Listar Escolas (All)**

* **Endpoint:** GET /all  
* **Descrição:** Retorna uma lista contendo cada escola no banco de dados da aplicação com todos os seus atributos.  
* **Componente Frontend Associado:** Adicionar
* **Corpo da Resposta (200 OK):**  
\[
    {
      "id": "68991ac53a36eea80ae380fe",  
      "inep": 25000050,  
      "nome": "ESCOLA ISOLADA ALTO SERTÃO",  
      "municipio": "Cabaceiras",  
      "scoreDeRisco": 0.98  
    },
    ...{ Mais escolas }
\]

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.2. Identificar uma escola especifica e seus atributos**

* **Endpoint:** GET /:id
* **Descrição:** Identifica uma escola em especifico e a retorna, com todos os detalhes sobre ela.  
* **Parâmetros:**  
  * id (obrigatório, string): Define a escola listada.  
* **Componente Frontend Associado:** Adicionar 
* **Corpo da Resposta (200 OK):**  
{
    {
      "id": "68991ac53a36eea80ae380fe",  
      "inep": 25000050,  
      "nome": "ESCOLA ISOLADA ALTO SERTÃO",  
      "municipio": "Cabaceiras",  
      "scoreDeRisco": 0.98  
    }
}

* **Respostas de Erro:**  
  * 400 Bad Request: Ocorre se o parâmetro id não for uma string válida.
  * 404 Not Found: Ocorre caso não se ache uma escola com esse id.  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.3. Listar escolas por sua dependencia administrativa**

* **Endpoint:** GET /details/:dependenciaAdm
* **Descrição:** Lista todas as escolas de determinada dependecia administrativa.  
* **Parâmetros:**  
* dependenciaAdm (obrigatório, enum): Define a dependencia administrativa a ser listada.  
* **Componente Frontend Associado:** Adicionar
* **Corpo da Resposta (200 OK):**  
  \[  
    {
      "id": "68991ac53a36eea80ae380fe",  
      "inep": 25000050,  
      "nome": "ESCOLA ISOLADA ALTO SERTÃO",  
      "municipio": "Cabaceiras",  
      "dependenciaAdm": "Estadual",
      "scoreDeRisco": 0.98  
    },
  \]

* **Respostas de Erro:**  
  * 500 Internal Server Error: Veja a seção 3 para o formato da resposta.

### **2.4. Listar escolas por termo, com paginação**

* **Endpoint:** GET /schools?term=Araruna&page=1&limit=10  
* **Descrição:** Identifica todas as escolas que detem o termo passado como parametro, e as listas, utilizando paginação, de acordo com a page e limit passados.  
* **Parâmetros:**  
* term (obrigatório, string): Define o termo a ser buscado.
* page (obrigatório, number): Define a página atual.
* limit (obrigatório, number): Define quantidade de itens por página.  
* **Componente Frontend Associado:** Adicionar 
* **Corpo da Resposta (200 OK):**  
  \[  
    {
      "id": "68991ac53a36eea80ae380fe",  
      "inep": 25000050,  
      "nome": "ESCOLA ISOLADA ALTO SERTÃO",  
      "municipio": "Araruna",  
      "dependenciaAdm": "Estadual",
      "scoreDeRisco": 0.98  
    },
    ...{  }
    total: 26,
    page: 3,
    currentPage: 1
  \]

* **Respostas de Erro:**  
  * 400 Bad Request: Caso o term não seja string.
  * 400 Bad Request: Caso page ou limit sejam negativas ou números invalidos.   
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
