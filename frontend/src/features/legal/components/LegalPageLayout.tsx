import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/locales/useLanguage';
import {
  BULLET_ICON,
  BULLET_ITEM,
  BULLET_LIST,
  HEADER_BADGE,
  HEADER_CARD,
  HIGHLIGHT_CARD,
  HIGHLIGHT_HEADER,
  HIGHLIGHT_TITLE,
  META_LINK,
  META_PILL,
  META_ROW,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SECTION_CARD,
  SECTION_TEXT,
  SECTION_TITLE,
} from '@/components/layout/layoutStyles';
import type { LegalPageContent, LegalSection } from '../types';

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
    <div className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <header className={HEADER_CARD}>
          <div className={HEADER_BADGE}>
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
                  <p className={SECTION_TEXT}>
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
