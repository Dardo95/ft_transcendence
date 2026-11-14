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
          'Questa applicazione web è un progetto di ingegneria del software senza scopo di lucro realizzato nell’ambito del curriculum di 42 Madrid da ozamora-, brivera, enogueir e raperez-. È un lavoro studentesco indipendente: non è gestito, approvato né affiliato a 42, alla Fundación Telefónica o a qualsiasi altra istituzione. Il servizio è fornito esclusivamente a fini educativi, dimostrativi e ricreativi. Creando un account o utilizzando la piattaforma accetti questi termini; se non sei d’accordo, non utilizzare il servizio.',
      },
      eligibility: {
        title: '2. Requisiti di Accesso',
        content:
          'Devi avere almeno 14 anni e la capacità giuridica di accettare questi termini. Gli account sono personali: un account per persona, e non possono essere venduti, condivisi o trasferiti a terzi.',
      },
      account: {
        title: '3. Registrazione e Sicurezza dell’Account',
        content:
          'Per accedere alla lobby, alla chat e alle partite multigiocatore è necessario creare un account tramite email e password oppure autenticazione OAuth 2.0 (Google). L’utente si impegna a fornire dati veritieri, a custodire le proprie credenziali e a rispondere di ogni attività svolta con il proprio account. Se sospetti un accesso non autorizzato, cambia la password e contatta il team. Possiamo sospendere o eliminare gli account che violano questi termini.',
      },
      conduct: {
        title: '4. Uso Accettabile e Regole di Condotta',
        content:
          'Partecipando alle stanze multigiocatore o utilizzando i canali di chat globale, l’utente accetta di rispettare le seguenti regole:',
        bullet1:
          'Non pubblicare contenuti offensivi, discriminatori, diffamatori o spam nei canali di chat.',
        bullet2:
          'Non utilizzare bot esterni, script automatizzati né sfruttare i messaggi WebSocket o il protocollo di gioco per ottenere vantaggi.',
        bullet3:
          'Non impersonare altri giocatori né compromettere la stabilità del server o le altre sessioni.',
        bullet4:
          'Non tentare di accedere senza autorizzazione agli account o ai dati di altri utenti né al database.',
        bullet5:
          'Non pubblicare contenuti illegali o che violano i diritti di terzi.',
        bullet6:
          'Non distribuire malware, link di phishing o pubblicità non richiesta.',
      },
      content: {
        title: '5. Contenuti Generati dall’Utente',
        content:
          'Mantieni la proprietà dei messaggi e degli avatar che pubblichi. Pubblicandoli concedi al progetto una licenza non esclusiva e gratuita per archiviarli, mostrarli e trasmetterli secondo necessità per gestire chat e profili. La chat pubblica è visibile agli altri utenti e non deve essere considerata privata. Possiamo rimuovere contenuti che violano questi termini e conservare un registro delle azioni di moderazione.',
      },
      fairPlay: {
        title: '6. Fair Play e Integrità della Partita',
        content:
          'Il gameplay è validato dal server: il client invia solo gli input, mentre il server gestisce collisioni, bombe, tick e risultati. È vietato manipolare il client, falsificare eventi, sfruttare bug per vincere o allearsi per alterare i risultati classificati. Le partite ottenute con trucchi possono essere invalidate e l’account sospeso.',
      },
      ip: {
        title: '7. Proprietà Intellettuale e Licenza',
        content:
          'Il codice sorgente di questa applicazione è stato sviluppato dal team autore ed è pubblicato a scopo di revisione accademica e dimostrazione di portfolio. Salvo che il repository includa un file di licenza separato, tutti i diritti restano agli autori. Il nome 42 e qualsiasi marchio, sprite o riferimento visivo di terzi appartengono ai rispettivi proprietari e sono usati qui solo a fini dimostrativi ed educativi.',
      },
      availability: {
        title: '8. Disponibilità, Modifiche e Chiusura',
        content:
          'Questa piattaforma è un prototipo accademico fornito "così com’è" (as is). Possiamo modificare, interrompere o disattivare funzionalità, partite o l’intero servizio per manutenzione, valutazione o al termine del progetto, senza preavviso e senza responsabilità. Possiamo sospendere o chiudere gli account che violano questi termini, e tu puoi smettere di usare il servizio e richiedere la cancellazione in qualsiasi momento.',
      },
      liability: {
        title: '9. Esclusione di Garanzie e Limitazione di Responsabilità',
        content:
          'Nella misura massima consentita dalla legge, il team non risponde di danni indiretti o consequenziali, perdita di dati o interruzioni derivanti dall’uso di questo prototipo. Nessuna clausola esclude la responsabilità che la legge non consente di escludere né i diritti riconosciuti dalla normativa a tutela dei consumatori.',
      },
      law: {
        title: '10. Legge Applicabile e Controversie',
        content:
          'Questi termini sono regolati dalla legge spagnola. Qualsiasi controversia sarà sottoposta ai tribunali competenti di Madrid, fatti salvi i diritti riconosciuti dalla normativa a tutela dei consumatori.',
      },
      changes: {
        title: '11. Modifiche ai Termini',
        content:
          'Possiamo aggiornare questi termini quando il progetto evolve. La data di "ultimo aggiornamento" in cima alla pagina mostra la versione attuale, e continuare a usare il servizio dopo una modifica implica l’accettazione dei termini aggiornati.',
      },
      contact: {
        title: '12. Contatti',
        content:
          'Le domande su questi termini possono essere inviate al team tramite la sezione issues del repository ufficiale di ft_transcendence, oppure poste durante la sessione di valutazione tra pari.',
      },
    },
  },
  privacy: {
    badge: 'Protezione Dati e GDPR',
    title: 'Informativa sulla Privacy',
    subtitle:
      'Informazioni trasparenti su quali dati personali raccogliamo in ft_transcendence (Bomberman), come li proteggiamo e come puoi gestire il tuo account.',
    highlights: {
      encryptionTitle: 'Hash delle Password con Argon2id',
      encryptionDesc:
        'Le password non vengono mai salvate in chiaro, ma protette tramite hash crittografico con salt.',
      cookiesTitle: 'Cookie Strettamente Tecnici',
      cookiesDesc:
        'Utilizziamo solo un cookie di sessione HttpOnly con JWT e localStorage per la lingua.',
      noAdsTitle: 'Nessun Tracciamento Commerciale',
      noAdsDesc:
        'I tuoi dati non vengono venduti né condivisi con reti pubblicitarie o terze parti.',
    },
    sections: {
      controller: {
        title: '1. Titolare e Finalità del Trattamento',
        content:
          'Il titolare del trattamento è il team di sviluppo di ft_transcendence (ozamora-, brivera, enogueir e raperez-), nell’ambito del curriculum di 42 Madrid. È un progetto studentesco senza scopo di lucro: non è gestito, approvato né affiliato a 42 o a qualsiasi altra istituzione. I dati personali sono trattati esclusivamente per fornire autenticazione, matchmaking multigiocatore in tempo reale, chat, amicizie e statistiche delle partite.',
      },
      dataCollected: {
        title: '2. Dati Raccolti',
        content:
          'Durante la registrazione e l’utilizzo della piattaforma, archiviamo nel nostro database PostgreSQL solo i dati strettamente necessari:',
        bullet1:
          'Dati dell’account: nome utente, indirizzo email e hash della password generato con Argon2id. La password in chiaro non viene mai salvata né registrata nei log.',
        bullet2:
          'Dati del profilo e attività: avatar caricato, lista amici, messaggi di chat, progressione XP, vittorie/sconfitte e cronologia delle partite.',
        bullet3:
          'Autenticazione esterna (Google OAuth 2.0): se accedi tramite Google, riceviamo solo l’identificativo di base e l’email per collegare il tuo profilo.',
        bullet4:
          'Dati tecnici: indirizzo IP, identificazione del browser e timestamp di sessione che possono essere registrati nei log del server, per sicurezza, prevenzione degli abusi e debug.',
      },
      legalBasis: {
        title: '3. Base Giuridica del Trattamento',
        content:
          'Il trattamento si basa sull’esecuzione del servizio richiesto (creazione dell’account, partite e statistiche), sul tuo consenso quando attivi funzioni opzionali come l’accesso con Google o l’avatar, e sul nostro legittimo interesse a mantenere la piattaforma sicura e a prevenire abusi, ai sensi dell’articolo 6 del GDPR. Puoi revocare il consenso in qualsiasi momento rimuovendo i dati interessati o eliminando l’account.',
      },
      cookies: {
        title: '4. Uso di Cookie e Archiviazione Locale',
        content:
          'Questa piattaforma non utilizza cookie pubblicitari né tracker di terze parti. Utilizziamo esclusivamente un cookie di sessione HttpOnly / SameSite con il tuo token JWT per proteggere l’accesso, oltre al localStorage del browser per ricordare la lingua selezionata (IT / ES / EN). Poiché questi cookie sono strettamente necessari, non viene mostrato alcun banner di consenso; puoi comunque bloccarli o eliminarli dal browser, ma il cookie di sessione è indispensabile per restare connesso.',
      },
      security: {
        title: '5. Misure di Sicurezza',
        content:
          'Le password sono protette con Argon2id e non vengono mai salvate né registrate in chiaro. La sessione usa un JWT firmato in un cookie HttpOnly e SameSite, e tutte le comunicazioni tra client e server, incluso il WebSocket, sono cifrate con HTTPS e WSS. L’accesso al database e alla configurazione dei container è riservato al team, e le credenziali sono conservate in un file .env ignorato da Git che non viene mai pubblicato nel repository.',
      },
      retention: {
        title: '6. Conservazione dei Dati',
        content:
          'I dati dell’account sono conservati finché l’account esiste e per la durata del ciclo di sviluppo e valutazione accademica. I messaggi di chat e la cronologia delle partite sono mantenuti finché l’account è attivo. I log tecnici sono conservati per un breve periodo per motivi di sicurezza e poi eliminati. Al termine della valutazione il database potrà essere cancellato e i dati personali saranno eliminati o anonimizzati.',
      },
      sharing: {
        title: '7. Condivisione dei Dati e Terze Parti',
        content:
          'Non vendiamo, affittiamo né condividiamo dati personali con inserzionisti o intermediari di dati, e l’applicazione non include analytics di terze parti. I dati vengono scambiati solo con Google quando scegli esplicitamente di accedere con OAuth 2.0, e con il provider di infrastruttura che ospita il deployment in container, esclusivamente per erogare il servizio. Per progettazione, il tuo profilo pubblico, lo stato online e i messaggi nei canali pubblici sono visibili agli altri utenti connessi.',
      },
      rights: {
        title: '8. I Tuoi Diritti',
        content:
          'Ai sensi del GDPR puoi esercitare i seguenti diritti, gratuitamente, contattando il team tramite il repository ufficiale del progetto. Rispondiamo alle richieste entro un mese:',
        bullet1:
          'Accesso: ottenere una copia dei dati personali che conserviamo su di te.',
        bullet2:
          'Rettifica: correggere dati inesatti direttamente dalla pagina del profilo.',
        bullet3:
          'Cancellazione: richiedere l’eliminazione dell’account e dei registri associati.',
        bullet4:
          'Limitazione e opposizione: chiedere di limitare o interrompere un trattamento specifico.',
        bullet5:
          'Portabilità: ricevere i tuoi dati in un formato strutturato e leggibile da una macchina.',
        bullet6:
          'Reclamo: presentare un reclamo all’autorità di controllo competente (in Spagna, l’AEPD).',
      },
      children: {
        title: '9. Minori ed Età Minima',
        content:
          'Il servizio non è rivolto ai minori. Devi avere almeno 14 anni, l’età minima per il consenso digitale in Spagna, per creare un account. Se veniamo a conoscenza che un account appartiene a un minore di tale età, elimineremo l’account e i relativi dati personali.',
      },
      changes: {
        title: '10. Modifiche alla Presente Informativa',
        content:
          'Possiamo aggiornare questa informativa quando cambiano le funzionalità del progetto, ad esempio se un nuovo modulo introduce una nuova fonte di dati. La data di "ultimo aggiornamento" in cima alla pagina riflette sempre la versione attuale, e le modifiche rilevanti saranno annunciate all’interno dell’applicazione.',
      },
      contact: {
        title: '11. Contatti',
        content:
          'Per qualsiasi domanda sulla privacy, richiesta sui dati o segnalazione di sicurezza, contatta il team tramite la sezione issues del repository ufficiale di ft_transcendence o segnalalo durante la sessione di valutazione tra pari. Non pubblicare dati personali sensibili nelle issue pubbliche.',
      },
    },
  },
};
