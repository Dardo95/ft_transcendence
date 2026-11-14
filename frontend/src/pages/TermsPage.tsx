import { Link } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsSection {
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

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'scope',
    titleKey: 'legal.terms.sections.scope.title',
    defaultTitle: '1. Purpose and Academic Nature',
    contentKey: 'legal.terms.sections.scope.content',
    defaultContent:
      'This web application is a non-profit software engineering project created as part of the 42 Madrid curriculum by ozamora-, brivera, enogueir, and raperez-. The service is provided strictly for educational, technical portfolio, and recreational purposes.',
  },
  {
    id: 'account',
    titleKey: 'legal.terms.sections.account.title',
    defaultTitle: '2. Account Registration and Security',
    contentKey: 'legal.terms.sections.account.content',
    defaultContent:
      'Accessing the lobby, live chat, and multiplayer matches requires registering an account via email and password or Google OAuth 2.0. Users agree to provide accurate registration details and safeguard their account credentials.',
  },
  {
    id: 'conduct',
    titleKey: 'legal.terms.sections.conduct.title',
    defaultTitle: '3. Code of Conduct and Fair Play',
    contentKey: 'legal.terms.sections.conduct.content',
    defaultContent:
      'When joining multiplayer rooms or interacting in global and lobby chat channels, users agree to abide by the following rules:',
    bullets: [
      {
        key: 'legal.terms.sections.conduct.bullet1',
        fallback:
          'Do not post abusive, discriminatory, harassing, or spam content in any chat channel.',
      },
      {
        key: 'legal.terms.sections.conduct.bullet2',
        fallback:
          'Do not use unauthorized bots, automated scripts, or exploit WebSocket payloads to gain an unfair advantage.',
      },
      {
        key: 'legal.terms.sections.conduct.bullet3',
        fallback:
          'Do not impersonate other users or attempt to disrupt server stability and concurrent sessions.',
      },
    ],
  },
  {
    id: 'ip',
    titleKey: 'legal.terms.sections.ip.title',
    defaultTitle: '4. Intellectual Property and License',
    contentKey: 'legal.terms.sections.ip.content',
    defaultContent:
      'The source code of this application is authored by the development team and released under the MIT License for educational review and portfolio demonstration. Any recreational visual inspiration remains the property of its respective owners.',
  },
  {
    id: 'liability',
    titleKey: 'legal.terms.sections.liability.title',
    defaultTitle: '5. Availability and Limitation of Liability',
    contentKey: 'legal.terms.sections.liability.content',
    defaultContent:
      'Because this platform is an academic prototype, it is provided "as is" without warranties of continuous uptime or permanent retention of match histories and player statistics beyond the evaluation period.',
  },
];

export function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex w-full justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <Scale className="size-3.5" />
            <span>{t('legal.terms.badge') || 'Legal & Usage Terms'}</span>
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {t('legal.terms.title') ||
              t('app.general.termsOfService') ||
              'Terms and Conditions of Use'}
          </h1>

          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {t('legal.terms.subtitle') ||
              'Terms governing access to and use of the ft_transcendence (Bomberman) multiplayer platform, developed as an academic software project at 42 Madrid.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-medium text-zinc-300">
              {t('legal.lastUpdated') || 'Last updated: November 2026'}
            </span>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-semibold text-orange-400 transition-colors hover:border-orange-500/40 hover:bg-zinc-800"
            >
              <ShieldCheck className="size-3.5" />
              <span>{t('app.general.privacyPolicy') || 'Privacy Policy'}</span>
            </Link>
          </div>
        </section>

        {/* Terms Clauses */}
        <div className="space-y-4">
          {TERMS_SECTIONS.map((section) => (
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