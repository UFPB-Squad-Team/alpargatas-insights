# ALPARGATAS INSIGHTS

Plataforma de análise de dados criada no curso de Análise de Dados da UFPB em parceria com o Instituto Alpargatas. Transforma dados públicos em insights acionáveis para apoiar iniciativas de impacto social.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](#)
[![Status](https://img.shields.io/badge/Status-Academico-blue)](#)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Execução](#execução)
- [Comandos Úteis](#comandos-úteis)
- [Pipelines (ETL e Modelos)](#pipelines-etl-e-modelos)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)
- [Colaboradores](#colaboradores)
- [Licença](#licença)

---

## Visão Geral

ALPARGATAS INSIGHTS é um monorepo poliglota com microsserviços orquestrados por Docker. A plataforma coleta, processa e apresenta dados (ex.: Censo Escolar) em dashboards e APIs para diagnóstico e tomada de decisão.

Principais componentes:

- Backend (API): Node.js + TypeScript (Express) para servir dados e regras de negócio.
- Frontend: React + Vite com Nginx para dashboards interativos.
- ETL: Python (Poetry) para extração, transformação e carga de dados.
- Pipeline de Modelos: Treinamento e geração de indicadores.
- Banco de Dados: MongoDB Atlas como fonte única de verdade.

---

## Arquitetura

- Monorepo com serviços isolados (server, client, etl, model-training-pipeline).
- Comunicação via HTTP e MongoDB Atlas.
- Orquestração com Docker Compose.
- Nginx servindo o frontend em produção.

URLs (dev):

- Frontend: http://localhost:5173
- API: http://localhost:5000
- API Docs: http://localhost:5000/api/v1/docs

---

## Stack Tecnológica

| Categoria      | Ferramentas/Libs                               |
| -------------- | ---------------------------------------------- |
| Linguagens     | TypeScript, Python                             |
| Backend        | Node.js, Express, Mongoose, dotenv             |
| Frontend       | React, Vite, TypeScript, Nginx                 |
| ETL & ML       | Pandas, PyMongo, PyArrow, scikit-learn, MLflow |
| Banco de Dados | MongoDB Atlas (Cloud)                          |
| DevOps & Infra | Docker, Docker Compose, Make, AWS              |
| Pacotes        | npm (Node.js), Poetry (Python)                 |
| Qualidade      | ESLint, Prettier (TS), Ruff (Python)           |

---

## Pré-requisitos

- Docker Desktop 20.10+ (com Docker Compose)
- Git
- Make (opcional; Linux/macOS)
- Credenciais do MongoDB Atlas (fornecidas pela equipe)

---

## Configuração

1. Clonar o repositório

```bash
git clone git@github.com:UFPB-Squad-Team/alpargatas-insights.git
cd alpargatas-insights
```

2. Variáveis de ambiente
   Crie o arquivo .env em TODAS as camadas: raiz, server, client, etl, model-training-pipeline. Use o .env.example como base.

Raiz:

```bash
cp .env.example .env
```

Exemplo de conteúdo (ajuste os valores):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER_HOST>/<DB>?retryWrites=true&w=majority&appName=<APP_NAME>
FRONTEND_ORIGIN=http://localhost:5173

AWS_ACCESS_KEY_ID=<SUA_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<SUA_SECRET_KEY>
AWS_DEFAULT_REGION=us-east-2
```

Server:

```bash
cd server && cp .env.example .env && cd ..
```

Client (crie .env):

```env
VITE_USE_MOCKS=true
VITE_API_BASE_URL=http://localhost:5000
```

Atenção: .env está no .gitignore. Nunca faça commit de credenciais.

---

## Execução

Método recomendado: Docker Compose

Construir imagens:

```bash
docker-compose build
```

Subir tudo:

```bash
docker-compose up
```

Parar e remover:

```bash
docker-compose down
```

Método alternativo: Make (Linux/macOS)

```bash
make build   # construir
make run     # executar em foreground
make run-d   # executar em background
make stop    # parar
make logs    # logs
make clean   # remover tudo
```

---

## Comandos Úteis

Executar serviços isolados:

```bash
docker-compose up api
docker-compose up frontend
docker-compose up etl
```

Parar rapidamente (Ctrl+C) e limpar:

```bash
docker-compose down
```

Logs de um serviço:

```bash
docker-compose logs -f api
```

Shell no container ETL:

```bash
docker-compose exec etl /bin/sh
```

---

## Pipelines (ETL e Modelos)

ETL sob demanda:

```bash
# Pipeline completo (Escolas)
docker-compose run --rm etl python -m src.jobs.escolas_pipeline.main

# Enriquecimento (Professor)
docker-compose run --rm etl python -m src.jobs.enriquecimento_pipeline.main

# Etapas individuais
docker-compose run --rm etl python -m src.jobs.escolas_pipeline.extract
docker-compose run --rm etl python -m src.jobs.escolas_pipeline.transform
docker-compose run --rm etl python -m src.jobs.escolas_pipeline.validate
docker-compose run --rm etl python -m src.jobs.escolas_pipeline.load
```

Treinamento de modelos:

```bash
docker-compose run --rm etl python -m src.jobs.model_training.run
```

Obs.: Ajuste o módulo conforme a organização do diretório model-training-pipeline.

---

## Ambiente de Desenvolvimento

Backend (server):

```bash
cd server
npm install
npm run dev   # hot-reload
```

Frontend (client):

```bash
cd client
npm install
npm run dev   # hot-reload
```

ETL:

```bash
cd etl
poetry install
poetry run python -m src.jobs.escolas_pipeline.main
```

---

## Estrutura do Projeto

```bash
.
├── server/                  # API (Node.js/TypeScript)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── client/                  # Frontend (React/Vite)
│   ├── src/
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
├── etl/                     # Pipelines de dados (Python)
│   ├── src/
│   ├── config/
│   └── Dockerfile
├── model-training-pipeline/ # Treinamento de modelos
│   ├── src/
│   ├── config/
│   └── Dockerfile
├── docs/
├── .env                     # (local) variáveis de ambiente
├── .env.example
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Troubleshooting

- Portas em uso (5173/5000):
  - Pare processos conflitantes ou ajuste as portas no .env.
- Erros de conexão com MongoDB:
  - Verifique MONGO_URI, usuário/senha e whitelist do IP no Atlas.
- Container não inicia:
  ```bash
  docker-compose down
  docker-compose build --no-cache
  docker-compose up
  ```
- Permissões:
  - Windows: execute Docker Desktop como administrador.
  - Linux: adicione seu usuário ao grupo docker: sudo usermod -aG docker $USER

---

## Colaboradores

- Brenno Henrique Alves da Silva Costa — @brennohdev
- Samuel Colaço Lira Carvalho — @SamuelColaço
- Gustavo Henrique Rocha Oliveira — @Gustavo

---

## Licença

Projeto acadêmico. Todos os direitos reservados aos autores. Uso interno/educacional; consulte a equipe antes de redistribuir ou derivar.
