import { EyeIcon } from 'lucide-react';

import { Card } from '../../../components/ui/card';
import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';

/**
 * Standalone top card identifying spectator mode outside `GameTopBar`.
 */
export function SpectatorHeaderCard() {
  const { t } = useLanguage();

  return (
    <Card className={UI.spectator.headerCard}>
      <h1 className={UI.spectator.headerTitle}>
        <EyeIcon className={`${UI.icon.md} text-primary`} aria-hidden="true" />
        {t('app.spectator.spectatorMode') || 'Spectator mode'}
      </h1>

      <span
        role="status"
        aria-live="polite"
        className={`${UI.badge.pill} ${UI.spectator.liveBadge}`}
      >
        <span
          className={`${UI.feedback.dot} bg-success animate-pulse`}
          aria-hidden="true"
        />
        <span className={UI.spectator.liveText}>
          {t('app.spectator.liveBadge') || 'Live'}
        </span>
      </span>
    </Card>
  );
}
