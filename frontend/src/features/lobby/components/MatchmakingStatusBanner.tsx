import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { MatchmakingState } from '../types';

interface Props {
  matchmaking: MatchmakingState;
  countdown: number | null;
  onCancel: () => void;
}

function modeLabel(mode: string): string {
  switch (mode.toUpperCase()) {
    case 'PUBLIC':
      return 'PÚBLICA';
    case 'PRIVATE':
      return 'PRIVADA';
    default:
      return 'PRÁCTICA';
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
      ? `${t('app.lobby.matchStartingIn') || 'La partida comienza en'} ${
          countdown ?? 0
        }s`
      : matchmaking.status === 'SEARCHING'
        ? t('app.lobby.searchingPlayers') || 'Buscando jugadores...'
        : matchmaking.status === 'CREATED'
          ? t('app.lobby.creatingMatch') || 'Creando partida...'
          : t('app.lobby.preparingSearch') || 'Preparando búsqueda...';

  const detail =
    matchmaking.status === 'COUNTDOWN'
      ? `${matchmaking.playersInCurrentMatch ?? 0} ${
          t('app.lobby.confirmedPlayers') || 'jugadores confirmados'
        } · máx. 4`
      : matchmaking.status === 'SEARCHING'
        ? `${matchmaking.playerCount ?? 1} ${
            t('app.lobby.playersInGroup') || 'jugador(es) en tu grupo'
          } · ${t('app.lobby.searchDoesNotExpire') || 'la búsqueda no caduca'}`
        : t('app.lobby.connectingEngine') ||
          'Conectando con el motor del servidor';

  const canCancel =
    matchmaking.status === 'SEARCHING' ||
    matchmaking.status === 'COUNTDOWN' ||
    matchmaking.status === 'REQUESTING';

  return (
    <Card className="border-primary/25 bg-primary/5 my-4 flex flex-wrap items-center gap-4 p-4">
      <div className="border-primary/20 border-t-primary h-8 w-8 shrink-0 animate-spin rounded-full border-[3px]" />
      <div className="min-w-0 flex-1">
        <span className="text-muted-foreground block text-[0.65rem] font-extrabold tracking-[0.19em]">
          {t('app.lobby.searchingMatch') || 'BUSCANDO PARTIDA'} ·{' '}
          {modeLabel(matchmaking.mode)}
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
          className="px-4 py-3 text-[0.68rem] font-black tracking-wider"
          onClick={onCancel}
        >
          {t('app.lobby.cancelSearch') || 'Cancelar búsqueda'}
        </Button>
      )}
    </Card>
  );
}
