import { useLanguage } from '@/locales/useLanguage';
import type { MapId } from '../types';

interface Props {
  selectedMap: MapId;
  onChange: (map: MapId) => void;
  disabled?: boolean;
}

export function MapSelector({ selectedMap, onChange, disabled }: Props) {
  const { t } = useLanguage();

  const MAPS: Array<{ id: MapId; name: string; gradient: string }> = [
    {
      id: 'red_map',
      name: t('app.lobby.mapRedName') || 'Red Map',
      gradient: 'from-red-900 via-red-950 to-zinc-900',
    },
    {
      id: 'orange_map',
      name: t('app.lobby.mapOrangeName') || 'Orange Map',
      gradient: 'from-orange-900 via-orange-950 to-zinc-900',
    },
    {
      id: 'yellow_map',
      name: t('app.lobby.mapYellowName') || 'Yellow Map',
      gradient: 'from-yellow-900 via-yellow-950 to-zinc-900',
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-md">
      <span className="mb-2 block text-xs font-bold tracking-wider text-orange-400 uppercase">
        {t('app.lobby.mapLabel') || 'Mapa Seleccionado'}
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MAPS.map((map) => {
          const isSelected = selectedMap === map.id;
          return (
            <button
              key={map.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(map.id)}
              className={`relative flex h-24 flex-col justify-end overflow-hidden rounded-xl border bg-gradient-to-br p-3 text-left ${map.gradient} transition-all ${
                isSelected
                  ? 'border-orange-500 shadow-lg ring-2 shadow-orange-500/20 ring-orange-500/50'
                  : 'border-zinc-800 opacity-70 hover:border-zinc-700 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
            >
              <span className="relative z-10 text-xs font-bold text-white drop-shadow">
                {map.name}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 rounded bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {t('app.lobby.activeLabel') || 'Activo'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
