# **01PF-Projeto: Definição, Módulos, Arquitetura e Roadmap**

**Data**: 29 de Julho de 2025\.  
**Autores**: Brenno Henrique Alves da Silva Costa, Samuel Colaço Lira Carvalho, Gustavo Henrique Rocha Oliveira.  
**Status**: Documento de Escopo do Projeto.

### **1\. Definição do Problema**

O **Instituto Alpargatas**, em suas diversas frentes de atuação social, enfrenta o desafio contínuo de otimizar a alocação de seus recursos para maximizar o impacto positivo. Na área da educação, a tomada de decisão sobre quais escolas ou municípios apoiar carece de uma ferramenta centralizada que utilize dados públicos para identificar, de forma proativa e baseada em evidências, as localidades com maiores desafios e vulnerabilidades.

O problema central a ser investigado é: **Como transformar o vasto volume de dados educacionais públicos do Brasil em uma ferramenta de inteligência estratégica que permita ao Instituto Alpargatas identificar escolas em risco, entender suas carências e planejar intervenções de forma mais eficaz?**

### **2\. Módulos e Funcionalidades da Plataforma**

A plataforma "Alpargatas Insight" é composta por cinco módulos integrados que, juntos, oferecem uma visão 360° do cenário educacional.

* **Módulo 1: Diagnóstico e Análise de Risco:** O coração da plataforma, processando dados públicos para gerar um "score de risco" para cada escola, permitindo a identificação clara de áreas críticas.  
* **Módulo 2: Simulador de Impacto Prescritivo:** Uma ferramenta de análise "what-if" que permite aos gestores simular o efeito de investimentos (ex: "construir biblioteca") na redução do risco de uma escola antes de realizá-los.  
* **Módulo 3: Inteligência Dinâmica e Engajamento Comunitário:** Um módulo para capturar necessidades em tempo real diretamente da comunidade escolar, complementando os dados anuais do censo.  
* **Módulo 4: Geração de Narrativas e Relatórios (NLG):** Um motor de Geração de Linguagem Natural que traduz gráficos e números complexos em relatórios textuais claros e acionáveis.  
* **Módulo 5: Análise Ecossistêmica e Mapeamento de Ativos:** O módulo mais estratégico, que analisa a escola dentro de seu contexto socioeconômico, mapeando não apenas carências, mas também ativos locais (ONGs, empresas parceiras) para fomentar intervenções em rede.

**3\. Justificativa de Relevância**

#### **3.1. Relevância Prática (Para o Instituto Alpargatas)**

Uma plataforma de análise de dados oferece ao Instituto a capacidade de sair de um modelo de atuação reativo para um **modelo proativo e prescritivo**. Em vez de depender de demandas espontâneas, o Instituto poderá:

* **Identificar Focos de Atuação:** Visualizar em um mapa quais escolas e municípios apresentam os maiores indicadores de risco.  
* **Otimizar investimentos:** Direcionar recursos para as áreas onde o impacto potencial é maior.  
* **Basear Decisões em Evidências:** Justificar suas estratégias com dados concretos.

#### **3.2. Relevância Técnica**

O projeto aborda desafios técnicos de ponta a ponta no ciclo de vida de um produto de dados:

* **Engenharia de Dados:** lida com a ingestão, limpeza e transformação de grandes volumes de dados (ETL).  
* **Arquitetura de Software:** Exige a construção de uma aplicação robusta, com backend, frontend e banco de dados desacoplados.  
* **Ciência de Dados:** Aplica um modelo heurístico para criar um `score de risco.`  
* **DevOps/MLOps:** Implementa um ambiente de desenvolvimento reprodutível com Docker e CI/CD.

### **4\. Arquitetura e Solução Técnica Proposta**

A plataforma será construída sobre uma arquitetura de microsserviços poliglota, orquestrada via Docker.

* **Backend (API):** `Node.js + TypeScript` com Express.  
* **Frontend:** `React + Vite`, servido em produção por um container `Nginx`.  
* **Pipeline de ETL:** Scripts em `Python` com Pandas, gerenciados por `Poetry`.  
* **Banco de Dados:** `MongoDB Atlas` (cluster na nuvem).  
* **Infraestrutura:** Ambiente "containerizado" com `Docker` e gerenciado pelo `Docker Compose`.  
* **Automação (CI/CD):** Workflows de `GitHub Actions` para qualidade e comunicação.

### **5\. Fontes de Dados**

#### **5.1. Fonte Primária (MVP)**

* **Nome:** Microdados do Censo Escolar da Educação Básica de 2023 (INEP).  
* **Descrição:** Principal levantamento estatístico sobre a educação básica no Brasil.

#### **5.2. Fontes Secundárias (Visão de Futuro)**

* **Censo Demográfico (IBGE):** Para cruzar com indicadores socioeconômicos.  
* **Mapa das OSCs (IPEA):** Para identificar ONGs e parceiros em potencial.  
* **Dados de Emprego (CAGED/RAIS):** Para analisar a correlação entre evasão e mercado de trabalho.

### **6\. Plano de Desenvolvimento Fásico (Roadmap)**

A construção será dividida em fases para gerenciar o escopo.

#### **Fase 1: MVP Essencial (Escopo Principal da Disciplina)**

* **Objetivo:** Entregar um produto funcional ponta a ponta que implementa o **Módulo 1**.  
* **Entregáveis:** ETL completo, API funcional e Dashboard interativo consumindo dados reais.

#### **Fase 2: Expansão Estratégica (Stretch Goal)**

* **Objetivo:** Adicionar uma camada de análise prescritiva.  
* **Entregáveis:** Implementação do **Módulo 2 \- O Simulador de Impacto**.

#### **Fase 3: Visão de Futuro (Pós-Entrega)**

* **Objetivo:** Implementar a "Análise Ecossistêmica".  
* **Entregáveis (Conceituais):** Design da arquitetura para os **Módulos 3, 4 e 5**.

### **7\. Conclusão**

O projeto "Alpargatas Insight" foi concebido para ser mais do que uma ferramenta de visualização, é uma plataforma de inteligência estratégica. A arquitetura robusta e o plano fásico garantem a entrega de um MVP de alto impacto, estabelecendo uma fundação escalável para o futuro e promovendo um impacto social mais eficaz e baseado em evidências.