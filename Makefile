.PHONY: help build rebuild run run-d stop logs shell-api shell-etl etl-extract etl-transform etl-load

build:
	docker-compose build

run:
	docker-compose up

stop:
	docker-compose down

run-d:
	docker-compose up -d

rebuild:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

shell-api:
	docker-compose exec api /bin/sh

shell-etl:
	docker-compose exec etl /bin/sh

etl-extract:
	docker-compose run --rm etl python scripts/01_extract.py

etl-transform:
	docker-compose run --rm etl python scripts/02_transform.py

etl-load:
	docker-compose run --rm etl python scripts/03_load.py

help:
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

