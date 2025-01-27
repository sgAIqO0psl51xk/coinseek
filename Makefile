sync:  
	uv sync  

format: sync  
	uv run black --config ./pyproject.toml . 

check: sync  
	uv run black --config ./pyproject.toml --check . 
	uv run mypy --config ./pyproject.toml . 
	uv run flake8 --toml-config ./pyproject.toml .

clean:  
	rm -rf .venv  

.PHONY: sync format check clean  

.DEFAULT_GOAL := sync  