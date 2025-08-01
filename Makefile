.PHONY: help build rebuild run run-d stop logs clean restart shell-api shell-etl etl-extract etl-transform etl-load

build: ## Build the Docker containers
	docker-compose build

run: ## Start the containers in foreground
	docker-compose up

stop: ## Stop and remove the containers
	docker-compose down

run-d: ## Start the containers in detached mode
	docker-compose up -d

rebuild: ## Rebuild the containers without using cache
	docker-compose build --no-cache

logs: ## Follow the logs from all containers
	docker-compose logs -f

clean: ## Remove containers, volumes, local images and orphans
	docker-compose down -v --rmi local --remove-orphans

restart: ## Restart all containers
	docker-compose down && docker-compose up -d

shell-api: ## Open a shell in the API container
	docker-compose exec api /bin/sh

shell-etl: ## Open a shell in the ETL container
	docker-compose exec etl /bin/sh

etl-extract: ## Run the extract step of the ETL process
	docker-compose run --rm etl python scripts/extract.py

etl-transform: ## Run the transform step of the ETL process
	docker-compose run --rm etl python scripts/transform.py

etl-data-inspector: ## Run the Data Inspector script of the ETL process data
	docker-compose run --rm etl python scripts/validate_processed_data.py

etl-load: ## Run the load step of the ETL process
	docker-compose run --rm etl python scripts/load.py

help: ## Show available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
