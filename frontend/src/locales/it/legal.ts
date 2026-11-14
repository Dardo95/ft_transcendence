/**
 * Italian legal translations (Terms of Service & Privacy Policy).
 * Category: Translation Resource
 */
export const legalIt = {
  lastUpdated: 'Ultimo aggiornamento: Novembre 2026',
  terms: {
    badge: 'Termini Legali e Uso',
    title: 'Termini e Condizioni di Utilizzo',
    subtitle:
      'Condizioni che regolano l’accesso e l’uso della piattaforma multigiocatore ft_transcendence (Bomberman), sviluppata come progetto accademico presso 42 Madrid.',
    sections: {
      scope: {
        title: '1. Oggetto e Natura Accademica',
        content:
          'Questa applicazione web è un progetto di ingegneria del software senza scopo di lucro realizzato nell’ambito del curriculum di 42 Madrid da ozamora-, brivera, enogueir e raperez-. Il servizio è fornito esclusivamente a fini educativi, dimostrativi e ricreativi.',
      },
      account: {
        title: '2. Registrazione e Sicurezza dell’Account',
        content:
          'Per accedere alla lobby, alla chat e alle partite multigiocatore è necessario creare un account tramite email o autenticazione OAuth 2.0 (Google). L’utente si impegna a fornire dati veritieri e a custodire le proprie credenziali.',
      },
      conduct: {
        title: '3. Regole di Condotta e Fair Play',
        content:
          'Partecipando alle stanze multigiocatore o utilizzando la chat globale, l’utente accetta di rispettare le seguenti regole:',
        bullet1:
          'Non pubblicare contenuti offensivi, discriminatori, diffamatori o spam nei canali di chat.',
        bullet2:
          'Non utilizzare bot esterni, script automatizzati né sfruttare vulnerabilità nelle comunicazioni WebSocket per alterare le partite.',
        bullet3:
          'Non impersonare altri giocatori né compromettere la stabilità del server.',
      },
      ip: {
        title: '4. Proprietà Intellettuale e Licenza',
        content:
          'Il codice sorgente di questa applicazione è stato sviluppato dal team autore ed è distribuito con Licenza MIT a scopo di portfolio e valutazione accademica. Eventuali riferimenti visivi ricreativi appartengono ai rispettivi proprietari.',
      },
      liability: {
        title: '5. Disponibilità e Limitazione di Responsabilità',
        content:
          'Data la natura accademica e sperimentale del progetto, il servizio è fornito "così com’è" (as is), senza garanzie di disponibilità continua né di conservazione permanente delle statistiche dopo il periodo di valutazione.',
      },
    },
  },
  privacy: {
    badge: 'Protezione Dati e GDPR',
    title: 'Informativa sulla Privacy',
    subtitle:
      'Informazioni trasparenti su quali dati personali raccogliamo in ft_transcendence (Bomberman), come li proteggiamo e come puoi gestire il tuo account.',
    highlights: {
      encryptionTitle: 'Crittografia Argon2id',
      encryptionDesc:
        'Le password non vengono mai salvate in chiaro, ma protette tramite hash crittografico.',
      cookiesTitle: 'Cookie Strettamente Tecnici',
      cookiesDesc:
        'Utilizziamo solo cookie HttpOnly JWT per la sessione e localStorage per la lingua.',
      noAdsTitle: 'Nessun Tracciamento Commerciale',
      noAdsDesc:
        'I tuoi dati non vengono venduti né condivisi con reti pubblicitarie o terze parti.',
    },
    sections: {
      controller: {
        title: '1. Titolare e Finalità del Trattamento',
        content:
          'I dati personali raccolti in questa applicazione sono trattati esclusivamente dal team di sviluppo (ozamora-, brivera, enogueir e raperez-) al solo scopo di consentire l’autenticazione degli utenti, il matchmaking in tempo reale, la chat sociale e le statistiche di gioco nel progetto accademico ft_transcendence.',
      },
      dataCollected: {
        title: '2. Dati Raccolti',
        content:
          'Durante la registrazione e l’utilizzo della piattaforma, archiviamo nel nostro database PostgreSQL solo i dati strettamente necessari:',
        bullet1:
          'Dati dell’account: nome utente (username), indirizzo email e password cifrata con Argon2id.',
        bullet2:
          'Dati del profilo e attività: avatar caricato, lista amici, messaggi di chat, punteggio XP e cronologia delle partite.',
        bullet3:
          'Autenticazione esterna (Google OAuth 2.0): se accedi tramite Google, riceviamo solo l’identificativo e l’email di base per collegare il tuo profilo.',
      },
      cookies: {
        title: '3. Uso di Cookie e Archiviazione Locale',
        content:
          'Questa piattaforma non utilizza cookie pubblicitari né tracker di terze parti. Utilizziamo esclusivamente un cookie di sessione HttpOnly / SameSite con il tuo token JWT per proteggere l’accesso e il localStorage del browser per ricordare la lingua selezionata (IT / ES / EN).',
      },
      security: {
        title: '4. Misure di Sicurezza e Conservazione',
        content:
          'Tutte le comunicazioni tra browser e server sono cifrate tramite HTTPS e WSS. I dati vengono conservati esclusivamente per la durata dello sviluppo e della valutazione accademica presso 42 Madrid, dopodiché il database potrà essere eliminato.',
      },
      rights: {
        title: '5. Diritti dell’Utente',
        content:
          'Puoi consultare il tuo profilo, modificare il nome utente o sostituire l’avatar in qualsiasi momento dalla tua pagina profilo privata (/profile). Per richiedere la cancellazione completa dell’account e dei dati associati, contatta il team tramite il repository ufficiale del progetto.',
      },
    },
  },
};
