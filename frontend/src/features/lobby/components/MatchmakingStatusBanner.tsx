import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

import type { MatchmakingState } from '../types';

interface Props {
  matchmaking: MatchmakingState;
  countdown: number | null;
  onCancel: () => void;
}

function modeLabel(mode: string, t: (key: string) => string): string {
  switch (mode.toUpperCase()) {
    case 'PUBLIC':
      return t('app.lobby.modePublicShort') || 'PUBLIC';
    case 'PRIVATE':
      return t('app.lobby.modePrivateShort') || 'PRIVATE';
    default:
      return t('app.lobby.modePracticeShort') || 'PRACTICE';
  }
}

export function MatchmakingStatusBanner({
  matchmaking,
  countdown,
  onCancel,
}: Props) {
  const { t } = useLanguage();

  const title =
    matchmaking.status === 'COUNTDOWN'
      ? `${t('app.lobby.matchStartingIn') || 'Match starting in'} ${
          countdown ?? 0
        }s`
      : matchmaking.status === 'SEARCHING'
        ? t('app.lobby.searchingPlayers') || 'Searching for players...'
        : matchmaking.status === 'CREATED'
          ? t('app.lobby.creatingMatch') || 'Creating match...'
          : t('app.lobby.preparingSearch') || 'Preparing matchmaking...';

  const detail =
    matchmaking.status === 'COUNTDOWN'
      ? `${matchmaking.playersInCurrentMatch ?? 0} ${
          t('app.lobby.confirmedPlayers') || 'players confirmed'
        } · ${t('app.lobby.maxPlayers') || 'max. 4'}`
      : matchmaking.status === 'SEARCHING'
        ? `${matchmaking.playerCount ?? 1} ${
            t('app.lobby.playersInGroup') || 'player(s) in your group'
          } · ${t('app.lobby.searchDoesNotExpire') || 'the search does not expire'}`
        : t('app.lobby.connectingEngine') || 'Connecting to the game engine...';

  const canCancel =
    matchmaking.status === 'SEARCHING' ||
    matchmaking.status === 'COUNTDOWN' ||
    matchmaking.status === 'REQUESTING';

  return (
    <Card className="border-primary/25 bg-primary/5 my-4 flex flex-wrap items-center gap-4 p-4">
      <div className="border-primary/20 border-t-primary h-8 w-8 shrink-0 animate-spin rounded-full border-[3px]" />
      <div className="min-w-0 flex-1">
        <span className={UI.text.eyebrow}>
          {t('app.lobby.searchingMatch') || 'SEARCHING FOR A MATCH'} ·{' '}
          {modeLabel(matchmaking.mode, t)}
        </span>
        <strong className="text-foreground mt-1 block text-[0.95rem]">
          {title}
        </strong>
        <span className="text-muted-foreground mt-0.5 block text-[0.7rem]">
          {detail}
        </span>
      </div>

      {canCancel && (
        <Button
          type="button"
          variant="destructive"
          className={UI.btn.action}
          onClick={onCancel}
        >
          {t('app.lobby.cancelSearch') || 'Cancel search'}
        </Button>
      )}
    </Card>
  );
}
