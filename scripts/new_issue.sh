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

create_issue_if_missing() {
  local task_id="$1"
  local title="$2"
  local assignees="$3"
  local labels="$4"
  local body="$5"

  # Verificar si ya existe una issue (abierta o cerrada) con este ID en el título
  local existing_issue
  existing_issue=$(gh issue list --search "$task_id in:title" --state all --json number --jq '.[0].number' 2>/dev/null || true)

  if [ -n "$existing_issue" ]; then
    echo "⏭️  [$task_id] Ya existe (Issue #$existing_issue). Saltando..."
  else
    echo "📝 [$task_id] Creando issue: '$title'..."
    local created_url
    created_url=$(gh issue create \
      --title "[$task_id]$title" \
      --assignee "$assignees" \
      --label "$labels" \
      --body "$body")
    echo "✅ Creada con éxito: $created_url"
  fi
}

# Asegurar que la etiqueta 'frontend' existe en el repo
gh label create frontend --description "Tareas de interfaz de usuario y cliente" --color "1d76db" --force >/dev/null 2>&1 || true

# ==============================================================================
# ==============================================================================

create_issue_if_missing \
  "FE-01" \
  "Tailwind CSS y configuración de tipografía base en index.css" \
  "ozamora-,brivera" \
  "frontend" \
  "### Objetivo
Configurar tokens de diseño y directivas @layer base para tipografía global (h1, h2, párrafos) sin alertas de linter.

