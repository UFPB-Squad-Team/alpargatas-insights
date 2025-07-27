.PHONY: build run stop logs etl

build:
	docker-compose build

run:
	docker-compose up

stop:
	docker-compose down

logs:
	docker-compose logs -f

etl:
	docker-compose run --rm etl poetry run python scripts/01_extract.py