import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/locales/useLanguage';
import type { LegalPageContent, LegalSection } from '../types';

/**
 * Shared Tailwind tokens for the legal pages.
 * Keeping them in one place means the Privacy Policy and the Terms of Service
 * cannot drift apart visually.
 */
const PAGE = 'flex w-full justify-center px-4 py-8 md:py-12';
const PAGE_INNER = 'w-full max-w-5xl space-y-8';

const CARD =
  'rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-lg backdrop-blur-sm';
const HEADER_CARD = `${CARD} p-6 text-center shadow-xl sm:p-8`;
const SECTION_CARD = `${CARD} p-6 transition-colors hover:border-zinc-700/80`;
const HIGHLIGHT_CARD = `${CARD} p-5`;

const BADGE =
  'mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-400 uppercase';
const PAGE_TITLE =
  'mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl';
const PAGE_SUBTITLE =
  'mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm';
const META_ROW =
  'mt-5 flex flex-wrap items-center justify-center gap-3 text-xs';
const META_PILL =
  'rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-medium text-zinc-300';
const META_LINK =
  'inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-semibold text-orange-400 transition-colors hover:border-orange-500/40 hover:bg-zinc-800';

const SECTION_TITLE = 'mb-2.5 text-lg font-bold text-white';
const SECTION_TEXT = 'text-xs leading-relaxed text-zinc-300 sm:text-sm';
const BULLET_LIST = 'mt-4 space-y-2 border-t border-zinc-800/80 pt-4';
const BULLET_ITEM =
  'flex items-start gap-2.5 text-xs leading-relaxed text-zinc-300 sm:text-sm';
const BULLET_ICON = 'mt-0.5 size-4 shrink-0 text-orange-400';

const HIGHLIGHT_HEADER = 'mb-2.5 flex items-center gap-2 text-orange-400';
const HIGHLIGHT_TITLE = 'text-xs font-bold tracking-wider text-white uppercase';

function LegalSectionCard({ section }: { section: LegalSection }) {
  const { t } = useLanguage();

  return (
    <section className={SECTION_CARD}>
      <h2 className={SECTION_TITLE}>
        {t(section.titleKey) || section.defaultTitle}
      </h2>
      <p className={SECTION_TEXT}>
        {t(section.contentKey) || section.defaultContent}
      </p>

      {section.bullets && section.bullets.length > 0 && (
        <ul className={BULLET_LIST}>
          {section.bullets.map((bullet) => (
            <li key={bullet.key} className={BULLET_ITEM}>
              <CheckCircle2 className={BULLET_ICON} />
              <span>{t(bullet.key) || bullet.fallback}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LegalPageLayout({ page }: { page: LegalPageContent }) {
  const { t } = useLanguage();
  const BadgeIcon = page.badgeIcon;
  const CrossLinkIcon = page.crossLink.icon;

  return (
    <div className={PAGE}>
      <div className={PAGE_INNER}>
        <header className={HEADER_CARD}>
          <div className={BADGE}>
            <BadgeIcon className="size-3.5" />
            <span>{t(page.badgeKey) || page.defaultBadge}</span>
          </div>

          <h1 className={PAGE_TITLE}>
            {t(page.titleKey) || page.defaultTitle}
          </h1>

          <p className={PAGE_SUBTITLE}>
            {t(page.subtitleKey) || page.defaultSubtitle}
          </p>

          <div className={META_ROW}>
            <span className={META_PILL}>
              {t('legal.lastUpdated') || 'Last updated: November 2026'}
            </span>
            <Link to={page.crossLink.to} className={META_LINK}>
              <CrossLinkIcon className="size-3.5" />
              <span>
                {t(page.crossLink.labelKey) || page.crossLink.defaultLabel}
              </span>
            </Link>
          </div>
        </header>

        {page.highlights && page.highlights.length > 0 && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {page.highlights.map((highlight) => {
              const HighlightIcon = highlight.icon;

              return (
                <div key={highlight.titleKey} className={HIGHLIGHT_CARD}>
                  <div className={HIGHLIGHT_HEADER}>
                    <HighlightIcon className="size-4 shrink-0" />
                    <h2 className={HIGHLIGHT_TITLE}>
                      {t(highlight.titleKey) || highlight.defaultTitle}
                    </h2>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {t(highlight.descriptionKey) ||
                      highlight.defaultDescription}
                  </p>
                </div>
              );
            })}
          </section>
        )}

        <div className="space-y-4">
          {page.sections.map((section) => (
            <LegalSectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