### Criterios de Aceptación
- [ ] Directiva \`@layer base\` configurada en \`frontend/src/index.css\`.
- [ ] Clases utilitarias funcionando en toda la aplicación.
- [ ] Cero advertencias de sintaxis desconocida en el build de Vite."

create_issue_if_missing \
  "FE-06" \
  "Internacionalización i18n (EN/ES/IT) con persistencia en localStorage" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Sincronizar el sistema multilingüe existente en \`locales/\` para que persista la preferencia de idioma sin recargar la página.

### Criterios de Aceptación
- [ ] Diccionarios completos en \`locales/{en,es,it}\`.
- [ ] Hook/Store \`useLanguage\` persiste la clave \`app_lang\` en \`localStorage\`.
- [ ] Language switcher visible en el Header con cambio reactivo instantáneo."

create_issue_if_missing \
  "SHR-05" \
  "Estructura frontend modular src/pages y layout shell" \
  "ozamora-,brivera" \
  "frontend" \
  "### Objetivo
Crear la estructura modular de directorios para vistas (\`src/pages/\`) y layouts para separar pantallas de componentes atómicos.

### Criterios de Aceptación
- [ ] Directorio \`src/pages/\` creado con vistas placeholder.
- [ ] README explicativo en cada directorio estructural."

# ==============================================================================
# BLOQUE 2: Autenticación, Guard de Hidratación & Rutas
# ==============================================================================

create_issue_if_missing \
  "AUTH-F-02" \
  "Tipado estricto del cliente API (void vs UserResponse)" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Refactorizar \`api/api.ts\` para tipar estrictamente los retornos de promesas y garantizar el uso de credenciales en cada request.

### Criterios de Aceptación
- [ ] Peticiones de mutación sin payload retornan \`Promise<void>\`.
- [ ] \`getMe()\` retorna \`Promise<UserResponse>\` mapeado contra \`types/user.ts\`.
- [ ] Todas las llamadas utilizan \`withCredentials: true\` o \`credentials: 'include'\`."

create_issue_if_missing \
  "AUTH-F-03" \
  "Guard de hidratación de sesión al arranque (checkAuth)" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Evitar parpadeos de interfaz no autenticada validando la sesión contra \`/api/auth/me\` antes de renderizar la app.

### Criterios de Aceptación
- [ ] \`App.tsx\` inicia en estado de carga mientras resuelve la sesión.
- [ ] Si 200 OK: hidrata \`useAuthStore\` con el usuario.
- [ ] Si 401 Unauthorized: redirige o muestra el entrypoint con LoginForm."

create_issue_if_missing \
  "AUTH-F-04" \
  "Integración de LoginForm y RegisterForm en Modal reutilizable" \
  "ozamora-,brivera" \
  "frontend" \
  "### Objetivo
Montar los formularios de inicio de sesión y registro existentes dentro del nuevo componente \`Modal\`.

### Criterios de Aceptación
- [ ] Cierre en \`Escape\` o click fuera del overlay.
- [ ] Manejo de errores visuales y mensajes claros en caso de fallo de autenticación."

create_issue_if_missing \
  "AUTH-F-05" \
  "Botón y disparador visual para Google OAuth" \
  "brivera" \
  "frontend" \
  "### Objetivo
Integrar el componente de botón para autenticación federada con Google.

### Criterios de Aceptación
- [ ] Componente visual con logo oficial SVG dentro de los formularios.
- [ ] Redirige a \`/api/auth/google\` o mantiene estado inactivo controlado si el backend no lo expone."

create_issue_if_missing \
  "AUTH-F-06" \
  "Componente de protección de rutas (ProtectedRoute)" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Crear el componente Wrapper para impedir acceso a vistas privadas a usuarios anónimos.

### Criterios de Aceptación
- [ ] Redirige a \`/\` o \`/login\` si \`user === null\` en \`useAuthStore\`."

create_issue_if_missing \
  "FE-04" \
  "Enrutador declarativo (react-router-dom) y página 404" \
  "ozamora-,brivera" \
  "frontend" \
  "### Objetivo
Configurar el árbol de rutas en \`App.tsx\` envuelto en \`AppLayout.tsx\`.

### Criterios de Aceptación
- [ ] Rutas operativas: \`/\`, \`/home\`, \`/game\`, \`/profile\`, \`/stats\`, \`/rules\`, \`/about-us\`.
- [ ] Ruta comodín (\`*\`) renderiza componente \`NotFoundPage\` (404)."

create_issue_if_missing \
  "DOC-01" \
  "Páginas legales obligatorias (/terms y /privacy) en Footer" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Cumplir el requisito del Subject 42 creando las páginas legales con texto real del proyecto.

### Criterios de Aceptación
- [ ] Rutas \`/terms\` y \`/privacy\` creadas y accesibles desde \`Footer.tsx\`.
- [ ] Contenido no vacío ni con lorem ipsum."

# ==============================================================================
# BLOQUE 3: UI de Usuario, Navegación Lateral y Estadísticas
# ==============================================================================

create_issue_if_missing \
  "UI-01" \
  "Side Panel lateral retráctil (Drawer de modos y amigos)" \
  "brivera" \
  "frontend" \
  "### Objetivo
Construir un panel lateral desplegable en \`components/layout/SidePanel.tsx\` para selección de modos de juego y lista de amigos.

### Criterios de Aceptación
- [ ] Animación de colapso/despliegue suave.
- [ ] Sin scrollbars horizontales no deseadas."

create_issue_if_missing \
  "USER-F-01" \
  "Vista de Perfil de Usuario (ProfilePage con Avatar)" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Maquetar la página de visualización del perfil propio y componentes para edición de datos públicos.

### Criterios de Aceptación
- [ ] Renderizado de avatar con fallback.
- [ ] Muestra username y estadísticas resumidas."

create_issue_if_missing \
  "STAT-F-01" \
  "Dashboard de Estadísticas (StatsPage y Leaderboard)" \
  "brivera" \
  "frontend" \
  "### Objetivo
Maquetar la vista de métricas de juego (victorias, derrotas, ratio) y la tabla de clasificación.

### Criterios de Aceptación
- [ ] Consume el componente \`Table\` del Design System.
- [ ] Diferencia partidas contra jugadores de partidas contra Bots."

# ==============================================================================
# BLOQUE 4: WebSockets & Motor Gráfico Pixi.js
# ==============================================================================

create_issue_if_missing \
  "RT-F-01" \
  "Almacén de WebSockets (useSocketStore con Socket.io)" \
  "ozamora-" \
  "frontend" \
  "### Objetivo
Gestionar el ciclo de vida de la conexión en tiempo real conectando solo tras autenticación.

### Criterios de Aceptación
- [ ] Conexión a \`wss://localhost:8443\` con credenciales.
- [ ] Indicador visual de estado de conexión en el Header (verde/rojo)."

create_issue_if_missing \
  "GAME-F-01" \
  "Montaje de GameViewport con Pixi.js a 60 FPS estables" \
  "brivera" \
  "frontend" \
  "### Objetivo
Inicializar el canvas de juego garantizando rendimiento y limpieza de recursos.

### Criterios de Aceptación
- [ ] Montado sobre contenedor reactivo con \`ResizeObserver\`.
- [ ] \`app.destroy(true, { children: true })\` invocado en el cleanup del \`useEffect\` para evitar fugas de memoria o lienzos duplicados."

create_issue_if_missing \
  "GAME-F-02" \
  "Capa superpuesta de HUD sobre el canvas (vidas, bombas, tiempo)" \
  "brivera" \
  "frontend" \
  "### Objetivo
Crear los componentes de interfaz que muestran el estado de la partida sobre el lienzo de Pixi.

### Criterios de Aceptación
- [ ] Renderizado nítido y sincronizado con el estado de la partida."

create_issue_if_missing \
  "GAME-F-03" \
  "Despacho y sincronización de eventos de juego en tiempo real" \
  "brivera,ozamora-" \
  "frontend" \
  "### Objetivo
Conectar los inputs del teclado del jugador (movimiento, soltar bomba) con los eventos del WebSocket.

### Criterios de Aceptación
- [ ] Emisión fluida de inputs y renderizado reactivo del estado del tablero enviado por el backend."

# ==============================================================================
# BLOQUE 5: Calidad y Cierre
# ==============================================================================

create_issue_if_missing \
  "QA-FE-01" \
  "Auditoría de consola de Google Chrome (cero errores/warnings)" \
  "ozamora-,brivera" \
  "frontend" \
  "### Objetivo
Garantizar el cumplimiento estricto del Subject 42 verificando la consola del navegador.

### Criterios de Aceptación
- [ ] Cero warnings de React, claves duplicadas o errores de red no controlados en Chrome DevTools."

echo "--------------------------------------------------------"
echo "🎉 ¡Auditoría completada! Todas las issues necesarias están en GitHub."