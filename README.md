# Alpargatas Insight Platform

## Project Overview

**Alpargatas Insight** is a data analysis platform developed as a project for the Data Analysis course at the Federal University of Paraíba (UFPB), in collaboration with the **Alpargatas Institute**. The goal is to create a strategic intelligence tool to support the Institute's social impact initiatives by transforming public data into actionable insights.

The initial focus is on **Education**, utilizing microdata from the School Census (INEP) to identify challenges, predict risks (such as school dropout rates), and simulate the impact of potential interventions.

## System Architecture

The project is built on a microservices architecture orchestrated with Docker, organized into a **polyglot monorepo**.

- **Backend (API):** A **Node.js + TypeScript** service (using Express) responsible for serving processed data, executing business logic, and connecting to the database.
- **Frontend:** A **React + Vite** application that consumes data from the API and presents it on interactive dashboards for the Institute's managers. It is served in production by an optimized **Nginx** container.
- **ETL Pipeline:** A set of **Python** scripts responsible for the Extraction, Transformation, and Loading of raw data from the School Census. It uses **Poetry** for dependency management and is executed on-demand.
- **Database:** A **MongoDB Atlas** cluster in the cloud, serving as the single source of truth for processed data and ensuring the entire development team shares the same state.

---

## Tech Stack

| Category               | Tools                                                      |
| ---------------------- | ---------------------------------------------------------- |
| **Languages**          | `TypeScript`, `Python`                                     |
| **Backend**            | `Node.js`, `Express`, `Mongoose`, `dotenv`                 |
| **Frontend**           | `React`, `Vite`                                            |
| **ETL & Data**         | `Pandas`, `PyMongo`, `PyArrow`                             |
| **Database**           | `MongoDB Atlas` (Cloud)                                    |
| **DevOps & Infra**     | `Docker`, `Docker Compose`, `Nginx`, `Makefile` (optional) |
| **Package Management** | `Poetry` (Python), `npm` (Node.js)                         |
| **Code Quality**       | `ESLint`, `Prettier` (TypeScript), `Ruff` (Python)         |

## Getting Started (Development Environment)

The only prerequisite to run this project is to have **Docker Desktop** installed. Everything else is managed by the containers.

### 1. Clone the Repository

```bash
git clone git@github.com:UFPB-Squad-Team/alpargatas-insights.git
cd alpargatas-insights
```

## 2. Configure Environment Variables

This project needs to connect to the cloud database.

- In the project root, find the `.env.example` file.
- Create a copy of this file and rename it to `.env`.
- Open the `.env` file and replace the `DATABASE_URL` placeholder with the actual connection string from MongoDB Atlas.

> **Important**: The `.env` file contains secrets and is already in the `.gitignore`. **DO NOT COMMIT** this file.

## 3. Build and Start the Containers

Use the `docker-compose` commands to orchestrate the application.

### Build the images (only the first time or after changing a Dockerfile):

```bash
docker-compose build
```

### Start the application (Frontend and Backend)

```bash
docker-compose up
```

After a few moments, the services will be available:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend (API)**: [http://localhost:3000](http://localhost:3000)

## Workflow & Useful Commands

### Stoping the Application

To stop all containers, press **Ctrl + C** in the terminal where **docker-compose up** is running, and then execute:

```bash
docker-compose down
```

### Running the ETL Pipeline

The ETL is executed on-demand. To run a specific script (e.g., 01_extract.py), open a new terminal and use the docker-compose run command:

```bash
docker-compose run --rm etl poetry run python scripts/01_extract.py
```

### Working on a Single Service

If you want to focus on just one service, you can start it individually.

- **Backend only**:

```bash
docker-compose up api
```

- **Frontend only**:

```bash
docker-compose up frontend
```

## Makefile Shortcuts (Optional)

If you have `make` installed on your system (common on Linux/macOS), you can use the shortcuts defined in the `Makefile`:

- `make build`: Builds the images.
- `make run`: Starts the application.
- `make stop`: Stops the application.
- `make etl`: An example of how to run an ETL script.

## Project Structure

```bash
.
├── backend/             # API service in Node.js/TypeScript
├── etl/                 # Data pipeline in Python
├── frontend/            # Application in React
├── docs/                # Project documentation
├── .env                 # (Local, unversioned) Application secrets
├── .env.example         # Example environment variables
├── .gitignore           # Files ignored by Git
├── docker-compose.yml   # Docker services orchestrator
├── Makefile             # (Optional) Shortcuts for common commands
└── README.md            # This file
```

## Collaborators

This project was developed collaboratively by:

- **Brenno Henrique Alves da Silva Costa**  
  [brennohdev](https://github.com/brennohdev)

- **Samuel Colaço Lira Carvalho**  
  [SamuelColaço](https://github.com/SamuelColaco)

- **Gustavo Henrique Rocha Oliveira**  
  [Gustavo](https://github.com/yScroww)

## License

This is an academic project. All rights reserved to the authors.
