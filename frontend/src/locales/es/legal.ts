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
          'Esta aplicación web es un proyecto de ingeniería de software sin ánimo de lucro creado como parte del currículo de 42 Madrid por ozamora-, brivera, enogueir y raperez-. Es un trabajo estudiantil independiente: no está operado, respaldado ni afiliado a 42, a la Fundación Telefónica ni a ninguna otra institución. El servicio se ofrece con fines estrictamente educativos, de demostración técnica y recreativos. Al crear una cuenta o utilizar la plataforma aceptas estas condiciones; si no estás de acuerdo, no utilices el servicio.',
      },
      eligibility: {
        title: '2. Requisitos de Acceso',
        content:
          'Debes tener al menos 14 años y capacidad legal para aceptar estas condiciones. Las cuentas son personales: una cuenta por persona, y no pueden venderse, compartirse ni transferirse a terceros.',
      },
      account: {
        title: '3. Registro y Seguridad de la Cuenta',
        content:
          'Para acceder al lobby, al chat y a las partidas multijugador es necesario crear una cuenta mediante correo electrónico y contraseña o autenticación OAuth 2.0 (Google). El usuario se compromete a proporcionar datos veraces, a mantener la confidencialidad de sus credenciales y a responder de toda la actividad realizada con su cuenta. Si sospechas un acceso no autorizado, cambia tu contraseña y contacta con el equipo. Podemos suspender o eliminar cuentas que incumplan estas condiciones.',
      },
      conduct: {
        title: '4. Uso Aceptable y Normas de Conducta',
        content:
          'Al participar en salas multijugador o utilizar los canales de chat global, el usuario acepta respetar las siguientes normas:',
        bullet1:
          'No publicar contenido ofensivo, discriminatorio, difamatorio ni spam en los canales de chat.',
        bullet2:
          'No utilizar bots externos, scripts automatizados ni explotar los mensajes WebSocket o el protocolo del juego para obtener ventaja.',
        bullet3:
          'No suplantar la identidad de otros jugadores ni interferir con la estabilidad del servidor o con otras sesiones.',
        bullet4:
          'No intentar acceder sin autorización a las cuentas o datos de otros usuarios ni a la base de datos.',
        bullet5:
          'No publicar contenido ilegal ni contenido que vulnere derechos de terceros.',
        bullet6:
          'No distribuir malware, enlaces de phishing ni publicidad no solicitada.',
      },
      content: {
        title: '5. Contenido Generado por el Usuario',
        content:
          'Conservas la propiedad de los mensajes y avatares que publicas. Al publicarlos concedes al proyecto una licencia no exclusiva y gratuita para almacenarlos, mostrarlos y transmitirlos según sea necesario para el chat y los perfiles. El chat público es visible para otros usuarios y no debe considerarse privado. Podemos retirar contenido que incumpla estas condiciones y conservar un registro de las acciones de moderación.',
      },
      fairPlay: {
        title: '6. Juego Limpio e Integridad de la Partida',
        content:
          'El servidor valida el juego: el cliente solo envía entradas, mientras que el servidor controla colisiones, bombas, ticks y resultados. Está prohibido manipular el cliente, falsificar eventos, explotar errores para ganar o aliarse para alterar los resultados clasificatorios. Las partidas obtenidas haciendo trampas podrán invalidarse y la cuenta suspenderse.',
      },
      ip: {
        title: '7. Propiedad Intelectual y Licencia',
        content:
          'El código fuente de esta aplicación ha sido desarrollado por el equipo autor y se publica con fines de revisión académica y demostración de portfolio. Salvo que el repositorio incluya un archivo de licencia independiente, todos los derechos permanecen en manos de los autores. El nombre 42 y las marcas, sprites o referencias visuales de terceros pertenecen a sus respectivos propietarios y se usan aquí únicamente con fines de demostración educativa.',
      },
      availability: {
        title: '8. Disponibilidad, Cambios y Cancelación',
        content:
          'Esta plataforma es un prototipo académico que se ofrece "tal cual" (as is). Podemos modificar, interrumpir o retirar funcionalidades, partidas o el servicio completo por mantenimiento, evaluación o al finalizar el proyecto, sin previo aviso y sin responsabilidad. Podemos suspender o cancelar cuentas que incumplan estas condiciones, y tú puedes dejar de usar el servicio y solicitar la eliminación en cualquier momento.',
      },
      liability: {
        title: '9. Exclusión de Garantías y Limitación de Responsabilidad',
        content:
          'En la máxima medida permitida por la ley, el equipo no responde de daños indirectos o consecuentes, pérdida de datos ni interrupciones derivadas del uso de este prototipo. Nada en estas condiciones excluye la responsabilidad que la ley no permite excluir ni los derechos que la normativa de consumo te reconoce.',
      },
      law: {
        title: '10. Legislación Aplicable y Conflictos',
        content:
          'Estas condiciones se rigen por la legislación española. Cualquier controversia se someterá a los juzgados y tribunales competentes de Madrid, sin perjuicio de los derechos que la normativa de consumo te conceda.',
      },
      changes: {
        title: '11. Modificaciones de los Términos',
        content:
          'Podemos actualizar estas condiciones cuando el proyecto evolucione. La fecha de "última actualización" al inicio de la página muestra la versión vigente, y seguir usando el servicio tras un cambio implica aceptar los términos revisados.',
      },
      contact: {
        title: '12. Contacto',
        content:
          'Las dudas sobre estas condiciones pueden enviarse al equipo a través de la sección de issues del repositorio oficial de ft_transcendence, o plantearse durante la sesión de evaluación entre iguales.',
      },
    },
  },
  privacy: {
    badge: 'Protección de Datos y RGPD',
    title: 'Política de Privacidad',
    subtitle:
      'Información transparente sobre qué datos personales recopilamos en ft_transcendence (Bomberman), cómo los protegemos y cómo puedes gestionar tu cuenta.',
    highlights: {
      encryptionTitle: 'Hash de Contraseñas Argon2id',
      encryptionDesc:
        'Las contraseñas nunca se almacenan en texto plano; se protegen con hash criptográfico con sal.',
      cookiesTitle: 'Cookies Estrictamente Técnicas',
      cookiesDesc:
        'Solo usamos una cookie de sesión HttpOnly con JWT y almacenamiento local para tu idioma.',
      noAdsTitle: 'Sin Fines Comerciales',
      noAdsDesc:
        'Tus datos no se venden ni se comparten con redes publicitarias o terceros.',
    },
    sections: {
      controller: {
        title: '1. Responsable y Finalidad del Tratamiento',
        content:
          'El responsable del tratamiento es el equipo de desarrollo de ft_transcendence (ozamora-, brivera, enogueir y raperez-), en el marco del currículo de 42 Madrid. Es un proyecto estudiantil sin ánimo de lucro: no está operado, respaldado ni afiliado a 42 ni a ninguna otra institución. Los datos personales se tratan exclusivamente para ofrecer autenticación, emparejamiento multijugador en tiempo real, chat, amistades y estadísticas de partidas.',
      },
      dataCollected: {
        title: '2. Datos que Recopilamos',
        content:
          'Al registrarte y utilizar la plataforma, almacenamos únicamente los datos mínimos necesarios en nuestra base de datos PostgreSQL:',
        bullet1:
          'Datos de cuenta: nombre de usuario, correo electrónico y hash de contraseña generado con Argon2id. La contraseña en claro nunca se almacena ni se registra en logs.',
        bullet2:
          'Datos de perfil y actividad: avatar subido, lista de amistades, mensajes de chat, progresión de XP, victorias/derrotas e historial de partidas.',
        bullet3:
          'Autenticación externa (Google OAuth 2.0): si eliges iniciar sesión con Google, recibimos únicamente tu identificador básico y tu correo para vincular tu perfil.',
        bullet4:
          'Datos técnicos: dirección IP, identificación del navegador y marcas temporales de sesión que pueden quedar registradas en los logs del servidor, para seguridad, prevención de abusos y depuración.',
      },
      legalBasis: {
        title: '3. Base Legal del Tratamiento',
        content:
          'El tratamiento se basa en la ejecución del servicio que solicitas (creación de cuenta, partidas y estadísticas), en tu consentimiento al activar funciones opcionales como el acceso con Google o el avatar, y en nuestro interés legítimo en mantener la plataforma segura y prevenir abusos, conforme al artículo 6 del RGPD. Puedes retirar tu consentimiento en cualquier momento eliminando los datos correspondientes o tu cuenta.',
      },
      cookies: {
        title: '4. Uso de Cookies y Almacenamiento Local',
        content:
          'Esta plataforma no utiliza cookies publicitarias ni rastreadores de terceros. Empleamos únicamente una cookie de sesión HttpOnly / SameSite con tu token JWT para mantener tu sesión segura, además de localStorage del navegador para recordar tu preferencia de idioma (ES / EN / IT). Al ser cookies estrictamente necesarias no se muestra un banner de consentimiento; puedes bloquearlas o eliminarlas en tu navegador, pero la cookie de sesión es imprescindible para seguir conectado.',
      },
      security: {
        title: '5. Medidas de Seguridad',
        content:
          'Las contraseñas se protegen con Argon2id y nunca se almacenan ni se registran en texto plano. La sesión usa un JWT firmado en una cookie HttpOnly y SameSite, y todas las comunicaciones entre cliente y servidor, incluido el WebSocket, se cifran con HTTPS y WSS. El acceso a la base de datos y a la configuración de los contenedores está restringido al equipo, y las credenciales se guardan en un archivo .env ignorado por Git que nunca se publica en el repositorio.',
      },
      retention: {
        title: '6. Conservación de los Datos',
        content:
          'Los datos de la cuenta se conservan mientras la cuenta exista y durante el ciclo de desarrollo y evaluación académica. Los mensajes de chat y el historial de partidas se mantienen mientras la cuenta esté activa. Los logs técnicos se guardan un periodo breve por motivos de seguridad y después se descartan. Al finalizar la evaluación, la base de datos podrá purgarse y los datos personales se eliminarán o anonimizarán.',
      },
      sharing: {
        title: '7. Cesión de Datos y Terceros',
        content:
          'No vendemos, alquilamos ni cedemos datos personales a anunciantes o intermediarios de datos, y la aplicación no incluye analítica de terceros. Solo intercambiamos datos con Google cuando eliges expresamente iniciar sesión con OAuth 2.0, y con el proveedor de infraestructura que aloja el despliegue en contenedores, únicamente para ejecutar el servicio. Por diseño, tu perfil público, tu estado en línea y los mensajes de los canales públicos son visibles para otros usuarios conectados.',
      },
      rights: {
        title: '8. Tus Derechos',
        content:
          'Conforme al RGPD puedes ejercer los siguientes derechos, de forma gratuita, contactando con el equipo a través del repositorio oficial del proyecto. Respondemos a las solicitudes en el plazo de un mes:',
        bullet1:
          'Acceso: obtener una copia de los datos personales que conservamos sobre ti.',
        bullet2:
          'Rectificación: corregir datos inexactos directamente desde tu página de perfil.',
        bullet3:
          'Supresión: solicitar la eliminación de tu cuenta y de los registros asociados.',
        bullet4:
          'Limitación y oposición: pedir que limitemos o detengamos un tratamiento concreto.',
        bullet5:
          'Portabilidad: recibir tus datos en un formato estructurado y legible por máquina.',
        bullet6:
          'Reclamación: presentar una reclamación ante tu autoridad de control (en España, la AEPD).',
      },
      children: {
        title: '9. Menores y Edad Mínima',
        content:
          'El servicio no está dirigido a menores. Debes tener al menos 14 años, la edad mínima de consentimiento digital en España, para crear una cuenta. Si detectamos que una cuenta pertenece a un menor de esa edad, la eliminaremos junto con sus datos personales.',
      },
      changes: {
        title: '10. Cambios en esta Política',
        content:
          'Podemos actualizar esta política cuando cambien las funcionalidades del proyecto, por ejemplo si un nuevo módulo introduce una fuente de datos adicional. La fecha de "última actualización" al inicio de la página refleja siempre la versión vigente, y los cambios importantes se anunciarán dentro de la aplicación.',
      },
      contact: {
        title: '11. Contacto',
        content:
          'Para cualquier duda de privacidad, solicitud de datos o aviso de seguridad, contacta con el equipo a través de la sección de issues del repositorio oficial de ft_transcendence o plantéalo durante la sesión de evaluación entre iguales. No publiques datos personales sensibles en issues públicos.',
      },
    },
  },
};
