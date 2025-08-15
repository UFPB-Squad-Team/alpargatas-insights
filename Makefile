.PHONY: help build rebuild run run-d stop logs clean restart shell-etl \
        etl-run-escolas etl-run-professor \
        etl-extract etl-transform etl-validate etl-load

build: ## Builds Docker images for all services
	docker-compose build

run: ## Starts containers in the foreground (showing logs)
	docker-compose up

stop: ## Stops and removes containers
	docker-compose down

run-d: ## Starts containers in detached mode (in the background)
	docker-compose up -d

rebuild: ## Rebuilds images without using cache
	docker-compose build --no-cache

logs: ## Follows logs from all containers
	docker-compose logs -f

clean: ## Removes containers, volumes, and local images
	docker-compose down -v --rmi local --remove-orphans

restart: ## Restarts all containers
	docker-compose stop && docker-compose up -d

shell-etl: ## Opens an interactive terminal in the ETL container
	docker-compose exec etl /bin/sh

etl-run-escolas: ## Runs the main schools pipeline (Extract -> Transform -> Validate -> Load)
	docker-compose run --rm etl python -m src.jobs.escolas_pipeline.main

etl-run-enrich: ## Runs the enrichment pipeline (Professor)
	docker-compose run --rm etl python -m src.jobs.enriquecimento_pipeline.main

etl-extract: ## Runs ONLY the extraction stage of the schools pipeline
	docker-compose run --rm etl python -m src.jobs.escolas_pipeline.extract

etl-transform: ## Runs ONLY the transformation stage of the schools pipeline
	docker-compose run --rm etl python -m src.jobs.escolas_pipeline.transform

etl-validate: ## Runs ONLY the validation stage of the schools pipeline
	docker-compose run --rm etl python -m src.jobs.escolas_pipeline.validate

etl-load: ## Runs ONLY the loading stage of the schools pipeline
	docker-compose run --rm etl python -m src.jobs.escolas_pipeline.load


help: 
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'
