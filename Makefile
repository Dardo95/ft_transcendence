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

re: down
	@docker compose build --no-cache
	@$(MAKE) all

fclean: down
	@docker system prune -af
	@docker volume prune -f
	@rm -f certs/cert.pem certs/key.pem


migrate-dev:
	@docker exec -it transcendence_backend npx prisma migrate dev --schema=prisma/schema.prisma

migrate-name:
	@docker exec -it transcendence_backend npx prisma migrate dev --name $(name) --schema=prisma/schema.prisma

migrate-reset:
	@docker exec -it transcendence_backend npx prisma migrate reset

studio:
	@docker exec -it transcendence_backend npx prisma studio --port 5555 --browser none

help:
	@echo ""
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make                        - Detecta IP, genera certs y levanta todos los contenedores"
	@echo "  make down                   - Para y elimina todos los contenedores (datos conservados)"
	@echo "  make re                     - Baja, reconstruye desde cero y vuelve a levantar"
	@echo "  make fclean                 - Limpieza total: contenedores, imágenes, volúmenes y certs"
	@echo ""
	@echo "  make migrate-dev            - Crea una migración nueva interactiva (pide nombre)"
	@echo "  make migrate-name name=xxx  - Crea una migración con nombre específico"
	@echo "  make migrate-reset          - Reset completo de la BD (⚠️  borra todos los datos)"
	@echo "  make studio                 - Abre Prisma Studio en http://localhost:5555"
	@echo ""
	@echo "  make help                   - Muestra este mensaje"
	@echo ""

.PHONY: all down re fclean migrate-dev migrate-name migrate-reset studio help