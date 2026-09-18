HOST_IP := $(shell ip addr show | grep "inet " | grep -v "127.0.0.1" | grep -v "172\." | grep -v "192.168.122" | awk '{print $$2}' | cut -d'/' -f1 | head -1)

all:
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
	@docker compose up --build -d
	@echo ""
	@echo "✅ Proyecto levantado!"
	@echo "🌐 Abre el navegador en: https://$(HOST_IP):8443"
	@echo ""

down:
	@docker compose down

re: down all

fclean: down
	@docker system prune -af
	@docker volume prune -f
	@rm -f certs/cert.pem certs/key.pem

migrate:
	@cd backend && npx prisma migrate deploy

migrate-dev:
	@docker exec -it transcendence_backend npx prisma migrate dev --schema=prisma/schema.prisma

help:
	@echo ""
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make              - Detecta IP, genera certs y levanta todos los contenedores"
	@echo "  make down         - Para y elimina todos los contenedores (datos conservados)"
	@echo "  make re           - Baja y vuelve a levantar todo (útil tras cambios de código)"
	@echo "  make migrate      - Aplica migraciones pendientes sin confirmación"
	@echo "  make migrate-dev  - Crea una migración nueva interactiva (pide nombre)"
	@echo "  make fclean       - Limpieza total: contenedores, imágenes, volúmenes y certs"
	@echo "  make help         - Muestra este mensaje"
	@echo ""

.PHONY: all down re fclean migrate migrate-dev help
