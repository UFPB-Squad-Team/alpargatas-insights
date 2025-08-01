# Raw Data Setup Guide

## 1. Why does this file exist?

Our ETL pipeline depends on a raw data file from the School Census (`censo_2023.zip`). This file is too large to be versioned with Git, so it is **not** downloaded automatically when you clone the repository.

This guide explains how to obtain and correctly place this file so that `docker-compose build` works without errors. **This step is mandatory** and should be done only once when setting up the project.

## 2. Step-by-Step Instructions

### Step 2.1: Download the Data File

1. Click the link below to download the 2023 School Census microdata directly from the INEP website and the suplement data:

   - **Link:** [https://download.inep.gov.br/dados_abertos/microdados_censo_escolar_2023.zip](https://download.inep.gov.br/dados_abertos/microdados_censo_escolar_2023.zip)
   - **Link:** [https://github.com/kelvins/municipios-brasileiros/blob/main/csv/municipios.csv](https://github.com/kelvins/municipios-brasileiros/blob/main/csv/municipios.csv)

2. The downloaded file will be named `microdados_censo_escolar_2023.zip` and `municipios.csv`

### Step 2.2: Place and Rename the File

1. Navigate to the `etl/data/` folder within our project structure.
2. Move the file you just downloaded into this folder.
3. **Rename the file** to `censo_2023.zip` and `municipios_brasileiros.csv`.

In the end, your `etl/` folder structure should look like this:

```bash
etl/
├── data/
│   └── censo_2023.zip   <-- The file should be here with this name
│   └── municipios_brasileiros.csv   <-- The file should be here with this name
├── scripts/
├── .venv/
├── Dockerfile
└── pyproject.toml
```
