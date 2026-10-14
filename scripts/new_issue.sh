#!/usr/bin/env bash

# Salir inmediatamente ante errores críticos
set -e

# Comprobar autenticación de GitHub CLI
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ Error: GitHub CLI no está autenticado. Ejecuta 'gh auth login' primero."
  exit 1
fi

echo "🚀 Iniciando auditoría y creación de Issues..."
echo "--------------------------------------------------------"

# Lista acumuladora para asociar después al commit/PR
GENERATED_CLOSES=()

create_issue_if_missing() {
  local task_id="$1"
  local title="$2"
  local assignees_raw="$3"
  local labels="$4"
  local body="$5"

  # Verificar si ya existe una issue (abierta o cerrada) con este ID en el título
  local existing_issue
  existing_issue=$(gh issue list --search "$task_id in:title" --state all --json number --jq '.[0].number' 2>/dev/null || true)

  if [ -n "$existing_issue" ]; then
    echo "⏭️  [$task_id] Ya existe (Issue #$existing_issue). Saltando..."
    GENERATED_CLOSES+=("Closes #$existing_issue")
  else
    echo "📝 [$task_id] Creando issue: '$title'..."

    # Procesar assignees para compatibilidad con gh CLI (permite "user1,user2")
    local assignee_flags=()
    if [ -n "$assignees_raw" ]; then
      IFS=',' read -ra ADDR <<< "$assignees_raw"
      for user in "${ADDR[@]}"; do
        assignee_flags+=(--assignee "$user")
      done
    fi

    # Procesar labels múltiples separadas por comas
    local label_flags=()
    if [ -n "$labels" ]; then
      IFS=',' read -ra LADDR <<< "$labels"
      for lbl in "${LADDR[@]}"; do
        label_flags+=(--label "$lbl")
      done
    fi

    local created_url
    created_url=$(gh issue create \
      --title "[$task_id]$title" \
      "${assignee_flags[@]}" \
      "${label_flags[@]}" \
      --body "$body")

    # Extraer el número generado
    local issue_num
    issue_num=$(echo "$created_url" \vert{} grep -oE '[0-9]+$')

    echo "✅ Creada con éxito (#$issue_num):$created_url"
    GENERATED_CLOSES+=("Closes #$issue_num")
  fi
}

# ==============================================================================
# EJEMPLO DE USO
# ==============================================================================

# create_issue_if_missing \
#   "FE-01" \
#   "Tailwind CSS y configuración de tipografía base en index.css" \
#   "ozamora-,brivera" \
#   "frontend" \
#   "### Objetivo
# Configurar tokens de diseño y directivas @layer base para tipografía global (h1, h2, párrafos) sin alertas de linter.

# ### Criterios de Aceptación
# - [ ] Directiva \`@layer base\` configurada en \`frontend/src/index.css\`.
# - [ ] Clases utilitarias funcionando en toda la aplicación.
# - [ ] Cero advertencias de sintaxis desconocida en el build de Vite."

# create_issue_if_missing \
#   "FE-10" \
#   "Branding básico y metadatos del juego en HTML" \
#   "brivera" \
#   "frontend" \
#   "### Objetivo
# Actualizar favicon, título y estilos base de carga."

# ==============================================================================
# TAREAS A CREAR (Añade aquí las tareas de tu rama)
# ==============================================================================







# ==============================================================================
# RESUMEN PARA COMMIT / PR
# ==============================================================================
echo "--------------------------------------------------------"
echo "🎉 ¡Auditoría completada!"
echo ""
echo "📌 Para vincular todas estas tareas en tu commit o PR, copia este texto:"
echo -e "\033[1;32m$(IFS=', '; echo "${GENERATED_CLOSES[*]}")\033[0m"