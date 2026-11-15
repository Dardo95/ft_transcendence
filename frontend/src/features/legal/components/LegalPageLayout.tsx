import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import type { LegalPageContent, LegalSection } from '../types';

function LegalSectionCard({ section }: { section: LegalSection }) {
  const { t } = useLanguage();

  return (
    <Card className={UI.card.section}>
      <h2 className={UI.text.sectionTitle}>
        {t(section.titleKey) || section.defaultTitle}
      </h2>
      <p className={UI.text.body}>
        {t(section.contentKey) || section.defaultContent}
      </p>

      {section.bullets && section.bullets.length > 0 && (
        <ul className={UI.list.ul}>
          {section.bullets.map((bullet) => (
            <li key={bullet.key} className={UI.list.li}>
              <CheckCircle2 className={UI.list.icon} />
              <span>{t(bullet.key) || bullet.fallback}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function LegalPageLayout({ page }: { page: LegalPageContent }) {
  const { t } = useLanguage();
  const BadgeIcon = page.badgeIcon;
  const CrossLinkIcon = page.crossLink.icon;

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <BadgeIcon className="size-3.5" />
            <span>{t(page.badgeKey) || page.defaultBadge}</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t(page.titleKey) || page.defaultTitle}
          </h1>

          <p className={UI.text.pageSubtitle}>
            {t(page.subtitleKey) || page.defaultSubtitle}
          </p>

          <div className={UI.badge.metaRow}>
            <span className={UI.badge.metaPill}>
              {t('legal.lastUpdated') || 'Last updated: November 2026'}
            </span>
            <Link to={page.crossLink.to} className={UI.badge.metaLink}>
              <CrossLinkIcon className="size-3.5" />
              <span>
                {t(page.crossLink.labelKey) || page.crossLink.defaultLabel}
              </span>
            </Link>
          </div>
        </Card>

        {page.highlights && page.highlights.length > 0 && (
          <section className={UI.shell.grid3}>
            {page.highlights.map((highlight) => {
              const HighlightIcon = highlight.icon;

              return (
                <Card key={highlight.titleKey} className={UI.card.highlight}>
                  <div className={UI.list.highlightHeader}>
                    <HighlightIcon className="size-4 shrink-0" />
                    <h2 className={UI.list.highlightTitle}>
                      {t(highlight.titleKey) || highlight.defaultTitle}
                    </h2>
                  </div>
                  <p className={UI.text.body}>
                    {t(highlight.descriptionKey) ||
                      highlight.defaultDescription}
                  </p>
                </Card>
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
