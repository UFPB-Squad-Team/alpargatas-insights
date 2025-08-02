FROM python:3.12-slim as builder
WORKDIR /app
RUN pip install poetry==1.8.2
COPY poetry.lock pyproject.toml ./
RUN poetry export --with dev --format requirements.txt --output requirements.txt --without-hashes
RUN cat requirements.txt


FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./scripts ./scripts
