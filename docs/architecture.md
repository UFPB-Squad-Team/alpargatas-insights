# System Architecture - Alpargatas Insight

This document describes the high-level architecture of the Alpargatas Insight platform.

## Flow Diagram

The diagram below illustrates the main system components and how they interact with each other.

```mermaid
graph TD
    subgraph "Local Environment (Docker Compose)"
        A[Frontend - React/Nginx <br> Port: 5173]
        B[Backend - Node.js/API <br> Port: 3000]
        C[ETL - Python/Poetry <br> (Executed on demand)]
    end

    subgraph "External Data Sources"
        D[Raw Data <br> (INEP Microdata)]
        E[Cloud Database <br> (MongoDB Atlas)]
    end

    A --"HTTP/API Requests"--> B
    B --"Read/Write"--> E
    C --"Loads processed data"--> E
    D --"Extracts data"--> C

    style A fill:#61DAFB,stroke:#000,stroke-width:2px
    style B fill:#8CC84B,stroke:#000,stroke-width:2px
    style C fill:#FFE057,stroke:#000,stroke-width:2px
    style E fill:#4DB33D,stroke:#000,stroke-width:2px


## Component Details

### 1. Frontend

- **Technology:** React (with Vite)
- **Container:** Nginx (lightweight web server for production)
- **Responsibility:**
  Presents the user interface, dashboards, and data visualizations.
  Consumes data exclusively through requests to our Backend API.

---

### 2. Backend (API)

- **Technology:** Node.js with TypeScript (using Express)
- **Responsibility:**
  Acts as the brain of the application. Exposes endpoints (`/schools`, `/municipalities`, etc.) consumed by the frontend.
  Contains the business logic and is the only service permitted to communicate directly with the database.

---

### 3. ETL Pipeline

- **Technology:** Python with Pandas and Poetry
- **Responsibility:**
  A service executed on-demand.
  Extracts raw data from external sources (such as CSV files from INEP), performs cleaning and transformations,
  and loads the processed results into the MongoDB Atlas database, preparing it for API consumption.

---

### 4. Database

- **Technology:** MongoDB Atlas (managed cloud service)
- **Responsibility:**
  Serves as our _"single source of truth."_
  Stores all data processed by the ETL pipeline.
  Using a cloud service ensures that the entire development team accesses the same database, simplifying local environments.

```

```