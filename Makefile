HOST_IP := $(shell ip addr show | grep "inet " | grep -v "127.0.0.1" | grep -v "172\." | grep -v "192.168.122" | awk '{print $$2}' | cut -d'/' -f1 | head -1)

# Servicios definidos en docker-compose.yml (para validar make <cmd>-<servicio>)
SERVICES := postgres backend frontend nginx

# Ajustes de logs:
#   make logs TAIL=200      -> añade historial (--tail=200)
#   make logs FOLLOW=       -> no se queda pegado, imprime y sale
TAIL   ?=
FOLLOW ?= -f

# Flags resultantes para docker compose logs
LOG_FLAGS := $(strip $(FOLLOW) $(if $(TAIL),--tail=$(TAIL)))

# Comando a ejecutar dentro de un servicio: make exec-backend CMD="npx prisma studio"
CMD ?= sh

all: prep
	@docker compose up --build -d
	@echo ""
	@echo "✅ Proyecto levantado!"
	@echo "🌐 Abre el navegador en: https://$(HOST_IP):8443"
	@echo ""

# Prepara el entorno local: .env, IP en nginx y certificados HTTPS
prep:
	@echo "IP detectada: $(HOST_IP)"
	@cp -n .env.example .env 2>/dev/null || true
	@sed -i "s|server_name .*;|server_name localhost $(HOST_IP);|" nginx/nginx.conf
	@mkdir -p certs
	@if [ ! -f certs/cert.pem ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout certs/key.pem -out certs/cert.pem \
			-subj "/C=ES/ST=Madrid/L=Madrid/O=42Madrid/CN=$(HOST_IP)" 2>/dev/null; \
		echo "Certificados generados"; \
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

# ─── Inspección general ─────────────────────────────────────

ps:
	@docker compose ps -a

logs:
	@docker compose logs $(LOG_FLAGS)

config:
	@docker compose config

volumes:
	@docker volume ls
	@echo ""
	@echo "Volúmenes declarados en docker-compose.yml:"
	@docker compose config --volumes

images:
	@docker compose images

stats:
	@docker stats --all

# ─── Por servicio: make <comando>-<servicio> ────────────────
# Ejemplos: make up-backend · make logs-frontend · make exec-postgres

check-%:
	@printf '%s\n' $(SERVICES) | grep -qx "$*" || { \
		echo "❌ Servicio desconocido: '$*'"; \
		echo "   Servicios válidos: $(SERVICES)"; \
		exit 1; \
	}

up-%: check-% prep
	@docker compose up --build -d $*

stop-%: check-%
	@docker compose stop $*

restart-%: check-%
	@docker compose restart $*

rm-%: check-%
	@docker compose rm -f $*

build-%: check-%
	@docker compose build $*

logs-%: check-%
	@docker compose logs $(LOG_FLAGS) $*

ps-%: check-%
	@docker compose ps $*

images-%: check-%
	@docker compose images $*

exec-%: check-%
	@docker compose exec $* $(CMD)

# ─── Ayuda ──────────────────────────────────────────────────

help:
	@echo ""
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make / make all       - Detecta IP, genera certs y levanta todo (--build)"
	@echo "  make prep             - Solo prepara el entorno (.env, IP en nginx, certs)"
	@echo "  make down             - Para los contenedores (datos de BD conservados)"
	@echo "  make re               - Reinicia desde cero y reconstruye la BD"
	@echo "  make fclean           - Limpieza total: contenedores, imágenes, volúmenes y certs"
	@echo ""
	@echo "  make studio           - Abre Prisma Studio en http://localhost:5555"
	@echo ""
	@echo "  Inspección:"
	@echo "  make ps               - Estado de todos los contenedores"
	@echo "  make logs             - Logs de todos (vivo; TAIL=200 / FOLLOW=)"
	@echo "  make config           - Configuración resuelta de docker compose"
	@echo "  make volumes          - Lista de volúmenes"
	@echo "  make images           - Imágenes del proyecto"
	@echo "  make stats            - Consumo de recursos en vivo (Ctrl+C para salir)"
	@echo ""
	@echo "  Por servicio (<comando>-<servicio>), servicios: $(SERVICES)"
	@echo "  make up-<svc>         - Levanta y construye solo ese servicio"
	@echo "  make stop-<svc>       - Para ese servicio"
	@echo "  make restart-<svc>    - Reinicia ese servicio"
	@echo "  make rm-<svc>         - Elimina el contenedor de ese servicio"
	@echo "  make build-<svc>      - Construye solo la imagen de ese servicio"
	@echo "  make logs-<svc>       - Logs de ese servicio (TAIL=200 / FOLLOW=)"
	@echo "  make ps-<svc>         - Estado de ese servicio"
	@echo "  make images-<svc>     - Imágenes de ese servicio"
	@echo "  make exec-<svc>       - Shell dentro del servicio"
	@echo "                         (CMD=\"...\" para ejecutar otro comando)"
	@echo ""
	@echo "  make help             - Muestra este mensaje"
	@echo ""

.PHONY: all prep down re fclean studio help ps logs config volumes images stats
