# Solar Projects SPA - Docker Management
.PHONY: help build dev prod clean logs shell test

# Default target
help: ## Show this help message
	@echo "Solar Projects SPA - Docker Commands"
	@echo "====================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker compose --profile dev up --build -d
	@echo "✅ Development environment started!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 API Mock: http://localhost:5002"

dev-logs: ## Show development logs
	docker compose --profile dev logs -f

dev-stop: ## Stop development environment
	docker compose --profile dev down

dev-restart: ## Restart development environment
	docker compose --profile dev restart

# Production commands
prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	docker compose --profile prod --profile nginx up --build -d
	@echo "✅ Production environment started!"
	@echo "🌐 Frontend: http://localhost:8080"

prod-logs: ## Show production logs
	docker compose --profile prod --profile nginx logs -f

prod-stop: ## Stop production environment
	docker compose --profile prod --profile nginx down

# Build commands
build-dev: ## Build development image only
	docker compose build app-dev

build-prod: ## Build production image only
	docker compose build app-prod

build-all: ## Build all images
	docker compose build

# Utility commands
clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down --volumes --remove-orphans
	docker system prune -f
	docker volume prune -f
	@echo "✅ Cleanup completed!"

clean-all: ## Clean up everything including images
	@echo "🧹 Cleaning up all Docker resources..."
	docker compose down --volumes --remove-orphans --rmi all
	docker system prune -af
	docker volume prune -f
	@echo "✅ Complete cleanup finished!"

# Development utilities
shell: ## Access shell in development container
	docker compose exec app-dev sh

shell-prod: ## Access shell in production container
	docker compose exec app-prod sh

logs: ## Show all logs
	docker compose logs -f

# Testing
test: ## Run tests in development environment
	docker compose exec app-dev bun test

test-watch: ## Run tests in watch mode
	docker compose exec app-dev bun test:watch

# Health checks
health: ## Check health of all services
	@echo "🔍 Checking service health..."
	@docker compose ps
	@echo ""
	@echo "📊 Container status:"
	@docker compose exec app-dev curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Development app: healthy" || echo "❌ Development app: unhealthy"
	@curl -f http://localhost:5002/api/v1/health > /dev/null 2>&1 && echo "✅ Mock API: healthy" || echo "❌ Mock API: unhealthy"

# Database and cache (if using)
redis: ## Start Redis cache
	docker compose --profile cache up redis -d

redis-cli: ## Access Redis CLI
	docker compose exec redis redis-cli

# Environment management
env-dev: ## Show development environment variables
	docker compose --profile dev config

env-prod: ## Show production environment variables
	docker compose --profile prod config

# Bundle analysis
analyze: ## Analyze bundle size (run after build)
	@echo "📊 Analyzing bundle size..."
	docker compose exec app-dev bun run build -- --analyze
	@echo "Open dist/bundle-analysis.html to view results"

# Security scanning
security: ## Run security scan on images
	@echo "🔒 Running security scan..."
	docker scout quickview
	docker scout cves

# Backup and restore
backup: ## Backup volumes
	@echo "💾 Creating backup..."
	docker run --rm -v solar-spa_bun-cache:/data -v $(PWD)/backups:/backup alpine tar czf /backup/bun-cache-$(shell date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@echo "✅ Backup completed!"

# Update dependencies
update: ## Update dependencies in development container
	docker compose exec app-dev bun update

# Quick shortcuts
up: dev ## Alias for dev
down: dev-stop ## Alias for dev-stop
restart: dev-restart ## Alias for dev-restart
