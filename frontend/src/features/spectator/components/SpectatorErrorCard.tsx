import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import type { GameJoinFailure } from '../../game/net/gameConnection';

interface SpectatorErrorCardProps {
  reason: GameJoinFailure;
  onBack: () => void;
  onRetry: () => void;
}

/** Join recovery card for unavailable/finished matches or server timeout. */
export function SpectatorErrorCard({
  reason,
  onBack,
  onRetry,
}: SpectatorErrorCardProps) {
  const { t } = useLanguage();
  const rejected = reason === 'rejected';

  return (
    <div className={UI.spectator.errorCard} role="alert">
      <p className={UI.game.failureTitle}>
        {rejected
          ? t('app.spectator.matchUnavailable') || 'Match unavailable'
          : t('app.spectator.connectionLost') ||
            'Could not connect to the server'}
      </p>
      <p className={UI.game.failureDescription}>
        {rejected
          ? t('app.spectator.matchUnavailableSubtitle') ||
            'This match does not exist or has already ended.'
          : t('app.spectator.connectionLostSubtitle') ||
            'The server did not respond in time.'}
      </p>
      <div className={UI.spectator.errorActions}>
        {!rejected && (
          <Button type="button" size="lg" onClick={onRetry}>
            <RefreshCwIcon className={UI.icon.sm} aria-hidden="true" />
            {t('app.spectator.retry') || 'Retry'}
          </Button>
        )}
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeftIcon className={UI.icon.sm} aria-hidden="true" />
          {t('app.spectator.backToLobby') || 'Back to lobby'}
        </Button>
      </div>
    </div>
  );
}
