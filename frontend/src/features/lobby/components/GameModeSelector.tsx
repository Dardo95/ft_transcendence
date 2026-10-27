import type { GameMode } from '../types';

interface Props {
  selectedMode: GameMode;
  onChange: (mode: GameMode) => void;
  disabled?: boolean;
}

const MODES: Array<{
  id: GameMode;
  title: string;
  subtitle: string;
}> = [
  { id: 'practice', title: 'Práctica', subtitle: '1 vs Bot' },
  {
    id: 'private',
    title: 'Partida Privada',
    subtitle: 'Solo miembros de la sala',
  },
  {
    id: 'public',
    title: 'Partida Pública',
    subtitle: 'Matchmaking abierto',
  },
];

export function GameModeSelector({ selectedMode, onChange, disabled }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-md">
      <span className="mb-2 block text-xs font-bold tracking-wider text-orange-400 uppercase">
        Modo de Juego
      </span>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? 'border-zinc-100 bg-zinc-950/30 text-white shadow-md shadow-zinc-500/10'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="mb-2 text-xl"> </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                )}
              </div>
              <p className="text-center text-sm font-semibold text-zinc-200">
                {mode.title}
              </p>
              <p className="text-center text-[11px] text-zinc-400">
                {mode.subtitle}
              </p>
              <span className="mb-2 text-xl"> </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
