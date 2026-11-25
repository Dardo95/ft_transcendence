import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

import {
  BookOpen,
  Code2,
  FileQuestion,
  Home,
  LogIn,
  Users,
} from 'lucide-react';

const QUICK_LINKS = [
  {
    to: '/rules',
    labelKey: 'app.general.aboutGame',
    fallback: 'About the Game',
    icon: BookOpen,
  },
  {
    to: '/project',
    labelKey: 'app.general.aboutProject',
    fallback: 'About the Project',
    icon: Code2,
  },
  {
    to: '/about-us',
    labelKey: 'app.general.aboutUs',
    fallback: 'About Us',
    icon: Users,
  },
] as const;

export function NotFoundPage() {
  const { t } = useLanguage();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const homePath = isAuthenticated ? '/lobby' : '/login';
  const HomeIcon = isAuthenticated ? Home : LogIn;

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        {/* Header Section */}
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <FileQuestion className={UI.icon.xs} aria-hidden="true" />
            <span>{t('app.notFound.badge') || 'ERROR 404'}</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t('app.notFound.title') || 'Page Not Found'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('app.notFound.subtitle') ||
              'The page you are looking for does not exist, has been moved, or the URL is incorrect.'}
          </p>

          {/* Requested path */}
          <div className={UI.badge.metaRow}>
            <span className={UI.text.small}>
              {t('app.notFound.requestedPath') || 'Requested path'}
            </span>
            <span className={`${UI.badge.metaPill} font-mono`}>
              {location.pathname}
            </span>
          </div>

          {/* Primary & secondary navigation actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to={homePath}>
                <HomeIcon className="size-4" aria-hidden="true" />
                <span>
                  {isAuthenticated
                    ? t('app.notFound.backLobby') || 'Back to Lobby'
                    : t('app.notFound.backHome') || 'Go to Login'}
                </span>
              </Link>
            </Button>
          </div>
        </Card>

        {/* Quick links to open informational pages */}
        <Card className={UI.card.section}>
          <h2 className={UI.text.sectionTitle}>
            {t('app.notFound.quickLinks') || 'Quick Navigation'}
          </h2>
          <p className={UI.text.body}>
            {t('app.notFound.quickLinksHint') ||
              'Explore the game rules, the project breakdown, or meet the team.'}
          </p>

          <div className={`mt-4 ${UI.shell.grid3}`}>
            {QUICK_LINKS.map(({ to, labelKey, fallback, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`${UI.card.interactive} flex items-center justify-center gap-3 p-4`}
              >
                <span className="border-primary/30 bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
                  <Icon className={UI.icon.sm} aria-hidden="true" />
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {t(labelKey) || fallback}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
