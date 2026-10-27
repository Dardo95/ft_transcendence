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
  const canStartPrivate = isHost && playersCount > 1;
  const canStartPractice = true;
  const canStartPublic = true;

  const isEnabled =
    mode === 'practice'
      ? canStartPractice
      : mode === 'private'
        ? canStartPrivate
        : canStartPublic;

  if (isSearching) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onCancelSearch}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-zinc-700"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>
            Buscando jugadores... {countdown !== null && `(${countdown}s)`}
          </span>
          <span className="ml-2 text-xs text-red-400">[Cancelar]</span>
        </button>
        <span className="text-[11px] text-zinc-500">
          Esperando jugadores públicos (arranque automático con 4 jugadores o al
          agotar el tiempo si hay al menos 2 jugadores).
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        disabled={!isEnabled}
        onClick={() => onStart(payload)}
        className="w-full rounded-xl bg-orange-600 px-6 py-4 text-sm font-black tracking-wider text-white uppercase shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {mode === 'practice' && 'Comenzar Práctica (1 vs Bot)'}
        {mode === 'private' &&
          (isHost ? 'Empezar Partida Privada' : 'Esperando al anfitrión...')}
        {mode === 'public' && 'Empezar Servicio (Buscar Jugadores)'}
      </button>

      {mode === 'private' && !canStartPrivate && isHost && (
        <span className="text-center text-[11px] text-zinc-500">
          Se necesita al menos 2 jugadores en la sala para empezar en modo
          privado.
        </span>
      )}
    </div>
  );
}
