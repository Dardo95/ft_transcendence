/**
 * Spanish project page translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Claimed module breakdown and points.
 * - Module requirements.
 *
 * Translation resources must not contain application logic.
 */

export const projectEs = {
  title: 'Sobre el Proyecto',
  subtitle:
    'Especificación técnica, arquitectura del sistema y desglose de módulos evaluados según la normativa oficial (v21.2).',
  summaryMandatory: 'Obligatorio',
  summaryBonus: 'Bonus',
  mandatoryHeading: 'Módulos Obligatorios de Base',
  bonusHeading: 'Módulos Bonus (Máx 5 pts)',
  extraHeading: 'Módulos extra',
  extraDesc:
    'Módulos o funcionalidades adicionales que no forman parte de los criterios obligatorios ni del bonus, pero que pueden mejorar el proyecto.',
  pointsLabel: 'Puntos Declarados',
  pts: 'pts',
  minPoints: 'Mín 14 pts',
  maxPoints: 'Máx 5 pts',
  colModule: 'Módulo',
  colCategory: 'Categoría',
  colType: 'Tipo',
  colPoints: 'Puntos',
  categories: {
    web: 'Web',
    userMgmt: 'Gestión de usuarios',
    gaming: 'Juego y experiencia de usuario',
    a11y: 'Accesibilidad e internacionalización',
  },
  types: {
    major: 'Mayor (2 pts)',
    minor: 'Menor (1 pt)',
  },
  modules: {
    frameworks: {
      title: 'Usar un framework tanto para el frontend como para el backend',
      requirements: [
        'Framework de frontend (React, Vue, Angular, Svelte, etc.).',
        'Framework de backend (Express, NestJS, Django, Flask, Ruby on Rails, etc.).',
        'Los frameworks full-stack (Next.js, Nuxt.js, SvelteKit) cuentan como ambos si se usan sus capacidades de frontend y backend.',
      ],
    },
    websockets: {
      title:
        'Implementar funcionalidades en tiempo real mediante WebSockets o una tecnología similar',
      requirements: [
        'Actualizaciones en tiempo real entre clientes.',
        'Gestionar la conexión y la desconexión de forma correcta.',
        'Difusión eficiente de mensajes.',
      ],
    },
    interaction: {
      title: 'Permitir que los usuarios interactúen con otros usuarios',
      requirements: [
        'Un sistema de chat básico (enviar/recibir mensajes entre usuarios).',
        'Un sistema de perfiles (ver la información de los usuarios).',
        'Un sistema de amigos (añadir/eliminar amigos, ver la lista de amigos).',
      ],
    },
    userMgmt: {
      title: 'Gestión de usuarios estándar y autenticación',
      requirements: [
        'Los usuarios pueden actualizar la información de su perfil.',
        'Los usuarios pueden subir un avatar (con un avatar por defecto si no se proporciona).',
        'Los usuarios pueden añadir a otros usuarios como amigos y ver su estado en línea.',
        'Los usuarios disponen de una página de perfil que muestra su información.',
      ],
    },
    game: {
      title:
        'Implementar un juego web completo en el que los usuarios puedan jugar entre ellos',
      requirements: [
        'El juego puede ser multijugador en tiempo real (p. ej., Pong, ajedrez, tres en raya, juegos de cartas, etc.).',
        'Los jugadores deben poder disputar partidas en vivo.',
        'El juego debe tener reglas claras y condiciones de victoria/derrota.',
        'El juego puede ser en 2D o en 3D.',
      ],
    },
    remote: {
      title:
        'Jugadores remotos: permitir que dos jugadores en ordenadores separados jueguen la misma partida en tiempo real',
      requirements: [
        'Gestionar la latencia de red y las desconexiones de forma correcta.',
        'Ofrecer una experiencia fluida en el juego remoto.',
        'Implementar la lógica de reconexión.',
      ],
    },
    multiplayer: {
      title: 'Juego multijugador (más de dos jugadores)',
      requirements: [
        'Soporte para tres o más jugadores simultáneamente.',
        'Mecánicas de juego justas para todos los participantes.',
        'Sincronización correcta entre todos los clientes.',
      ],
    },
    orm: {
      title: 'Usar un ORM para la base de datos',
      requirements: [
        'Un ORM (Object-Relational Mapping) es una técnica de programación que permite interactuar con una base de datos relacional mediante código orientado a objetos en lugar de escribir SQL directamente.',
        'PrismaORM fue elegido para su implementación, proporcionando un esquema de base de datos limpio, tipos automáticos de TypeScript y una fácil integración con NestJS y PostgreSQL.',
      ],
    },
    i18n: {
      title: 'Soporte para varios idiomas (al menos 3 idiomas)',
      requirements: [
        'Implementar un sistema de i18n (internacionalización).',
        'Al menos 3 traducciones completas de idiomas.',
        'Selector de idioma en la interfaz.',
        'Todo el texto visible para el usuario debe ser traducible.',
      ],
    },
    customization: {
      title: 'Opciones de personalización del juego',
      requirements: [
        'Power-ups, ataques o habilidades especiales.',
        'Mapas o temas diferentes.',
        'Ajustes del juego personalizables.',
        'Deben estar disponibles las opciones por defecto.',
      ],
    },
    stats: {
      title: 'Estadísticas del juego e historial de partidas',
      requirements: [
        'Registrar las estadísticas del usuario (victorias, derrotas, clasificación, nivel, etc.).',
        'Mostrar el historial de partidas (partidas 1v1, fechas, resultados, rivales).',
        'Mostrar logros y progresión.',
        'Integración con la tabla de clasificación.',
      ],
    },
    spectator: {
      title: 'Implementar el modo espectador para los juegos',
      requirements: [
        'Permitir a los usuarios ver partidas en curso.',
        'Actualizaciones en tiempo real para los espectadores.',
        'Opcional: chat de espectadores.',
      ],
    },
    oauth: {
      title:
        'Implementar autenticación remota con OAuth 2.0 (Google, GitHub, 42, etc.)',
      requirements: [
        'OAuth 2.0 es una forma segura de que las aplicaciones accedan a tu información en otro servicio, permitiéndote iniciar sesión directamente con ese servicio en lugar de darle tu contraseña a la aplicación.',
        'Se ha elegido implementar Google OAuth 2.0.',
      ],
    },
  },
} as const;
