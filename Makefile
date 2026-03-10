.PHONY: dev build start lint install db-up db-down db-migrate db-seed db-studio db-reset clean

# Development
dev: ## Start dev server on port 4000
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

lint: ## Run linter
	npm run lint

install: ## Install dependencies
	npm install

# Database
db-up: ## Start PostgreSQL container
	docker-compose up -d postgres

db-down: ## Stop all containers
	docker-compose down

db-migrate: ## Run Prisma migrations
	DATABASE_URL="postgresql://luminaled:luminaled@localhost:5433/luminaled" npx prisma migrate dev

db-seed: ## Seed the database
	DATABASE_URL="postgresql://luminaled:luminaled@localhost:5433/luminaled" npx tsx prisma/seed.ts

db-studio: ## Open Prisma Studio
	DATABASE_URL="postgresql://luminaled:luminaled@localhost:5433/luminaled" npx prisma studio

db-reset: ## Reset database (drop + migrate + seed)
	DATABASE_URL="postgresql://luminaled:luminaled@localhost:5433/luminaled" npx prisma migrate reset --force

# Setup
setup: install db-up ## Full project setup
	@echo "Waiting for PostgreSQL to start..."
	@sleep 3
	$(MAKE) db-migrate
	$(MAKE) db-seed
	@echo "Setup complete! Run 'make dev' to start."

clean: ## Remove build artifacts
	rm -rf .next node_modules

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
