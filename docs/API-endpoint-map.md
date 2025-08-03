### **API Endpoint Map (Versão 2.0)**

Este documento detalha todos os endpoints da API, divididos pelo escopo do projeto.

### **Módulo 1: MVP Essencial**

Estes são os endpoints necessários para a entrega principal da disciplina.

| Method | Endpoint                                    | Use Case                         | Description                                                                                                                               |
| :----- | :------------------------------------------ | :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/v1/dashboard/kpis                      | GetDashboardKPIsUseCase          | Retorna os indicadores principais para os cards do topo do dashboard.                                                                     |
| GET    | /api/v1/dashboard/map-data                  | ListSchoolsForMapUseCase         | Retorna a lista **otimizada** de escolas (ID, nome, coords, risco) para o mapa.                                                           |
| GET    | /api/v1/schools                             | SearchSchoolsUseCase             | **(NOVO)** O endpoint principal para a **busca**. Aceita query params como ?search=... e \&page=... para filtrar e paginar os resultados. |
| GET    | /api/v1/schools/:id                         | GetSchoolDetailsUseCase          | Retorna os dados completos de uma **única** escola.                                                                                       |
| GET    | /api/v1/municipalities                      | ListMunicipalitiesUseCase        | Retorna a lista simples de todos os municípios (ID, nome) para preencher filtros.                                                         |
| GET    | /api/v1/municipalities/:ibgeCode/statistics | GetMunicipalityStatisticsUseCase | **(NOVO)** Retorna os dados **agregados** de um único município (risco médio, total de escolas, etc.), calculados em tempo real.          |
| GET    | /api/v1/health                              | (N/A)                            | Health check para monitoramento do container.                                                                                             |

### **Módulo 2: Simulador de Impacto (Visão de Futuro)**

Estes são os endpoints que precisaríamos construir para implementar o Módulo 2\.

| Method | Endpoint            | Use Case                   | Description                                                                                                                                                                                  |
| :----- | :------------------ | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/v1/simulations | RunImpactSimulationUseCase | **(NOVO)** Recebe o ID de uma escola e um conjunto de "intervenções" (ex: { "possui_biblioteca": true }). Usa o modelo de ML ou heurístico para recalcular e retornar o novo score de risco. |
