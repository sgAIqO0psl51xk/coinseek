sync:  
	uv sync  

format: sync  
	uv run black --config ./pyproject.toml . 

format_check: sync
	uv run black --config ./pyproject.toml --check .

mypy: sync
	uv run mypy --config ./pyproject.toml .

flake8: sync
	uv run flake8 --toml-config ./pyproject.toml .

check: sync format_check mypy flake8

clean:  
	rm -rf .venv  

.PHONY: sync format check clean  

.DEFAULT_GOAL := sync  