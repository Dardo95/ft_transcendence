import { useLanguage } from '@/locales/useLanguage';
import type { MapId } from '../types';

import mapUrl from '@/assets/map1_lobby.png';

interface Props {
  selectedMap: MapId;
  onChange: (map: MapId) => void;
  disabled?: boolean;
}

export function MapSelector({ selectedMap, onChange, disabled }: Props) {
  const { t } = useLanguage();

  const MAPS: Array<{ id: MapId; name: string; asset: string }> = [
    {
      id: 'map1',
      name: t('app.lobby.map1Name') || 'Red Map',
      asset: mapUrl,
    },
    {
      id: 'map2',
      name: t('app.lobby.map2Name') || 'Orange Map',
      asset: mapUrl,
    },
    {
      id: 'map3',
      name: t('app.lobby.map3Name') || 'Yellow Map',
      asset: mapUrl,
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
              className={`relative flex h-24 flex-col justify-end overflow-hidden rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? 'border-orange-500 shadow-lg ring-2 shadow-orange-500/20 ring-orange-500/50'
                  : 'border-zinc-800 opacity-70 hover:border-zinc-700 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
            >
              <img
                src={map.asset}
                alt={map.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
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
