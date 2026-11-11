import { useLanguage } from '@/locales/useLanguage';

import mapUrl from '@/assets/map1_lobby.png';

import type { MapId } from '../types';

interface Props {
  selectedMap: MapId;
  onChange: (map: MapId) => void;
  disabled?: boolean;
}

interface MapOption {
  id: MapId;
  name: string;
  subtitle: string;
}

export function MapSelector({ selectedMap, onChange, disabled }: Props) {
  const { t } = useLanguage();

  // Todos los mapas muestran el mismo arte por ahora. El id que se envía al
  // backend sigue siendo map1, map2 o map3 y determina el .txt cargado.
  const maps: MapOption[] = [
    {
      id: 'map1',
      name: t('app.lobby.map1Name') || 'ARENA 01',
      subtitle: '13 × 11 · clásico',
    },
    {
      id: 'map2',
      name: t('app.lobby.map2Name') || 'ARENA 02',
      subtitle: '13 × 11 · abierto',
    },
    {
      id: 'map3',
      name: t('app.lobby.map3Name') || 'ARENA 03',
      subtitle: '13 × 11 · laberinto',
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
      <div className="mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider text-orange-400">
        <span>02 / {t('app.lobby.mapLabel') || 'ESCENARIO'}</span>
        <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
          {t('app.lobby.mapHint') || 'Elige el mapa'}
        </small>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {maps.map((map) => {
          const isSelected = selectedMap === map.id;

          return (
            <button
              key={map.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(map.id)}
              className={`min-w-0 cursor-pointer rounded-xl border p-2.5 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                isSelected
                  ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                  : 'border-white/10 bg-white/[0.025]'
              }`}
            >
              <span className="relative mb-2 block aspect-[1.5] overflow-hidden rounded-[0.4rem] bg-[#1c2828]">
                <img
                  src={mapUrl}
                  alt={map.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 rounded bg-orange-500/90 px-1.5 py-0.5 text-[0.52rem] font-black tracking-wider text-[#231710]">
                    {t('app.lobby.activeLabel') || 'ACTIVO'}
                  </span>
                )}
              </span>
              <strong className="block text-[0.72rem] font-black tracking-wider">
                {map.name}
              </strong>
              <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                {map.subtitle}
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
