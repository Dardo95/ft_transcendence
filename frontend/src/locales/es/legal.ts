/**
 * Spanish legal translations (Terms of Service & Privacy Policy).
 * Category: Translation Resource
 */
export const legalEs = {
  lastUpdated: 'Última actualización: Noviembre 2026',
  terms: {
    badge: 'Marco Legal y Uso',
    title: 'Términos y Condiciones de Uso',
    subtitle:
      'Condiciones que regulan el acceso y uso de la plataforma multijugador ft_transcendence (Bomberman), desarrollada como proyecto académico en 42 Madrid.',
    sections: {
      scope: {
        title: '1. Objeto y Naturaleza Académica',
        content:
          'Esta aplicación web es un proyecto de ingeniería de software desarrollado sin ánimo de lucro como parte del currículo de 42 Madrid por ozamora-, brivera, enogueir y raperez-. El servicio se ofrece con fines estrictamente educativos, de demostración técnica y recreativos.',
      },
      account: {
        title: '2. Registro y Seguridad de la Cuenta',
        content:
          'Para acceder al lobby, al chat y a las partidas multijugador es necesario crear una cuenta mediante correo electrónico o autenticación OAuth 2.0 (Google). El usuario se compromete a proporcionar datos veraces y a mantener la confidencialidad de sus credenciales.',
      },
      conduct: {
        title: '3. Normas de Conducta y Juego Limpio',
        content:
          'Al participar en salas multijugador o utilizar el chat global, el usuario acepta respetar las siguientes normas básicas:',
        bullet1:
          'No publicar contenido ofensivo, discriminatorio, difamatorio ni spam en los canales de chat.',
        bullet2:
          'No utilizar bots externos, scripts automatizados ni explotar vulnerabilidades en la comunicación WebSocket para alterar las partidas.',
        bullet3:
          'No suplantar la identidad de otros jugadores ni interferir con la disponibilidad del servidor.',
      },
      ip: {
        title: '4. Propiedad Intelectual y Licencia',
        content:
          'El código fuente de esta aplicación ha sido desarrollado por el equipo autor y se distribuye bajo la Licencia MIT con fines de portfolio y revisión académica. Los nombres, logotipos y referencias visuales de carácter recreativo pertenecen a sus respectivos propietarios.',
      },
      liability: {
        title: '5. Disponibilidad y Limitación de Responsabilidad',
        content:
          'Dado su carácter académico y experimental, el servicio se proporciona "tal cual" (as is), sin garantías de disponibilidad ininterrumpida ni persistencia permanente de las estadísticas o historiales de partidas tras el periodo de evaluación.',
      },
    },
  },
  privacy: {
    badge: 'Protección de Datos y RGPD',
    title: 'Política de Privacidad',
    subtitle:
      'Información transparente sobre qué datos personales recopilamos en ft_transcendence (Bomberman), cómo los protegemos y cómo puedes gestionar tu cuenta.',
    highlights: {
      encryptionTitle: 'Cifrado Argon2id',
      encryptionDesc:
        'Las contraseñas nunca se almacenan en texto plano; se protegen con hash criptográfico.',
      cookiesTitle: 'Cookies Estrictamente Técnicas',
      cookiesDesc:
        'Solo usamos cookies HttpOnly JWT para sesión y almacenamiento local para el idioma.',
      noAdsTitle: 'Sin Fines Comerciales',
      noAdsDesc:
        'Tus datos no se venden ni se comparten con redes publicitarias o terceros.',
    },
    sections: {
      controller: {
        title: '1. Responsable y Finalidad del Tratamiento',
        content:
          'Los datos personales recogidos en esta aplicación son tratados exclusivamente por el equipo de desarrollo (ozamora-, brivera, enogueir y raperez-) con la única finalidad de permitir la autenticación de usuarios, el emparejamiento en tiempo real, el chat social y el registro de estadísticas dentro del proyecto académico ft_transcendence.',
      },
      dataCollected: {
        title: '2. Datos que Recopilamos',
        content:
          'Al registrarte y utilizar la plataforma, almacenamos únicamente los datos mínimos necesarios en nuestra base de datos PostgreSQL:',
        bullet1:
          'Datos de cuenta: nombre de usuario (username), correo electrónico y contraseña cifrada mediante Argon2id.',
        bullet2:
          'Datos de perfil y actividad: avatar personalizado, lista de amistades, mensajes de chat, puntuación XP e historial de partidas.',
        bullet3:
          'Autenticación externa (Google OAuth 2.0): si eliges iniciar sesión con Google, recibimos únicamente tu identificador y correo básicos para vincular tu perfil.',
      },
      cookies: {
        title: '3. Uso de Cookies y Almacenamiento Local',
        content:
          'Esta plataforma no utiliza cookies de seguimiento, analítica externa ni publicidad. Únicamente empleamos una cookie de sesión HttpOnly / SameSite con tu token JWT para mantener tu sesión segura y localStorage del navegador para recordar tu preferencia de idioma (ES / EN / IT).',
      },
      security: {
        title: '4. Medidas de Seguridad y Conservación',
        content:
          'Todas las comunicaciones entre el navegador y el servidor se cifran mediante HTTPS/WSS. Los datos se conservarán únicamente durante el periodo de desarrollo y evaluación académica del proyecto en 42 Madrid, tras el cual la base de datos podrá ser eliminada.',
      },
      rights: {
        title: '5. Derechos del Usuario',
        content:
          'En cualquier momento puedes consultar, editar tu nombre de usuario o sustituir tu avatar directamente desde tu perfil privado (/profile). Para solicitar la eliminación completa de tu cuenta y registros asociados, puedes contactar con el equipo a través del repositorio oficial del proyecto.',
      },
    },
  },
};
