HOST_IP := $(shell ip addr show | grep "inet " | grep -v "127.0.0.1" | grep -v "172\." | grep -v "192.168.122" | awk '{print $$2}' | cut -d'/' -f1 | head -1)

# Services defined in docker-compose.yml, used to validate make <command>-<service>
SERVICES := postgres backend frontend nginx

# Optional log flags, nothing is applied by default:
#   make logs f        -> follow the output, live (docker compose logs -f)
#   make logs t=100    -> print only the last 100 lines
#   make logs f t=100  -> both at once
LOG_FLAGS = $(strip $(if $(filter f,$(MAKECMDGOALS)),-f) $(if $(t),--tail=$(t)))

# Command run by exec-<svc>: make exec-backend CMD="npx prisma version"
CMD ?= sh

# `make` with no arguments must always start the whole project, no matter
# which target ends up being the first one in this file
.DEFAULT_GOAL := all

all: prep
	@docker compose up --build -d
	@echo ""
	@echo "✅ Project is up!"
	@echo "🌐 Open your browser at: https://$(HOST_IP):8443"
	@echo ""

# Prepare the local environment: .env, nginx IP and HTTPS certificates
prep:
	@echo "Detected IP: $(HOST_IP)"
	@cp -n .env.example .env 2>/dev/null || true
	@sed -i "s|server_name .*;|server_name localhost $(HOST_IP);|" nginx/nginx.conf
	@mkdir -p certs
	@if [ ! -f certs/cert.pem ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout certs/key.pem -out certs/cert.pem \
			-subj "/C=ES/ST=Madrid/L=Madrid/O=42Madrid/CN=$(HOST_IP)" 2>/dev/null; \
		echo "Certificates generated"; \
	fi

down:
	@docker compose down

re:
	@docker compose down -v
	@docker compose build --no-cache
	@$(MAKE) all

fclean:
	@docker compose down -v
	@docker system prune -af
	@docker volume prune -f
	@rm -f certs/cert.pem certs/key.pem

studio:
	@docker exec -it transcendence_backend npx prisma studio --port 5555 --browser none

# ─── Inspection ─────────────────────────────────────────────

ps:
	@docker compose ps -a

logs:
	@docker compose logs $(LOG_FLAGS)

# `f` is parsed by make as a target, so it needs a rule of its own to be
# accepted. It does nothing but print a tip: LOG_FLAGS is what reads it.
f:
	@echo "tip: 'f' is a log flag. Example: make logs f"

config:
	@docker compose config

volumes:
	@docker volume ls
	@echo ""
	@echo "Volumes declared in docker-compose.yml:"
	@docker compose config --volumes

images:
	@docker compose images

stats:
	@docker stats --all

# ─── Per service: make <command>-<service> ──────────────────
# Examples: make up-backend · make logs-frontend f t=100

# Pattern targets are never files, so always run them even if a file with the
# same name exists in the repo (this used to break `make logs-backend`).
FORCE:

# do not let make delete the check-<service> prerequisites after running
.SECONDARY:

check-%: FORCE
	@printf '%s\n' $(SERVICES) | grep -qx "$*" || { \
		echo "❌ Unknown service: '$*'"; \
		echo "   Valid services: $(SERVICES)"; \
		exit 1; \
	}

up-%: check-% prep FORCE
	@docker compose up --build -d $*

stop-%: check-% FORCE
	@docker compose stop $*

restart-%: check-% FORCE
	@docker compose restart $*

rm-%: check-% FORCE
	@docker compose rm -f $*

build-%: check-% FORCE
	@docker compose build $*

logs-%: check-% FORCE
	@docker compose logs $(LOG_FLAGS) $*

ps-%: check-% FORCE
	@docker compose ps $*

images-%: check-% FORCE
	@docker compose images $*

exec-%: check-% FORCE
	@docker compose exec $* $(CMD)

# ─── Help ───────────────────────────────────────────────────

help:
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make / make all     - Detect IP, generate certs and start everything (--build)"
	@echo "  make prep           - Prepare the local environment only (.env, nginx IP, certs)"
	@echo "  make down           - Stop all containers (database data is kept)"
	@echo "  make re             - Start from scratch and rebuild the database"
	@echo "  make fclean         - Full cleanup: containers, images, volumes and certs"
	@echo ""
	@echo "  make studio         - Open Prisma Studio at http://localhost:5555"
	@echo ""
	@echo "  Inspection:"
	@echo "  make ps             - Status of every container"
	@echo "  make logs           - Logs of every service (prints and exits)"
	@echo "  make config         - Resolved docker compose configuration"
	@echo "  make volumes        - List of volumes"
	@echo "  make images         - Project images"
	@echo "  make stats          - Live resource usage (Ctrl+C to quit)"
	@echo ""
	@echo "  Log flags (optional, combine freely):"
	@echo "  make logs f         - follow the output (live)"
	@echo "  make logs t=100     - only the last 100 lines"
	@echo "  make logs f t=100   - both"
	@echo ""
	@echo "  Per service (<command>-<service>), services: $(SERVICES)"
	@echo "  make up-<svc>       - Build and start only that service"
	@echo "  make stop-<svc>     - Stop that service"
	@echo "  make restart-<svc>  - Restart that service"
	@echo "  make rm-<svc>       - Remove that service container"
	@echo "  make build-<svc>    - Build only that service image"
	@echo "  make logs-<svc>     - Logs of that service (flags: f, t=100)"
	@echo "  make ps-<svc>       - Status of that service"
	@echo "  make images-<svc>   - Images of that service"
	@echo "  make exec-<svc>     - Shell inside that service"
	@echo "                       (CMD=\"...\" to run another command)"
	@echo ""
	@echo "  make help           - Show this message"
	@echo ""

.PHONY: all prep down re fclean studio help ps logs config volumes images stats f FORCE
