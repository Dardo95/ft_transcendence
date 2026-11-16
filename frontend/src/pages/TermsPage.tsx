import { Scale, ShieldCheck } from 'lucide-react';
import { LegalPageLayout } from '@/features/legal/components/LegalPageLayout';
import type { LegalPageContent } from '@/features/legal/types';

const TERMS_PAGE: LegalPageContent = {
  badgeIcon: Scale,
  badgeKey: 'legal.terms.badge',
  defaultBadge: 'Legal & Usage Terms',
  titleKey: 'legal.terms.title',
  defaultTitle: 'Terms and Conditions of Use',
  subtitleKey: 'legal.terms.subtitle',
  defaultSubtitle:
    'Terms governing access to and use of the ft_transcendence (Bomberman) multiplayer platform, developed as an academic software project at 42 Madrid.',
  crossLink: {
    to: '/privacy',
    icon: ShieldCheck,
    labelKey: 'app.general.privacyPolicy',
    defaultLabel: 'Privacy Policy',
  },
  sections: [
    {
      id: 'scope',
      titleKey: 'legal.terms.sections.scope.title',
      defaultTitle: '1. Purpose and Academic Nature',
      contentKey: 'legal.terms.sections.scope.content',
      defaultContent:
        'This web application is a non-profit software engineering project created as part of the 42 Madrid curriculum by ozamora-, brivera, enogueir and raperez-. It is an independent student work: it is not operated by, endorsed by, or affiliated with 42, Fundación Telefónica or any other institution. The service is provided strictly for educational, technical portfolio and recreational purposes. By creating an account or using the platform you accept these terms; if you do not agree, please do not use the service.',
    },
    {
      id: 'eligibility',
      titleKey: 'legal.terms.sections.eligibility.title',
      defaultTitle: '2. Eligibility',
      contentKey: 'legal.terms.sections.eligibility.content',
      defaultContent:
        'You must be at least 14 years old and have the legal capacity to accept these terms. Accounts are personal: one account per person, and accounts may not be sold, shared or transferred to anyone else.',
    },
    {
      id: 'account',
      titleKey: 'legal.terms.sections.account.title',
      defaultTitle: '3. Account Registration and Security',
      contentKey: 'legal.terms.sections.account.content',
      defaultContent:
        'Accessing the lobby, live chat and multiplayer matches requires registering an account with an email address and password or with Google OAuth 2.0. You agree to provide accurate registration details, to keep your credentials confidential, and to remain responsible for all activity performed with your account. If you suspect unauthorised access, change your password and contact the team. We may suspend or delete accounts that breach these terms.',
    },
    {
      id: 'conduct',
      titleKey: 'legal.terms.sections.conduct.title',
      defaultTitle: '4. Acceptable Use and Code of Conduct',
      contentKey: 'legal.terms.sections.conduct.content',
      defaultContent:
        'When joining multiplayer rooms or interacting in global and lobby chat channels, users agree to abide by the following rules:',
      bullets: [
        {
          key: 'legal.terms.sections.conduct.bullet1',
          fallback:
            'Do not post abusive, discriminatory, harassing or spam content in any chat channel.',
        },
        {
          key: 'legal.terms.sections.conduct.bullet2',
          fallback:
            'Do not use unauthorised bots, automated scripts or exploit WebSocket payloads and the game protocol to gain an unfair advantage.',
        },
        {
          key: 'legal.terms.sections.conduct.bullet3',
          fallback:
            'Do not impersonate other users or attempt to disrupt server stability and concurrent sessions.',
        },
        {
          key: 'legal.terms.sections.conduct.bullet4',
          fallback:
            'Do not attempt to access other users’ accounts or data, or the database, without authorisation.',
        },
        {
          key: 'legal.terms.sections.conduct.bullet5',
          fallback:
            'Do not publish illegal content or content that infringes third-party rights.',
        },
        {
          key: 'legal.terms.sections.conduct.bullet6',
          fallback:
            'Do not distribute malware, phishing links or unsolicited advertising.',
        },
      ],
    },
    {
      id: 'content',
      titleKey: 'legal.terms.sections.content.title',
      defaultTitle: '5. User-Generated Content',
      contentKey: 'legal.terms.sections.content.content',
      defaultContent:
        'You keep ownership of the messages and avatars you publish. By posting them you grant the project a non-exclusive, royalty-free licence to store, display and transmit them as needed to operate chat and profiles. Public chat is visible to other users and must not be treated as private. We may remove content that breaks these terms and keep a record of moderation actions.',
    },
    {
      id: 'fair-play',
      titleKey: 'legal.terms.sections.fairPlay.title',
      defaultTitle: '6. Fair Play and Game Integrity',
      contentKey: 'legal.terms.sections.fairPlay.content',
      defaultContent:
        'Gameplay is validated by the server: the client only sends inputs, while the server owns collisions, bombs, ticks and results. Manipulating the client, forging events, exploiting bugs to win or teaming up to distort ranked results is prohibited. Matches obtained through cheating may be invalidated and the account suspended.',
    },
    {
      id: 'ip',
      titleKey: 'legal.terms.sections.ip.title',
      defaultTitle: '7. Intellectual Property and License',
      contentKey: 'legal.terms.sections.ip.content',
      defaultContent:
        'The source code of this application is authored by the development team and published for educational review and portfolio demonstration. Unless a separate licence file is included in the repository, all rights remain with the authors. The 42 name and any third-party trademarks, sprites or visual references remain the property of their respective owners and are used here only for educational demonstration.',
    },
    {
      id: 'availability',
      titleKey: 'legal.terms.sections.availability.title',
      defaultTitle: '8. Availability, Changes and Termination',
      contentKey: 'legal.terms.sections.availability.content',
      defaultContent:
        'This platform is an academic prototype provided "as is". We may change, interrupt or discontinue features, matches or the entire service for maintenance, evaluation or at the end of the project, without prior notice and without liability. We may suspend or terminate accounts that breach these terms, and you may stop using the service and request deletion at any time.',
    },
    {
      id: 'liability',
      titleKey: 'legal.terms.sections.liability.title',
      defaultTitle: '9. Disclaimer of Warranties and Limitation of Liability',
      contentKey: 'legal.terms.sections.liability.content',
      defaultContent:
        'To the maximum extent permitted by law, the team is not liable for indirect or consequential damages, loss of data, or interruptions arising from the use of this prototype. Nothing in these terms excludes liability that cannot be excluded by law, nor the rights granted to you by consumer protection rules.',
    },
    {
      id: 'law',
      titleKey: 'legal.terms.sections.law.title',
      defaultTitle: '10. Governing Law and Disputes',
      contentKey: 'legal.terms.sections.law.content',
      defaultContent:
        'These terms are governed by Spanish law. Any dispute will be submitted to the competent courts of Madrid, without prejudice to the rights that consumer protection rules grant you.',
    },
    {
      id: 'changes',
      titleKey: 'legal.terms.sections.changes.title',
      defaultTitle: '11. Changes to These Terms',
      contentKey: 'legal.terms.sections.changes.content',
      defaultContent:
        'We may update these terms when the project evolves. The "last updated" date at the top of this page shows the current version, and continuing to use the service after a change means you accept the revised terms.',
    },
    {
      id: 'contact',
      titleKey: 'legal.terms.sections.contact.title',
      defaultTitle: '12. Contact',
      contentKey: 'legal.terms.sections.contact.content',
      defaultContent:
        'Questions about these terms can be sent to the team through the issues section of the official ft_transcendence repository, or raised during the peer-evaluation session.',
    },
  ],
};

export function TermsPage() {
  return <LegalPageLayout page={TERMS_PAGE} />;
}
