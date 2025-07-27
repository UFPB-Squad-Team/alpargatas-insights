FROM python:3.12-slim
RUN pip install poetry
WORKDIR /app
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false && poetry install --without dev --no-interaction --no-ansi
COPY . .