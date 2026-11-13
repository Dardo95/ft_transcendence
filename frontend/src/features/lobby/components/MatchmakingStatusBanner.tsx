import { useLanguage } from '@/locales/useLanguage';

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
    <div className="my-4 flex flex-wrap items-center gap-4 rounded-2xl border border-orange-400/25 bg-orange-400/5 p-4">
      <div className="h-8 w-8 shrink-0 animate-spin rounded-full border-[3px] border-orange-400/20 border-t-orange-400" />
      <div className="min-w-0 flex-1">
        <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
          {t('app.lobby.searchingMatch') || 'BUSCANDO PARTIDA'} ·{' '}
          {modeLabel(matchmaking.mode)}
        </span>
        <strong className="mt-1 block text-[0.95rem] text-[#fff0df]">
          {title}
        </strong>
        <span className="mt-0.5 block text-[0.7rem] text-zinc-400">
          {detail}
        </span>
      </div>

      {canCancel && (
        <button
          type="button"
          className="rounded-[0.7rem] border border-red-500/30 bg-red-900/20 px-4 py-3 text-[0.68rem] font-black tracking-wider text-red-300 transition hover:bg-red-900/30"
          onClick={onCancel}
        >
          {t('app.lobby.cancelSearch') || 'Cancelar búsqueda'}
        </button>
      )}
    </div>
  );
}
