import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { GameMode, MatchmakingPayload } from '../types';

interface Props {
  mode: GameMode;
  payload: MatchmakingPayload;
  playersCount: number;
  isHost: boolean;
  isSearching: boolean;
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
    const base = t('app.lobby.searchingText') || 'BUSCANDO...';
    return countdown !== null ? `${base} (${countdown}s)` : base;
  }

  if (mode === 'practice') {
    return (
      t('app.lobby.matchmakingPracticeText') || 'COMENZAR PRÁCTICA (1 VS BOT)'
    );
  }

  if (mode === 'private') {
    return isHost
      ? t('app.lobby.matchmakingPrivateHostText') || 'EMPEZAR PARTIDA PRIVADA'
      : t('app.lobby.matchmakingPrivateGuestText') ||
          'ESPERANDO AL ANFITRIÓN...';
  }

  return (
    t('app.lobby.matchmakingPublicText') ||
    'EMPEZAR SERVICIO (BUSCAR JUGADORES)'
  );
}

export function MatchmakingButton({
  mode,
  payload,
  playersCount,
  isHost,
  isSearching,
  countdown,
  onStart,
  onCancelSearch,
}: Props) {
  const { t } = useLanguage();
  const canStartPrivate = isHost && playersCount > 1;
  const isEnabled =
    mode === 'practice' ? true : mode === 'private' ? canStartPrivate : true;

  return (
    <Card className="flex flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <strong className="text-foreground block text-xs tracking-wider">
          {t('app.lobby.readyLabel') || 'LISTO PARA JUGAR'}
        </strong>
        <span className="text-muted-foreground mt-1 block text-[0.68rem]">
          {t('app.lobby.controlsLabel') ||
            'Controles: WASD / flechas · ESPACIO para bomba'}
        </span>

        {mode === 'private' && !canStartPrivate && (
          <span className="text-accent mt-1 block text-[0.62rem]">
            {isHost
              ? t('app.lobby.needPrivateText') ||
                'Necesitas al menos 2 jugadores en la lobby para empezar.'
              : t('app.lobby.hostOnlyStartText') ||
                'Solo el anfitrión puede iniciar la partida privada.'}
          </span>
        )}

        {isSearching && (
          <span className="text-primary mt-1 block text-[0.62rem]">
            {t('app.lobby.searchInfoText') ||
              'Puedes cancelar la búsqueda en cualquier momento.'}
          </span>
        )}
      </div>

      <Button
        type="button"
        variant={isSearching ? 'destructive' : 'default'}
        className="min-w-[210px] px-4 py-3 text-[0.68rem] font-black tracking-wider"
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
