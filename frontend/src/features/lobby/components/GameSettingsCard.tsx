import type { GameSettings } from '../types';

interface Props {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  isHost: boolean;
  isPublicMode: boolean;
}

export function GameSettingsCard({
  settings,
  onChange,
  isHost,
  isPublicMode,
}: Props) {
  const isDisabled = isPublicMode || !isHost;

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-opacity ${
        isDisabled ? 'opacity-40 select-none' : 'opacity-100'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="mb-2 block text-xs font-bold tracking-wider text-orange-400 uppercase">
          Ajustes
        </span>
        {isPublicMode ? (
          <span className="text-[10px] font-semibold text-zinc-500 uppercase">
            Valores fijos en público
          </span>
        ) : !isHost ? (
          <span className="text-[10px] font-semibold text-zinc-500 uppercase">
            Solo anfitrión
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-zinc-400">
            Bombas iniciales: {settings.initialBombs}
          </label>
          <input
            type="range"
            min={1}
            max={3}
            disabled={isDisabled}
            value={settings.initialBombs}
            onChange={(e) =>
              onChange({ ...settings, initialBombs: Number(e.target.value) })
            }
            className="w-full accent-orange-500 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="mb-1 block text-zinc-400">
            Velocidad base: {settings.initialSpeed}
          </label>
          <input
            type="range"
            min={1}
            max={3}
            disabled={isDisabled}
            value={settings.initialSpeed}
            onChange={(e) =>
              onChange({ ...settings, initialSpeed: Number(e.target.value) })
            }
            className="w-full accent-orange-500 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="mb-1 block text-zinc-400">
            Mecha: {settings.fuseTime}s
          </label>
          <input
            type="range"
            min={2}
            max={5}
            disabled={isDisabled}
            value={settings.fuseTime}
            onChange={(e) =>
              onChange({ ...settings, fuseTime: Number(e.target.value) })
            }
            className="w-full accent-orange-500 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
