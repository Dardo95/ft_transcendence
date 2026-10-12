#!/usr/bin/env bash

# Salir inmediatamente si algún comando falla
set -e

# Comprobación de argumentos
if [ $# -lt 2 ]; then
  echo "Uso: $0 <ID_TAREA> <TITULO_DESCRIPTIVO>"
  echo "Ejemplo: $0 AUTH-B-03 \"Registrar ValidationPipe global\""
  echo "Ejemplo: ./start_task.sh FE-09 \"Sustituir starter de Vite por AppLayout\""
  exit 1
fi

TASK_ID="$1"
TITLE="$2"

# 1. Obtener el prefijo del módulo en minúsculas (ej: AUTH -> auth, FE -> fe)
MODULE=$(echo "$TASK_ID" | cut -d'-' -f1 | tr '[:upper:]' '[:lower:]')
BRANCH_NAME="feat/${MODULE}-${TASK_ID}"

echo "🔄 [1/3] Sincronizando rama main..."
git switch main
git pull origin main

echo "📝 [2/3] Creando issue en GitHub para [$TASK_ID]..."
# Crea la issue y captura la URL generada
ISSUE_URL=$(gh issue create \
  --title "[$TASK_ID] $TITLE" \
  --assignee "@me" \
  --body "Implementación de la tarea **$TASK_ID**: $TITLE")

# Extraer el número de la issue del final de la URL
ISSUE_NUM=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')

echo "✅ Issue #$ISSUE_NUM creada: $ISSUE_URL"

echo "🌿 [3/3] Creando rama $BRANCH_NAME y vinculándola a la issue #$ISSUE_NUM..."
gh issue develop "$ISSUE_NUM" --name "$BRANCH_NAME" --checkout

echo ""
echo "🎉 ¡Listo! Estás en la rama '$BRANCH_NAME' asociada a la issue #$ISSUE_NUM."