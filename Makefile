# Her Beautiful Universe - Makefile

.PHONY: help dev build up down logs clean setup test lint format

# Default target
help:
	@echo "🌌 Her Beautiful Universe - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make setup      - Set up the entire development environment"
	@echo "  make dev        - Start development environment"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Clean up Docker containers and volumes"
	@echo ""
	@echo "Django Backend:"
	@echo "  make migrate    - Run Django migrations"
	@echo "  make seed       - Load seed data"
	@echo "  make superuser  - Create Django superuser"
	@echo "  make shell      - Open Django shell"
	@echo ""
	@echo "Frontend:"
	@echo "  make install    - Install Node dependencies"
	@echo "  make test-fe    - Run frontend tests"
	@echo "  make lint-fe    - Run frontend linting"
	@echo ""
	@echo "Production:"
	@echo "  make prod-up    - Start production environment"
	@echo "  make prod-down  - Stop production environment"

# Development
setup:
	@echo "🚀 Setting up Her Beautiful Universe..."
	./scripts/setup.sh

dev:
	docker-compose -f docker-compose.dev.yml up --build

build:
	docker-compose -f docker-compose.dev.yml build

up:
	docker-compose -f docker-compose.dev.yml up -d

down:
	docker-compose -f docker-compose.dev.yml down

logs:
	docker-compose -f docker-compose.dev.yml logs -f

clean:
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

# Django Backend Commands
migrate:
	docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

seed:
	docker-compose -f docker-compose.dev.yml exec backend python manage.py load_seed_data

superuser:
	docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser

shell:
	docker-compose -f docker-compose.dev.yml exec backend python manage.py shell

collectstatic:
	docker-compose -f docker-compose.dev.yml exec backend python manage.py collectstatic --noinput

# Frontend Commands
install:
	npm install

test-fe:
	npm run test

lint-fe:
	npm run lint

format:
	npm run format

# Production
prod-up:
	docker-compose up --build -d

prod-down:
	docker-compose down

# Utilities
status:
	docker-compose -f docker-compose.dev.yml ps

health:
	@echo "🏥 Checking service health..."
	@curl -s http://localhost:8000/api/health/ > /dev/null && echo "✅ Backend API is healthy" || echo "❌ Backend API is down"
	@curl -s http://localhost:3000/ > /dev/null && echo "✅ Frontend is healthy" || echo "❌ Frontend is down"

# Database Management
db-backup:
	docker-compose -f docker-compose.dev.yml exec db pg_dump -U postgres her_beautiful_universe_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-reset:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.dev.yml up -d db
	sleep 5
	make migrate
	make seed

# Development Quick Start
quickstart: build up migrate seed
	@echo "🎉 Quick start complete! Visit http://localhost:3000"