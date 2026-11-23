/**
 * Italian project page translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Claimed module breakdown and points.
 * - Module requirements.
 *
 * Translation resources must not contain application logic.
 */

export const projectIt = {
  title: 'Sul Progetto',
  subtitle:
    'Specifiche tecniche, architettura di sistema e suddivisione dei moduli valutati secondo il regolamento ufficiale di 42 (v21.2).',
  summaryMandatory: 'Obbligatorio',
  summaryBonus: 'Bonus',
  mandatoryHeading: 'Moduli Obbligatori di Base',
  bonusHeading: 'Moduli Bonus (Max 5 pt)',
  extraHeading: 'Moduli extra',
  extraDesc:
    'Moduli o funzionalità aggiuntive che non rientrano nei criteri obbligatori o bonus, ma che possono migliorare il progetto.',
  pointsLabel: 'Punti Dichiarati',
  pts: 'pt',
  minPoints: 'Min 14 pt',
  maxPoints: 'Max 5 pt',
  colModule: 'Modulo',
  colCategory: 'Categoria',
  colType: 'Tipo',
  colPoints: 'Punti',
  categories: {
    web: 'Web',
    userMgmt: 'Gestione utenti',
    gaming: 'Gioco ed esperienza utente',
    a11y: 'Accessibilità e internazionalizzazione',
  },
  types: {
    major: 'Maggiore (2 pt)',
    minor: 'Minore (1 pt)',
  },
  modules: {
    frameworks: {
      title: 'Usare un framework sia per il frontend che per il backend',
      requirements: [
        'Framework frontend (React, Vue, Angular, Svelte, ecc.).',
        'Framework backend (Express, NestJS, Django, Flask, Ruby on Rails, ecc.).',
        'I framework full-stack (Next.js, Nuxt.js, SvelteKit) contano come entrambi se si usano le loro capacità frontend e backend.',
      ],
    },
    websockets: {
      title:
        'Implementare funzionalità in tempo reale tramite WebSocket o una tecnologia simile',
      requirements: [
        'Aggiornamenti in tempo reale tra i client.',
        'Gestire connessione e disconnessione in modo corretto.',
        'Diffusione efficiente dei messaggi.',
      ],
    },
    interaction: {
      title: 'Permettere agli utenti di interagire con altri utenti',
      requirements: [
        'Un sistema di chat di base (invio/ricezione di messaggi tra utenti).',
        'Un sistema di profili (visualizzazione delle informazioni degli utenti).',
        'Un sistema di amici (aggiunta/rimozione di amici, elenco amici).',
      ],
    },
    userMgmt: {
      title: 'Gestione utenti standard e autenticazione',
      requirements: [
        'Gli utenti possono aggiornare le informazioni del proprio profilo.',
        'Gli utenti possono caricare un avatar (con un avatar predefinito se non fornito).',
        'Gli utenti possono aggiungere altri utenti come amici e vederne lo stato online.',
        'Gli utenti hanno una pagina profilo che mostra le loro informazioni.',
      ],
    },
    game: {
      title:
        'Implementare un gioco web completo in cui gli utenti possono sfidarsi',
      requirements: [
        'Il gioco può essere multigiocatore in tempo reale (ad es. Pong, scacchi, tris, giochi di carte, ecc.).',
        'I giocatori devono poter disputare partite dal vivo.',
        'Il gioco deve avere regole chiare e condizioni di vittoria/sconfitta.',
        'Il gioco può essere 2D o 3D.',
      ],
    },
    remote: {
      title:
        'Giocatori remoti: consentire a due giocatori su computer separati di giocare la stessa partita in tempo reale',
      requirements: [
        'Gestire latenza di rete e disconnessioni in modo corretto.',
        'Offrire un’esperienza fluida nel gioco remoto.',
        'Implementare la logica di riconnessione.',
      ],
    },
    multiplayer: {
      title: 'Partita multigiocatore (più di due giocatori)',
      requirements: [
        'Supporto per tre o più giocatori contemporaneamente.',
        'Meccaniche di gioco eque per tutti i partecipanti.',
        'Sincronizzazione corretta tra tutti i client.',
      ],
    },
    orm: {
      title: 'Usare un ORM per il database',
      requirements: [
        'Un ORM (Object-Relational Mapping) è una tecnica di programmazione che consente di interagire con un database relazionale tramite codice orientato agli oggetti invece di scrivere SQL direttamente.',
        'PrismaORM è stato scelto per l’implementazione, fornendo uno schema di database pulito, tipi TypeScript automatici e facile integrazione con NestJS e PostgreSQL.',
      ],
    },
    i18n: {
      title: 'Supporto per più lingue (almeno 3 lingue)',
      requirements: [
        'Implementare un sistema di i18n (internazionalizzazione).',
        'Almeno 3 traduzioni complete.',
        'Selettore della lingua nell’interfaccia.',
        'Tutto il testo visibile all’utente deve essere traducibile.',
      ],
    },
    customization: {
      title: 'Opzioni di personalizzazione del gioco',
      requirements: [
        'Power-up, attacchi o abilità speciali.',
        'Mappe o temi diversi.',
        'Impostazioni di gioco personalizzabili.',
        'Le opzioni predefinite devono essere disponibili.',
      ],
    },
    stats: {
      title: 'Statistiche di gioco e cronologia delle partite',
      requirements: [
        'Tenere traccia delle statistiche di gioco (vittorie, sconfitte, classifica, livello, ecc.).',
        'Mostrare la cronologia delle partite (partite 1v1, date, risultati, avversari).',
        'Mostrare obiettivi e progressione.',
        'Integrazione con la classifica.',
      ],
    },
    spectator: {
      title: 'Implementare la modalità spettatore per i giochi',
      requirements: [
        'Permettere agli utenti di guardare le partite in corso.',
        'Aggiornamenti in tempo reale per gli spettatori.',
        'Opzionale: chat degli spettatori.',
      ],
    },
    oauth: {
      title:
        'Implementare l’autenticazione remota con OAuth 2.0 (Google, GitHub, 42, ecc.)',
      requirements: [
        'OAuth 2.0 è un modo sicuro per consentire alle applicazioni di accedere alle tue informazioni su un altro servizio, permettendoti di accedere direttamente con quel servizio invece di fornire la tua password all’applicazione.',
        'È stato scelto di implementare Google OAuth 2.0.',
      ],
    },
  },
} as const;
