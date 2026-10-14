#!/usr/bin/env bash

# Salir inmediatamente si algún comando falla
set -e

# Comprobación de argumentos
if [ $# -lt 2 ]; then
  echo "Uso: $0 <ID_TAREA> <TITULO_DESCRIPTIVO>"
  echo "Ejemplo: $0 AUTH-B-03 \"Registrar ValidationPipe global\""
  exit 1
fi

TASK_ID="$1"
TITLE="$2"

# Validar que GitHub CLI esté autenticado
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ Error: GitHub CLI no está autenticado. Ejecuta 'gh auth login' primero."
  exit 1
fi

# 1. Normalizar el formato de la rama:
# Convierte el ID completo a minúsculas para un formato estándar limpio (ej: feat/shr-01 o feat/auth-b-03)
TASK_ID_LOWER=$(echo "$TASK_ID" | tr '[:upper:]' '[:lower:]')
BRANCH_NAME="feat/${TASK_ID_LOWER}"

echo "🔄 [1/3] Sincronizando rama main..."
git switch main
git pull origin main

echo "📝 [2/3] Comprobando o creando issue en GitHub para [$TASK_ID]..."

# Buscar si ya existe una issue con ese ID en el título
EXISTING_ISSUE=$(gh issue list --search "$TASK_ID in:title" --state all --json number --jq '.[0].number' 2>/dev/null || true)

if [ -n "$EXISTING_ISSUE" ]; then
  ISSUE_NUM="$EXISTING_ISSUE"
  echo "ℹ️ Ya existía la issue #$ISSUE_NUM para [$TASK_ID]."
else
  # Crear la issue nueva si no existe
  ISSUE_URL=$(gh issue create \
    --title "[$TASK_ID] $TITLE" \
    --assignee "@me" \
    --body "Implementación de la tarea **$TASK_ID**: $TITLE")
  
  ISSUE_NUM=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')
  echo "✅ Issue #$ISSUE_NUM creada con éxito: $ISSUE_URL"
fi

echo "🌿 [3/3] Creando rama '$BRANCH_NAME' y vinculándola a la issue #$ISSUE_NUM..."

# Verificar si la rama local o remota ya existe antes de ejecutar develop
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" || git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
  echo "⚠️ La rama '$BRANCH_NAME' ya existe. Haciendo checkout..."
  git switch "$BRANCH_NAME"
else
  gh issue develop "$ISSUE_NUM" --name "$BRANCH_NAME" --checkout
fi

echo ""
echo "🎉 ¡Listo! Estás en la rama '$BRANCH_NAME' asociada a la issue #$ISSUE_NUM."