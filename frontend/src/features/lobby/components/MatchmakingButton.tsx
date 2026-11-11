import { useLanguage } from '@/locales/useLanguage';

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
    <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <strong className="block text-xs tracking-wider text-[#e8e0d4]">
          {t('app.lobby.readyLabel') || 'LISTO PARA JUGAR'}
        </strong>
        <span className="mt-1 block text-[0.68rem] text-zinc-400">
          {t('app.lobby.controlsLabel') ||
            'Controles: WASD / flechas · ESPACIO para bomba'}
        </span>

        {mode === 'private' && !canStartPrivate && (
          <span className="mt-1 block text-[0.62rem] text-amber-300/80">
            {isHost
              ? t('app.lobby.needPrivateText') ||
                'Necesitas al menos 2 jugadores en la lobby para empezar.'
              : t('app.lobby.hostOnlyStartText') ||
                'Solo el anfitrión puede iniciar la partida privada.'}
          </span>
        )}

        {isSearching && (
          <span className="mt-1 block text-[0.62rem] text-orange-300/80">
            {t('app.lobby.searchInfoText') ||
              'Puedes cancelar la búsqueda en cualquier momento.'}
          </span>
        )}
      </div>

      <button
        type="button"
        className={`min-w-[210px] rounded-[0.7rem] px-4 py-3 text-[0.68rem] font-black tracking-wider transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${
          isSearching
            ? 'border border-red-500/30 bg-red-900/20 text-red-300 hover:bg-red-900/30'
            : 'bg-gradient-to-br from-orange-300 to-orange-600 text-[#231710] shadow-[0_8px_22px_rgba(237,113,55,0.17)] hover:brightness-110'
        }`}
        onClick={isSearching ? onCancelSearch : () => onStart(payload)}
        disabled={!isSearching && !isEnabled}
      >
        {isSearching && (
          <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-300/30 border-t-red-300 align-middle" />
        )}
        {actionLabel(mode, isHost, isSearching, countdown, t)}
        {!isSearching && <span className="ms-2">↗</span>}
      </button>
    </div>
  );
}
