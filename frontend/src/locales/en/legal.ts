/**
 * English legal translations (Terms of Service & Privacy Policy).
 * Category: Translation Resource
 */
export const legalEn = {
  lastUpdated: 'Last updated: November 2026',
  terms: {
    badge: 'Legal & Usage Terms',
    title: 'Terms and Conditions of Use',
    subtitle:
      'Terms governing access to and use of the ft_transcendence (Bomberman) multiplayer platform, developed as an academic software project at 42 Madrid.',
    sections: {
      scope: {
        title: '1. Purpose and Academic Nature',
        content:
          'This web application is a non-profit software engineering project created as part of the 42 Madrid curriculum by ozamora-, brivera, enogueir and raperez-. It is an independent student work: it is not operated by, endorsed by, or affiliated with 42, Fundación Telefónica or any other institution. The service is provided strictly for educational, technical portfolio and recreational purposes. By creating an account or using the platform you accept these terms; if you do not agree, please do not use the service.',
      },
      eligibility: {
        title: '2. Eligibility',
        content:
          'You must be at least 14 years old and have the legal capacity to accept these terms. Accounts are personal: one account per person, and accounts may not be sold, shared or transferred to anyone else.',
      },
      account: {
        title: '3. Account Registration and Security',
        content:
          'Accessing the lobby, live chat and multiplayer matches requires registering an account with an email address and password or with Google OAuth 2.0. You agree to provide accurate registration details, to keep your credentials confidential, and to remain responsible for all activity performed with your account. If you suspect unauthorised access, change your password and contact the team. We may suspend or delete accounts that breach these terms.',
      },
      conduct: {
        title: '4. Acceptable Use and Code of Conduct',
        content:
          'When joining multiplayer rooms or interacting in global chat channels, users agree to abide by the following rules:',
        bullet1:
          'Do not post abusive, discriminatory, harassing or spam content in any chat channel.',
        bullet2:
          'Do not use unauthorised bots, automated scripts or exploit WebSocket payloads and the game protocol to gain an unfair advantage.',
        bullet3:
          'Do not impersonate other users or attempt to disrupt server stability and concurrent sessions.',
        bullet4:
          'Do not attempt to access other users’ accounts or data, or the database, without authorisation.',
        bullet5:
          'Do not publish illegal content or content that infringes third-party rights.',
        bullet6:
          'Do not distribute malware, phishing links or unsolicited advertising.',
      },
      content: {
        title: '5. User-Generated Content',
        content:
          'You keep ownership of the messages and avatars you publish. By posting them you grant the project a non-exclusive, royalty-free licence to store, display and transmit them as needed to operate chat and profiles. Public chat is visible to other users and must not be treated as private. We may remove content that breaks these terms and keep a record of moderation actions.',
      },
      fairPlay: {
        title: '6. Fair Play and Game Integrity',
        content:
          'Gameplay is validated by the server: the client only sends inputs, while the server owns collisions, bombs, ticks and results. Manipulating the client, forging events, exploiting bugs to win or teaming up to distort ranked results is prohibited. Matches obtained through cheating may be invalidated and the account suspended.',
      },
      ip: {
        title: '7. Intellectual Property and License',
        content:
          'The source code of this application is authored by the development team and published for educational review and portfolio demonstration. Unless a separate licence file is included in the repository, all rights remain with the authors. The 42 name and any third-party trademarks, sprites or visual references remain the property of their respective owners and are used here only for educational demonstration.',
      },
      availability: {
        title: '8. Availability, Changes and Termination',
        content:
          'This platform is an academic prototype provided "as is". We may change, interrupt or discontinue features, matches or the entire service for maintenance, evaluation or at the end of the project, without prior notice and without liability. We may suspend or terminate accounts that breach these terms, and you may stop using the service and request deletion at any time.',
      },
      liability: {
        title: '9. Disclaimer of Warranties and Limitation of Liability',
        content:
          'To the maximum extent permitted by law, the team is not liable for indirect or consequential damages, loss of data, or interruptions arising from the use of this prototype. Nothing in these terms excludes liability that cannot be excluded by law, nor the rights granted to you by consumer protection rules.',
      },
      law: {
        title: '10. Governing Law and Disputes',
        content:
          'These terms are governed by Spanish law. Any dispute will be submitted to the competent courts of Madrid, without prejudice to the rights that consumer protection rules grant you.',
      },
      changes: {
        title: '11. Changes to These Terms',
        content:
          'We may update these terms when the project evolves. The "last updated" date at the top of this page shows the current version, and continuing to use the service after a change means you accept the revised terms.',
      },
      contact: {
        title: '12. Contact',
        content:
          'Questions about these terms can be sent to the team through the issues section of the official ft_transcendence repository, or raised during the peer-evaluation session.',
      },
    },
  },
  privacy: {
    badge: 'Data Protection & GDPR',
    title: 'Privacy Policy',
    subtitle:
      'Transparent overview of what personal data we collect in ft_transcendence (Bomberman), how we secure it, and how you can manage your account.',
    highlights: {
      encryptionTitle: 'Argon2id Password Hashing',
      encryptionDesc:
        'Passwords are never stored in plain text; they are secured with salted cryptographic hashes.',
      cookiesTitle: 'Strictly Technical Cookies',
      cookiesDesc:
        'We only use an HttpOnly JWT session cookie and local storage for your language setting.',
      noAdsTitle: 'Zero Commercial Tracking',
      noAdsDesc:
        'Your data is never sold, monetized, or shared with third-party ad networks.',
    },
    sections: {
      controller: {
        title: '1. Data Controller and Purpose',
        content:
          'The data controller is the ft_transcendence development team (ozamora-, brivera, enogueir and raperez-), acting within the 42 Madrid curriculum. This is a non-commercial student project: it is not operated by, endorsed by, or affiliated with 42 or any other institution. Personal data is processed exclusively to provide authentication, real-time multiplayer matchmaking, chat, friends and match statistics.',
      },
      dataCollected: {
        title: '2. Data We Collect',
        content:
          'When you register and play on the platform, we store only the minimum data required in our PostgreSQL database:',
        bullet1:
          'Account credentials: username, email address and password hash produced with Argon2id. The plain password is never stored or logged.',
        bullet2:
          'Profile and gameplay records: uploaded avatar, friends list, chat messages, XP progression, wins/losses and match history.',
        bullet3:
          'Third-party authentication (Google OAuth 2.0): if you sign in with Google, we only retrieve your basic account identifier and email address to link your player profile.',
        bullet4:
          'Technical data: IP address, browser identification and session timestamps that may be recorded in server logs for security, abuse prevention and debugging.',
      },
      legalBasis: {
        title: '3. Legal Basis for Processing',
        content:
          'Processing relies on the performance of the service you request (account creation, gameplay and statistics), your consent when you enable optional features such as Google sign-in or an avatar, and our legitimate interest in keeping the platform secure and preventing abuse, in accordance with Article 6 of the GDPR. You may withdraw consent at any time by removing the related data or deleting your account.',
      },
      cookies: {
        title: '4. Cookies and Local Storage',
        content:
          'This platform uses no advertising cookies and no third-party trackers. We strictly use an HttpOnly / SameSite session cookie containing your JWT token to keep your login secure, plus browser localStorage to persist your language preference (EN / ES / IT). Because these cookies are strictly necessary, no consent banner is displayed; you can still block or delete them in your browser, but the session cookie is required to stay logged in.',
      },
      security: {
        title: '5. Security Measures',
        content:
          'Passwords are hashed with Argon2id and never stored or logged in plain text. Sessions use a signed JWT delivered in an HttpOnly, SameSite cookie, and all client-server traffic, including the WebSocket, is encrypted with HTTPS and WSS. Database access and container configuration are restricted to the development team, and credentials are kept in a gitignored .env file that is never committed to the repository.',
      },
      retention: {
        title: '6. Data Retention',
        content:
          'Account data is kept while your account exists and for the duration of the academic development and peer-evaluation cycle. Chat messages and match history are retained while the account is active. Technical logs are kept for a short period for security purposes and then discarded. Once the evaluation ends, the database may be purged and personal data will be deleted or anonymised.',
      },
      sharing: {
        title: '7. Data Sharing and Third Parties',
        content:
          'We do not sell, rent or share personal data with advertisers or data brokers, and the application includes no third-party analytics. Data is only exchanged with Google when you explicitly choose to sign in with OAuth 2.0, and with the infrastructure provider that hosts the containerised deployment, solely to run the service. By design, your public profile, online status and messages in public chat channels are visible to other logged-in users.',
      },
      rights: {
        title: '8. Your Rights',
        content:
          'Under the GDPR you can exercise the following rights, free of charge, by contacting the team through the official project repository. We answer requests within one month:',
        bullet1:
          'Access: obtain a copy of the personal data we hold about you.',
        bullet2:
          'Rectification: correct inaccurate data directly from your profile page.',
        bullet3:
          'Erasure: request deletion of your account and the records associated with it.',
        bullet4:
          'Restriction and objection: ask us to limit or stop a specific processing activity.',
        bullet5:
          'Portability: receive your data in a structured, machine-readable format.',
        bullet6:
          'Complaint: lodge a complaint with your local supervisory authority (in Spain, the AEPD).',
      },
      children: {
        title: '9. Children and Minimum Age',
        content:
          'The service is not directed at children. You must be at least 14 years old, the minimum age of digital consent in Spain, to create an account. If we become aware that an account belongs to a younger child, we will delete the account and its personal data.',
      },
      changes: {
        title: '10. Changes to This Policy',
        content:
          'We may update this policy when the features of the project change, for example when a new module introduces a new data source. The "last updated" date at the top of this page always reflects the current version, and material changes will be announced inside the application.',
      },
      contact: {
        title: '11. Contact',
        content:
          'For any privacy question, data request or security report, contact the team through the issues section of the official ft_transcendence repository, or raise it during the peer-evaluation session. Please do not publish sensitive personal data in public issues.',
      },
    },
  },
};
