import { useLanguage } from '../../../locales/useLanguage';
import { Link } from 'react-router-dom';

import { UI } from '@/components/layout/layoutStyles';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ProfilePageUnkown() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <FileQuestion className={UI.icon.xs} aria-hidden="true" />
            <span>{t('app.notFound.badge') || 'ERROR 404'}</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t('profile.userNotFound') || 'User Not Found'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('profile.userNotFoundSubtitle') ||
              'The profile you are looking for could not be found. Check the URL or return to the lobby.'}
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/lobby" className="gap-2 font-semibold">
                <ArrowLeft className={UI.icon.sm} aria-hidden="true" />
                {t('profile.backToLobby') || 'Back to Lobby'}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
