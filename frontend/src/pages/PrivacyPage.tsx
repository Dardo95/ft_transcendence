import { Cookie, EyeOff, Lock, Scale, ShieldCheck } from 'lucide-react';
import { LegalPageLayout } from '@/features/legal/components/LegalPageLayout';
import type { LegalPageContent } from '@/features/legal/types';

const PRIVACY_PAGE: LegalPageContent = {
  badgeIcon: ShieldCheck,
  badgeKey: 'legal.privacy.badge',
  defaultBadge: 'Data Protection & GDPR',
  titleKey: 'legal.privacy.title',
  defaultTitle: 'Privacy Policy',
  subtitleKey: 'legal.privacy.subtitle',
  defaultSubtitle:
    'Transparent overview of what personal data we collect in ft_transcendence (Bomberman), how we secure it, and how you can manage your account.',
  crossLink: {
    to: '/terms',
    icon: Scale,
    labelKey: 'app.general.termsOfService',
    defaultLabel: 'Terms of Service',
  },
  highlights: [
    {
      icon: Lock,
      titleKey: 'legal.privacy.highlights.encryptionTitle',
      defaultTitle: 'Argon2id Password Hashing',
      descriptionKey: 'legal.privacy.highlights.encryptionDesc',
      defaultDescription:
        'Passwords are never stored in plain text; they are secured with salted cryptographic hashes.',
    },
    {
      icon: Cookie,
      titleKey: 'legal.privacy.highlights.cookiesTitle',
      defaultTitle: 'Strictly Technical Cookies',
      descriptionKey: 'legal.privacy.highlights.cookiesDesc',
      defaultDescription:
        'We only use an HttpOnly JWT session cookie and local storage for your language setting.',
    },
    {
      icon: EyeOff,
      titleKey: 'legal.privacy.highlights.noAdsTitle',
      defaultTitle: 'Zero Commercial Tracking',
      descriptionKey: 'legal.privacy.highlights.noAdsDesc',
      defaultDescription:
        'Your data is never sold, monetized, or shared with third-party ad networks.',
    },
  ],
  sections: [
    {
      id: 'controller',
      titleKey: 'legal.privacy.sections.controller.title',
      defaultTitle: '1. Data Controller and Purpose',
      contentKey: 'legal.privacy.sections.controller.content',
      defaultContent:
        'The data controller is the ft_transcendence development team (ozamora-, brivera, enogueir and raperez-), acting within the 42 Madrid curriculum. This is a non-commercial student project: it is not operated by, endorsed by, or affiliated with 42 or any other institution. Personal data is processed exclusively to provide authentication, real-time multiplayer matchmaking, chat, friends and match statistics.',
    },
    {
      id: 'data-collected',
      titleKey: 'legal.privacy.sections.dataCollected.title',
      defaultTitle: '2. Data We Collect',
      contentKey: 'legal.privacy.sections.dataCollected.content',
      defaultContent:
        'When you register and play on the platform, we store only the minimum data required in our PostgreSQL database:',
      bullets: [
        {
          key: 'legal.privacy.sections.dataCollected.bullet1',
          fallback:
            'Account credentials: username, email address and password hash produced with Argon2id. The plain password is never stored or logged.',
        },
        {
          key: 'legal.privacy.sections.dataCollected.bullet2',
          fallback:
            'Profile and gameplay records: uploaded avatar, friends list, chat messages, XP progression, wins/losses and match history.',
        },
        {
          key: 'legal.privacy.sections.dataCollected.bullet3',
          fallback:
            'Third-party authentication (Google OAuth 2.0): if you sign in with Google, we only retrieve your basic account identifier and email address to link your player profile.',
        },
        {
          key: 'legal.privacy.sections.dataCollected.bullet4',
          fallback:
            'Technical data: IP address, browser identification and session timestamps that may be recorded in server logs for security, abuse prevention and debugging.',
        },
      ],
    },
    {
      id: 'legal-basis',
      titleKey: 'legal.privacy.sections.legalBasis.title',
      defaultTitle: '3. Legal Basis for Processing',
      contentKey: 'legal.privacy.sections.legalBasis.content',
      defaultContent:
        'Processing relies on the performance of the service you request (account creation, gameplay and statistics), your consent when you enable optional features such as Google sign-in or an avatar, and our legitimate interest in keeping the platform secure and preventing abuse, in accordance with Article 6 of the GDPR. You may withdraw consent at any time by removing the related data or deleting your account.',
    },
    {
      id: 'cookies',
      titleKey: 'legal.privacy.sections.cookies.title',
      defaultTitle: '4. Cookies and Local Storage',
      contentKey: 'legal.privacy.sections.cookies.content',
      defaultContent:
        'This platform uses no advertising cookies and no third-party trackers. We strictly use an HttpOnly / SameSite session cookie containing your JWT token to keep your login secure, plus browser localStorage to persist your language preference (EN / ES / IT). Because these cookies are strictly necessary, no consent banner is displayed; you can still block or delete them in your browser, but the session cookie is required to stay logged in.',
    },
    {
      id: 'security',
      titleKey: 'legal.privacy.sections.security.title',
      defaultTitle: '5. Security Measures',
      contentKey: 'legal.privacy.sections.security.content',
      defaultContent:
        'Passwords are hashed with Argon2id and never stored or logged in plain text. Sessions use a signed JWT delivered in an HttpOnly, SameSite cookie, and all client-server traffic, including the WebSocket, is encrypted with HTTPS and WSS. Database access and container configuration are restricted to the development team, and credentials are kept in a gitignored .env file that is never committed to the repository.',
    },
    {
      id: 'retention',
      titleKey: 'legal.privacy.sections.retention.title',
      defaultTitle: '6. Data Retention',
      contentKey: 'legal.privacy.sections.retention.content',
      defaultContent:
        'Account data is kept while your account exists and for the duration of the academic development and peer-evaluation cycle. Chat messages and match history are retained while the account is active. Technical logs are kept for a short period for security purposes and then discarded. Once the evaluation ends, the database may be purged and personal data will be deleted or anonymised.',
    },
    {
      id: 'sharing',
      titleKey: 'legal.privacy.sections.sharing.title',
      defaultTitle: '7. Data Sharing and Third Parties',
      contentKey: 'legal.privacy.sections.sharing.content',
      defaultContent:
        'We do not sell, rent or share personal data with advertisers or data brokers, and the application includes no third-party analytics. Data is only exchanged with Google when you explicitly choose to sign in with OAuth 2.0, and with the infrastructure provider that hosts the containerised deployment, solely to run the service. By design, your public profile, online status and messages in public chat channels are visible to other logged-in users.',
    },
    {
      id: 'rights',
      titleKey: 'legal.privacy.sections.rights.title',
      defaultTitle: '8. Your Rights',
      contentKey: 'legal.privacy.sections.rights.content',
      defaultContent:
        'Under the GDPR you can exercise the following rights, free of charge, by contacting the team through the official project repository. We answer requests within one month:',
      bullets: [
        {
          key: 'legal.privacy.sections.rights.bullet1',
          fallback:
            'Access: obtain a copy of the personal data we hold about you.',
        },
        {
          key: 'legal.privacy.sections.rights.bullet2',
          fallback:
            'Rectification: correct inaccurate data directly from your profile page.',
        },
        {
          key: 'legal.privacy.sections.rights.bullet3',
          fallback:
            'Erasure: request deletion of your account and the records associated with it.',
        },
        {
          key: 'legal.privacy.sections.rights.bullet4',
          fallback:
            'Restriction and objection: ask us to limit or stop a specific processing activity.',
        },
        {
          key: 'legal.privacy.sections.rights.bullet5',
          fallback:
            'Portability: receive your data in a structured, machine-readable format.',
        },
        {
          key: 'legal.privacy.sections.rights.bullet6',
          fallback:
            'Complaint: lodge a complaint with your local supervisory authority (in Spain, the AEPD).',
        },
      ],
    },
    {
      id: 'children',
      titleKey: 'legal.privacy.sections.children.title',
      defaultTitle: '9. Children and Minimum Age',
      contentKey: 'legal.privacy.sections.children.content',
      defaultContent:
        'The service is not directed at children. You must be at least 14 years old, the minimum age of digital consent in Spain, to create an account. If we become aware that an account belongs to a younger child, we will delete the account and its personal data.',
    },
    {
      id: 'changes',
      titleKey: 'legal.privacy.sections.changes.title',
      defaultTitle: '10. Changes to This Policy',
      contentKey: 'legal.privacy.sections.changes.content',
      defaultContent:
        'We may update this policy when the features of the project change, for example when a new module introduces a new data source. The "last updated" date at the top of this page always reflects the current version, and material changes will be announced inside the application.',
    },
    {
      id: 'contact',
      titleKey: 'legal.privacy.sections.contact.title',
      defaultTitle: '11. Contact',
      contentKey: 'legal.privacy.sections.contact.content',
      defaultContent:
        'For any privacy question, data request or security report, contact the team through the issues section of the official ft_transcendence repository, or raise it during the peer-evaluation session. Please do not publish sensitive personal data in public issues.',
    },
  ],
};

export function PrivacyPage() {
  return <LegalPageLayout page={PRIVACY_PAGE} />;
}
