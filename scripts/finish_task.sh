#!/usr/bin/env bash

# Salir inmediatamente si algún comando falla
set -e

# 0. Comprobar argumentos
if [ $# -lt 1 ]; then
  echo "Uso: $0 \"<MENSAJE_DE_COMMIT>\" [NUMERO_ISSUE_OPCIONAL]"
  echo "Ejemplo: $0 \"fix(auth): register global validation pipe\""
  echo "Ejemplo: ./finish_task.sh \"feat: new pages done\""
  exit 1
fi

COMMIT_MSG="$1"
MANUAL_ISSUE_NUM="$2"

# 1. Validar que no estamos en main
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "main" ] || [ -z "$CURRENT_BRANCH" ]; then
  echo "❌ Error: Estás en la rama '$CURRENT_BRANCH'. Debes estar en la rama de tu feature."
  exit 1
fi

echo "🌿 Rama actual: $CURRENT_BRANCH"

# 2. Extraer el TASK_ID del nombre de la rama (ej: feat/auth-AUTH-B-03 -> AUTH-B-03)
TASK_ID=$(echo "$CURRENT_BRANCH" | grep -oE '[A-Z]+(-[A-Z0-9]+)+' | tail -n 1)

# 3. Determinar el número de la Issue
if [ -n "$MANUAL_ISSUE_NUM" ]; then
  ISSUE_NUM="$MANUAL_ISSUE_NUM"
else
  echo "🔍 Buscando la issue correspondiente a [$TASK_ID] en GitHub..."
  ISSUE_NUM=$(gh issue list --search "$TASK_ID in:title" --state open --json number --jq '.[0].number' 2>/dev/null || true)
fi

# Si se encontró la issue, extraemos su título oficial para la PR
if [ -n "$ISSUE_NUM" ]; then
  PR_TITLE=$(gh issue view "$ISSUE_NUM" --json title --jq .title 2>/dev/null || echo "[$TASK_ID] $COMMIT_MSG")
  PR_BODY="Closes #$ISSUE_NUM"
else
  echo "⚠️ No se detectó ninguna issue abierta para '$TASK_ID'. Creando PR sin enlace automático de cierre."
  PR_TITLE="[$TASK_ID] $COMMIT_MSG"
  PR_BODY="Implementación en $CURRENT_BRANCH"
fi

# 4. Trabajar (Add & Commit)
echo "📦 [1/4] Preparando cambios y haciendo commit..."
git add .
# Comprueba si hay algo para commitear
if git diff-index --quiet HEAD --; then
  echo "ℹ️ No hay cambios pendientes por commitear. Continuando..."
else
  git commit -m "$COMMIT_MSG"
fi

# 5. Push
echo "🚀 [2/4] Subiendo rama a GitHub..."
git push -u origin "$CURRENT_BRANCH"

# 6. Crear Pull Request
echo "📝 [3/4] Creando Pull Request hacia main..."
PR_URL=$(gh pr create \
  --base main \
  --title "$PR_TITLE" \
  --body "$PR_BODY")

echo "✅ Pull Request creada exitosamente:"
echo "   👉 $PR_URL"
echo ""

# 7 y 8. Fusión y limpieza (opcional e interactivo)
read -p "¿La PR ya fue aprobada por un compañero y deseas hacer squash merge ahora? (s/N): " CONFIRM

if [[ "$CONFIRM" =~ ^[sSyY]$ ]]; then
  echo "🔀 [4/4] Fusionando PR y eliminando rama remota..."
  gh pr merge --squash --delete-branch

  echo "🔄 Volviendo a main y actualizando..."
  git switch main
  git pull origin main
  git fetch --prune

  echo "🎉 ¡Tarea completada y código integrado en main!"
else
  echo ""
  echo "⏳ Recuerda que el evaluador o tu compañero debe aprobar la PR en GitHub antes de hacer merge"
  echo "Cuando esté aprobada, ejecuta en tu terminal:"
  echo "   gh pr merge --squash --delete-branch && git switch main && git pull origin main"
fi