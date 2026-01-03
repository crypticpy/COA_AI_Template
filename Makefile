# =============================================================================
# COA AI Template - Makefile
# =============================================================================

.PHONY: help install dev build test lint clean docker-build docker-run deploy

# Default target
help:
	@echo "COA AI Template - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install     - Install all dependencies"
	@echo "  make dev         - Start development servers"
	@echo "  make test        - Run all tests"
	@echo "  make lint        - Run linters"
	@echo ""
	@echo "Build:"
	@echo "  make build       - Build for production"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run  - Run with Docker Compose"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-dev  - Deploy to dev environment"
	@echo "  make deploy-prod - Deploy to production"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean       - Remove build artifacts"

# =============================================================================
# Development
# =============================================================================

install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Done!"

dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:8000"
	@(cd frontend && npm run dev) & \
	(cd backend && uvicorn app.main:app --reload --port 8000)

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

# =============================================================================
# Testing
# =============================================================================

test:
	@echo "Running frontend tests..."
	cd frontend && npm run test:run
	@echo "Running backend tests..."
	cd backend && pytest

test-frontend:
	cd frontend && npm run test

test-backend:
	cd backend && pytest -v

# =============================================================================
# Linting
# =============================================================================

lint:
	@echo "Linting frontend..."
	cd frontend && npm run lint
	@echo "Linting backend..."
	cd backend && ruff check .

lint-fix:
	cd frontend && npm run lint -- --fix
	cd backend && ruff check . --fix

# =============================================================================
# Build
# =============================================================================

build:
	@echo "Building frontend..."
	cd frontend && npm run build
	@echo "Build complete!"

# =============================================================================
# Docker
# =============================================================================

docker-build:
	docker buildx build \
		--platform linux/amd64 \
		-t coa-ai-app:local \
		-f docker/Dockerfile \
		.

docker-run:
	docker-compose -f docker/docker-compose.yml up

docker-stop:
	docker-compose -f docker/docker-compose.yml down

# =============================================================================
# Deployment
# =============================================================================

deploy-dev:
	./scripts/deploy-azure.sh dev

deploy-staging:
	./scripts/deploy-azure.sh staging

deploy-prod:
	./scripts/deploy-azure.sh production

# =============================================================================
# Cleanup
# =============================================================================

clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.vite
	rm -rf backend/__pycache__
	rm -rf backend/.pytest_cache
	rm -rf coverage
	@echo "Done!"

clean-all: clean
	@echo "Removing all dependencies..."
	rm -rf frontend/node_modules
	rm -rf backend/venv
	@echo "Done!"
