import { Link } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import {
  ShieldCheck,
  Scale,
  Lock,
  Cookie,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

interface PrivacySection {
  id: string;
  titleKey: string;
  defaultTitle: string;
  contentKey: string;
  defaultContent: string;
  bullets?: {
    key: string;
    fallback: string;
  }[];
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'controller',
    titleKey: 'legal.privacy.sections.controller.title',
    defaultTitle: '1. Data Controller and Purpose',
    contentKey: 'legal.privacy.sections.controller.content',
    defaultContent:
      'Personal data collected in this application is processed solely by the development team (ozamora-, brivera, enogueir, and raperez-) for the exclusive purpose of enabling user authentication, real-time multiplayer matchmaking, social chat, and match statistics within the ft_transcendence academic project.',
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
          'Account credentials: username, email address, and password hashed using Argon2id.',
      },
      {
        key: 'legal.privacy.sections.dataCollected.bullet2',
        fallback:
          'Profile & gameplay records: uploaded avatar image, friends list, chat messages, XP progression, and match history.',
      },
      {
        key: 'legal.privacy.sections.dataCollected.bullet3',
        fallback:
          'Third-party authentication (Google OAuth 2.0): if you sign in with Google, we only retrieve your basic account identifier and email to link your player profile.',
      },
    ],
  },
  {
    id: 'cookies',
    titleKey: 'legal.privacy.sections.cookies.title',
    defaultTitle: '3. Cookies and Local Storage',
    contentKey: 'legal.privacy.sections.cookies.content',
    defaultContent:
      'This platform uses no advertising cookies or third-party trackers. We strictly use an HttpOnly / SameSite session cookie containing your JWT token to keep your login secure, plus browser localStorage to persist your language preference (EN / ES / IT).',
  },
  {
    id: 'security',
    titleKey: 'legal.privacy.sections.security.title',
    defaultTitle: '4. Security Measures and Retention',
    contentKey: 'legal.privacy.sections.security.content',
    defaultContent:
      'All client-server traffic is encrypted over HTTPS and WSS. Data is retained strictly for the duration of the 42 Madrid academic development and peer-evaluation cycle, after which the database instance may be purged.',
  },
  {
    id: 'rights',
    titleKey: 'legal.privacy.sections.rights.title',
    defaultTitle: '5. User Rights and Control',
    contentKey: 'legal.privacy.sections.rights.content',
    defaultContent:
      'You may review your profile, update your username, or change your avatar at any time from your private profile page (/profile). To request full deletion of your account and associated records, please reach out to the team via our official project repository.',
  },
];

export function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="flex w-full justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <ShieldCheck className="size-3.5" />
            <span>{t('legal.privacy.badge') || 'Data Protection & GDPR'}</span>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {t('legal.privacy.title') ||
              t('app.general.privacyPolicy') ||
              'Privacy Policy'}
          </h1>

          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {t('legal.privacy.subtitle') ||
              'Transparent overview of what personal data we collect in ft_transcendence (Bomberman), how we secure it, and how you can manage your account.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-medium text-zinc-300">
              {t('legal.lastUpdated') || 'Last updated: November 2026'}
            </span>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-semibold text-orange-400 transition-colors hover:border-orange-500/40 hover:bg-zinc-800"
            >
              <Scale className="size-3.5" />
              <span>{t('app.general.termsOfService') || 'Terms of Service'}</span>
            </Link>
          </div>
        </section>

        {/* Key Privacy Highlights Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg backdrop-blur-sm">
            <div className="mb-2.5 flex items-center gap-2 text-orange-400">
              <Lock className="size-4 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('legal.privacy.highlights.encryptionTitle') ||
                  'Argon2id Encryption'}
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {t('legal.privacy.highlights.encryptionDesc') ||
                'Passwords are never stored in plain text; they are secured with salted cryptographic hashes.'}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg backdrop-blur-sm">
            <div className="mb-2.5 flex items-center gap-2 text-orange-400">
              <Cookie className="size-4 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('legal.privacy.highlights.cookiesTitle') ||
                  'Strictly Technical Cookies'}
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {t('legal.privacy.highlights.cookiesDesc') ||
                'We only use an HttpOnly JWT session cookie and local storage for your language setting.'}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg backdrop-blur-sm">
            <div className="mb-2.5 flex items-center gap-2 text-orange-400">
              <EyeOff className="size-4 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('legal.privacy.highlights.noAdsTitle') ||
                  'Zero Commercial Tracking'}
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {t('legal.privacy.highlights.noAdsDesc') ||
                'Your data is never sold, monetized, or shared with third-party ad networks.'}
            </p>
          </div>
        </section>

        {/* Privacy Clauses */}
        <div className="space-y-4">
          {PRIVACY_SECTIONS.map((section) => (
            <section
              key={section.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-lg backdrop-blur-sm transition-colors hover:border-zinc-700/80"
            >
              <h2 className="mb-2.5 text-lg font-bold text-white">
                {t(section.titleKey) || section.defaultTitle}
              </h2>
              <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                {t(section.contentKey) || section.defaultContent}
              </p>

              {section.bullets && (
                <ul className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.key}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                      <span>{t(bullet.key) || bullet.fallback}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}