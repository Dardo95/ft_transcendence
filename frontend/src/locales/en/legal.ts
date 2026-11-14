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
          'This web application is a non-profit software engineering project created as part of the 42 Madrid curriculum by ozamora-, brivera, enogueir, and raperez-. The service is provided strictly for educational, technical portfolio, and recreational purposes.',
      },
      account: {
        title: '2. Account Registration and Security',
        content:
          'Accessing the lobby, live chat, and multiplayer matches requires registering an account via email and password or Google OAuth 2.0. Users agree to provide accurate registration details and safeguard their account credentials.',
      },
      conduct: {
        title: '3. Code of Conduct and Fair Play',
        content:
          'When joining multiplayer rooms or interacting in global chat channels, users agree to abide by the following rules:',
        bullet1:
          'Do not post abusive, discriminatory, harassing, or spam content in any chat channel.',
        bullet2:
          'Do not use unauthorized bots, automated scripts, or exploit WebSocket payloads to gain an unfair advantage.',
        bullet3:
          'Do not impersonate other users or attempt to disrupt server stability and concurrent sessions.',
      },
      ip: {
        title: '4. Intellectual Property and License',
        content:
          'The source code of this application is authored by the development team and released under the MIT License for educational review and portfolio demonstration. Any recreational visual inspiration remains the property of its respective owners.',
      },
      liability: {
        title: '5. Availability and Limitation of Liability',
        content:
          'Because this platform is an academic prototype, it is provided "as is" without warranties of continuous uptime or permanent retention of match histories and player statistics beyond the evaluation period.',
      },
    },
  },
  privacy: {
    badge: 'Data Protection & GDPR',
    title: 'Privacy Policy',
    subtitle:
      'Transparent overview of what personal data we collect in ft_transcendence (Bomberman), how we secure it, and how you can manage your account.',
    highlights: {
      encryptionTitle: 'Argon2id Encryption',
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
          'Personal data collected in this application is processed solely by the development team (ozamora-, brivera, enogueir, and raperez-) for the exclusive purpose of enabling user authentication, real-time multiplayer matchmaking, social chat, and match statistics within the ft_transcendence academic project.',
      },
      dataCollected: {
        title: '2. Data We Collect',
        content:
          'When you register and play on the platform, we store only the minimum data required in our PostgreSQL database:',
        bullet1:
          'Account credentials: username, email address, and password hashed using Argon2id.',
        bullet2:
          'Profile & gameplay records: uploaded avatar image, friends list, chat messages, XP progression, and match history.',
        bullet3:
          'Third-party authentication (Google OAuth 2.0): if you sign in with Google, we only retrieve your basic account identifier and email to link your player profile.',
      },
      cookies: {
        title: '3. Cookies and Local Storage',
        content:
          'This platform uses no advertising cookies or third-party trackers. We strictly use an HttpOnly / SameSite session cookie containing your JWT token to keep your login secure, plus browser localStorage to persist your language preference (EN / ES / IT).',
      },
      security: {
        title: '4. Security Measures and Retention',
        content:
          'All client-server traffic is encrypted over HTTPS and WSS. Data is retained strictly for the duration of the 42 Madrid academic development and peer-evaluation cycle, after which the database instance may be purged.',
      },
      rights: {
        title: '5. User Rights and Control',
        content:
          'You may review your profile, update your username, or change your avatar at any time from your private profile page (/profile). To request full deletion of your account and associated records, please reach out to the team via our official project repository.',
      },
    },
  },
};
