import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

import type { GameMode, MatchmakingPayload } from '../types';

interface Props {
  mode: GameMode;
  payload: MatchmakingPayload;
  playersCount: number;
  isHost: boolean;
  isSearching: boolean;
  disabled?: boolean;
  countdown: number | null;
  onStart: (payload: MatchmakingPayload) => void;
  onCancelSearch: () => void;
}

function actionLabel(
  mode: GameMode,
  isHost: boolean,
  isSearching: boolean,
  countdown: number | null,
  t: (key: string) => string
): string {
  if (isSearching) {
    const base = t('app.lobby.searchingText') || 'SEARCHING...';
    return countdown !== null ? `${base} (${countdown}s)` : base;
  }

  if (mode === 'practice') {
    return t('app.lobby.matchmakingPracticeText') || 'START PRACTICE MATCH';
  }

  if (mode === 'private') {
    return isHost
      ? t('app.lobby.matchmakingPrivateHostText') || 'START PRIVATE MATCH'
      : t('app.lobby.matchmakingPrivateGuestText') || 'WAITING FOR HOST...';
  }

  return t('app.lobby.matchmakingPublicText') || 'SEARCH PLAYERS FOR A MATCH';
}

export function MatchmakingButton({
  mode,
  payload,
  playersCount,
  isHost,
  isSearching,
  disabled = false,
  countdown,
  onStart,
  onCancelSearch,
}: Props) {
  const { t } = useLanguage();
  const canStartPrivate = isHost && playersCount > 1;
  const isEnabled =
    !disabled &&
    (mode === 'practice' ? true : mode === 'private' ? canStartPrivate : true);

  return (
    <Card className="flex flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <strong className="text-foreground block text-xs tracking-wider">
          {t('app.lobby.readyLabel') || 'READY TO PLAY'}
        </strong>
        <span className="text-muted-foreground mt-1 block text-[0.68rem]">
          {t('app.lobby.controlsLabel') ||
            'Controls: WASD / arrows · SPACE to drop a bomb'}
        </span>

        {mode === 'private' && !canStartPrivate && (
          <span className="text-warning mt-1 block text-[0.62rem]">
            {isHost
              ? t('app.lobby.needPrivateText') ||
                'You need at least 2 players in the lobby to start.'
              : t('app.lobby.hostOnlyStartText') ||
                'Only the host can start the private match.'}
          </span>
        )}

        {isSearching && (
          <span className="text-primary mt-1 block text-[0.62rem]">
            {t('app.lobby.cancelSearchHint') ||
              'You can cancel the search at any time.'}
          </span>
        )}
      </div>

      <Button
        type="button"
        variant={isSearching ? 'destructive' : 'default'}
        className={`${UI.btn.action} min-w-[210px]`}
        onClick={isSearching ? onCancelSearch : () => onStart(payload)}
        disabled={!isSearching && !isEnabled}
      >
        {isSearching && (
          <span className="border-destructive/30 border-t-destructive mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 align-middle" />
        )}
        {actionLabel(mode, isHost, isSearching, countdown, t)}
        {!isSearching && <span className="ms-2">↗</span>}
      </Button>
    </Card>
  );
}
