# **************************************************************************** #
# VARIABLES

NAME := ft_transcendence

IS_WSL := $(shell grep -qi microsoft /proc/version 2>/dev/null && echo "yes" || echo "no")

ifeq ($(IS_WSL),yes)
  HOST_IP     := 127.0.0.1
  CERT_IP     := 127.0.0.1
  ACCESS_HOST := localhost
else
  HOST_IP     := $(shell hostname -I 2>/dev/null | awk '{print $$1}')
  CERT_IP     := $(if $(HOST_IP),$(HOST_IP),127.0.0.1)
  ACCESS_HOST := $(if $(HOST_IP),$(HOST_IP),localhost)
endif

export HOST_IP
export ACCESS_HOST
export FRONTEND_URL ?= https://$(ACCESS_HOST):8443

# **************************************************************************** #
# COLORS AND ASCII ART

CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m
RESET  := \033[0m

define ASCII_ART

──────────────────────────────────────────────────────────────
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ░░░░░▀█▀░█▀█░█▀█░█▀▀░█▀▀░█▀▀░█▀█░█▀█░█▀▀░█▀█░█▀▀░█▀▀░░░░░░░░
 ░░░░░░█░░█▀▄░█▀█░▀▀█░█░░░█▀▀░█░█░█░█░█▀▀░█░█░█░░░█▀▀░░░░░░░░
 ░░░░░░▀░░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀░░▀▀▀░▀░▀░▀▀▀░▀▀▀░░░░░░░░
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                      
──────── by raperez-, ozamora-, brivera and enogueir ─────────

endef
export ASCII_ART

# **************************************************************************** #
# RULES

.DEFAULT_GOAL := all

all: prep build up

prep: prep-env prep-tls

prep-env:
	@cp -n .env.example .env 2>/dev/null || true
	@chmod 600 .env
	@echo "$(GREEN)Environment variables initialized.$(RESET)"
	@echo ""

prep-tls:
	@mkdir -p certs
	@if [ ! -f certs/cert.pem ] || [ ! -f certs/key.pem ] || \
		! openssl x509 -in certs/cert.pem -noout -text 2>/dev/null | grep -E "IP( Address)?:$(CERT_IP)" >/dev/null 2>&1 || \
		! openssl x509 -in certs/cert.pem -checkend 2592000 >/dev/null 2>&1; then \
		echo "$(YELLOW)Generating TLS certificates for $(ACCESS_HOST)...$(RESET)"; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout certs/key.pem -out certs/cert.pem \
			-subj "/C=ES/ST=Madrid/L=Madrid/O=42Madrid/CN=$(ACCESS_HOST)" \
			-addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:$(CERT_IP)" 2>/dev/null; \
		echo "$(GREEN)Certificates generated successfully.$(RESET)"; \
	else \
		echo "$(GREEN)Certificates are valid for $(ACCESS_HOST).$(RESET)"; \
	fi
	@echo "Detected IP: $(CYAN)$(ACCESS_HOST)$(RESET)"
	@echo ""

build: prep
	@echo "$(CYAN)Building Docker images...$(RESET)"
	docker compose build
	@echo ""

up: prep
	@echo "$(CYAN)Starting containers...$(RESET)"
	docker compose up -d
	@printf "$$ASCII_ART\n"
	@echo "$(GREEN)Infrastructure is up!$(RESET)"
	@echo "Access at: $(CYAN)https://$(ACCESS_HOST):8443$(RESET)"
	@echo ""

down:
	@echo "$(CYAN)Taking down containers...$(RESET)"
	docker compose down
	@echo ""

# **************************************************************************** #
# CLEAN AND REBUILD

clean:
	@echo "$(YELLOW)Cleaning containers and volumes...$(RESET)"
	docker compose down --volumes --remove-orphans
	@echo ""

fclean:
	@echo "$(YELLOW)Cleaning containers, images and volumes...$(RESET)"
	docker compose down --volumes --remove-orphans --rmi all 2>/dev/null || true
	@echo "$(YELLOW)Removing certs...$(RESET)"
	rm -f certs/cert.pem certs/key.pem
	@echo "$(YELLOW)Removing node_modules, dist and caches...$(RESET)"
	docker run --rm -v "$$(pwd):/app" -w /app alpine sh -c "\
			rm -rf node_modules backend/node_modules frontend/node_modules shared/node_modules \
				frontend/dist backend/dist \
				backend/main.js backend/main.d.ts backend/main.js.map .pnpm-store" 2>/dev/null || true
	@echo "$(GREEN)Project completely cleaned!$(RESET)"
	@echo ""
	@echo "$(YELLOW)[Warning]$(RESET) Local node_modules have been purged."
	@echo "If your editor shows type errors, run $(CYAN)pnpm install$(RESET) from $(CYAN)root directory$(RESET)."
	@echo ""

re: clean all

# **************************************************************************** #
# DEVELOPMENT MODE
# Hot reload, code mounted from the host, no nginx
# No certs, no HTTPS, no reverse proxy, no caching

dev: prep-env
	@echo "$(CYAN)Starting development mode...$(RESET)"
	@echo ""
	@echo "$(CYAN)Stopping NGINX container if running...$(RESET)"
	docker compose rm -sf nginx 2>/dev/null || true
	@echo ""
	@echo "$(CYAN)Building and starting development containers...$(RESET)"
	FRONTEND_URL=http://$(ACCESS_HOST):5173 \
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -V postgres backend frontend -d
	@printf "$$ASCII_ART\n"
	@echo "$(GREEN)Infrastructure in $(RESET)Development Mode$(GREEN) is up!$(RESET)"
	@echo "Access at: $(CYAN)http://$(ACCESS_HOST):5173$(RESET)"
	@echo ""

studio:
	@echo "$(CYAN)Opening Prisma Studio...$(RESET)"
	docker exec -it -w /app/backend ft_backend ./node_modules/.bin/prisma studio --port 5555 --browser none
	@echo ""

# **************************************************************************** #
# QA AND CODE QUALITY

typecheck:
	@echo "$(CYAN)Checking TypeScript types in Backend...$(RESET)"
	docker compose exec -T backend pnpm run typecheck
	@echo ""
	@echo "$(CYAN)Checking TypeScript types in Frontend...$(RESET)"
	docker compose exec -T frontend pnpm run typecheck
	@echo ""

lint:
	@echo "$(CYAN)Running linter in Backend...$(RESET)"
	docker compose exec -T backend pnpm run lint
	@echo ""
	@echo "$(CYAN)Running linter in Frontend...$(RESET)"
	docker compose exec -T frontend pnpm run lint
	@echo ""

buildcheck:
	@echo "$(CYAN)Running build check in Backend...$(RESET)"
	docker compose exec -T backend pnpm run build
	@echo ""
	@echo "$(CYAN)Running build check in Frontend...$(RESET)"
	docker compose exec -T frontend pnpm run build
	@echo ""

test:
	@echo "$(CYAN)Running backend tests...$(RESET)"
	docker compose exec -T backend pnpm run test:e2e
	@echo ""

allcheck: typecheck lint buildcheck test
	@echo "$(GREEN)All QA checks passed successfully.$(RESET)"
	@echo ""

envcheck:
	@echo "$(CYAN)Variables in the host environment$(RESET)"
	@echo "HOST_IP:      $(HOST_IP)"
	@echo "CERT_IP:      $(CERT_IP)"
	@echo "ACCESS_HOST:  $(ACCESS_HOST)"
	@echo "FRONTEND_URL: $(FRONTEND_URL)"
	@echo "(FRONTEND_URL is default, explicitly changed in dev mode)"
	@echo ""
	@echo "$(CYAN)Variables inside the backend container$(RESET)"
	@docker compose exec backend env | grep -E 'HOST_IP|FRONTEND_URL|NODE_ENV' || true
	@echo ""

# **************************************************************************** #
# INSPECTION

ps:
	@echo "$(CYAN)Status of all containers$(RESET)"
	docker compose ps -a
	@echo ""

images:
	@echo "$(CYAN)Status of all images$(RESET)"
	docker compose images
	@echo ""

status: images ps

stats:
	@echo "$(CYAN)Live resource usage of all containers$(RESET)"
	docker stats --all
	@echo ""

config:
	@echo "$(CYAN)Resolved docker compose configuration$(RESET)"
	docker compose config
	@echo ""

volumes:
	@echo "$(CYAN)Volumes in the system:$(RESET)"
	docker volume ls
	@echo ""
	@echo "$(CYAN)Volumes declared in docker-compose.yml:$(RESET)"
	docker compose config --volumes
	@echo ""

# **************************************************************************** #
# LOGS
# Usage Example:
#     make logs f        -> follow the output, live (docker compose logs -f)
#     make logs t=100    -> print only the last 100 lines
#     make logs f t=100  -> both at once

# Dummy target so 'make logs f' doesn't fail; 'f' is read by LOG_FLAGS.
f:
	@echo "tip: 'f' is a log flag. Example: make logs f"

LOG_FLAGS = $(strip $(if $(filter f,$(MAKECMDGOALS)),-f) $(if $(t),--tail=$(t)))

logs:
	@echo "$(CYAN)Logs of all containers$(RESET)"
	docker compose logs $(LOG_FLAGS)


# **************************************************************************** #
# PER SERVICE COMMANDS
# Usage Example: 
#     make <command>-<service>
#     make up-backend
#     make logs-frontend f t=100

# Forces pattern rules to run even if a file with the same name exists.
FORCE:

# Prevents make from auto-deleting intermediate prerequisites (check-%).
.SECONDARY:

SERVICES := postgres backend frontend nginx

check-%: FORCE
	@printf '%s\n' $(SERVICES) | grep -qx "$*" || { \
		echo "$(RED)Error: $(RESET)Unknown service: '$*'"; \
		echo "$(GREEN)Valid services: $(RESET)$(SERVICES)"; \
		echo ""; \
		exit 1; \
	}

up-%: check-% prep FORCE
	@echo "$(CYAN)Building and starting $* service...$(RESET)"
	docker compose up --build -d $*
	@echo ""

stop-%: check-% FORCE
	@echo "$(CYAN)Stopping $* service...$(RESET)"
	docker compose stop $*
	@echo ""

restart-%: check-% FORCE
	@echo "$(CYAN)Restarting $* service...$(RESET)"
	docker compose restart $*
	@echo ""

rm-%: check-% FORCE
	@echo "$(CYAN)Removing $* service...$(RESET)"
	docker compose rm -f $*
	@echo ""

build-%: check-% FORCE
	@echo "$(CYAN)Building $* service...$(RESET)"
	docker compose build $*
	@echo ""

logs-%: check-% FORCE
	@echo "$(CYAN)Logs of $* service$(RESET)"
	docker compose logs $(LOG_FLAGS)$*
	@echo ""

ps-%: check-% FORCE
	@echo "$(CYAN)Status of $* service$(RESET)"
	docker compose ps $*
	@echo ""

images-%: check-% FORCE
	@echo "$(CYAN)Images of $* service$(RESET)"
	docker compose images $*
	@echo ""

# Default container command used in exec
# Example usage: make exec-backend CMD="npx prisma version"
CMD ?= sh

exec-%: check-% FORCE
	@echo "$(CYAN)Executing command in $* container: $(CMD)$(RESET)"
	docker compose exec $* $(CMD)
	@echo ""

# **************************************************************************** #
# HELP

help:
	@echo ""
	@echo "$(CYAN)Available commands:$(RESET)"
	@echo ""
	@echo "  make / make all     - Detect IP, generate certs and start everything (--build)"
	@echo "  make prep           - Prepare the local environment only (.env and HTTPS certs)"
	@echo "  make prep-env       - Prepare the environment file (.env)"
	@echo "  make prep-tls       - Prepare the local TLS HTTPS certificate"
	@echo "  make build          - Build all images"
	@echo "  make up             - Start all containers in the background"
	@echo "  make down           - Stop all containers (database data is kept)"
	@echo ""
	@echo "  $(CYAN)Clean and Rebuild:$(RESET)"
	@echo "  make clean          - Remove containers and anonymous volumes"
	@echo "  make fclean         - Remove this project's containers, database volume and certs"
	@echo "  make re             - Start from scratch and rebuild the database"
	@echo ""
	@echo "  $(CYAN)Development:$(RESET)"
	@echo "  make dev            - Dev mode: hot reload at http://localhost:5173"
	@echo "  make studio         - Open Prisma Studio at http://localhost:5555"
	@echo ""
	@echo "  $(CYAN)QA & Testing:$(RESET)"
	@echo "  make typecheck      - Verify TypeScript types in backend and frontend"
	@echo "  make lint           - Run linters in backend and frontend"
	@echo "  make test           - Run backend E2E tests"
	@echo "  make buildcheck     - Run build check in backend and frontend"
	@echo "  make check          - Run full pipeline: typecheck, lint, and test"
	@echo "  make envcheck       - Check environment variables in host and backend container"
	@echo ""
	@echo "  $(CYAN)Inspection:$(RESET)"
	@echo "  make ps             - Status of every container"
	@echo "  make config         - Resolved docker compose configuration"
	@echo "  make volumes        - List of volumes"
	@echo "  make images         - Project images"
	@echo "  make stats          - Live resource usage (Ctrl+C to quit)"
	@echo "  make status         - Images and containers"
	@echo ""
	@echo "  $(CYAN)Logs (with optional flags, combine freely):$(RESET)"
	@echo "  make logs           - Logs of every service (prints and exits)"
	@echo "  make logs f         - Logs that follow the output (live)"
	@echo "  make logs t=5       - Logs with only the last 5 lines for each service"
	@echo "  make logs f t=100   - Logs with both flags combined"
	@echo ""
	@echo "  $(CYAN)Per service commands, services available: $(SERVICES)$(RESET)"
	@echo "  make up-<srvc>      - Build and start only that service"
	@echo "  make stop-<srvc>    - Stop that service"
	@echo "  make restart-<srvc> - Restart that service"
	@echo "  make rm-<srvc>      - Remove that service container"
	@echo "  make build-<srvc>   - Build only that service image"
	@echo "  make logs-<srvc>    - Logs of that service (flags: f, t=100)"
	@echo "  make ps-<srvc>      - Status of that service"
	@echo "  make images-<srvc>  - Images of that service"
	@echo "  make exec-<srvc>    - Shell inside that service, add CMD=\"...\" to run another command"
	@echo ""

.PHONY: all prep prep-env prep-tls build up down \
		re clean fclean \
		dev studio \
		typecheck lint buildcheck test allcheck envcheck \
		ps config volumes images stats logs f \
		help FORCE