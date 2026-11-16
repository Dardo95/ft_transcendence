import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

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
    <Card className="min-w-0 p-4">
      <div className="text-primary mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider">
        <span>02 / {t('app.lobby.mapLabel') || 'ESCENARIO'}</span>
        <small className="text-muted-foreground text-[0.68rem] font-medium tracking-normal">
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
              className={`text-foreground hover:border-primary/50 min-w-0 cursor-pointer rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-[inset_0_0_0_1px_var(--primary)]'
                  : UI.card.inner
              }`}
            >
              <span className="bg-secondary relative mb-2 block aspect-[1.5] overflow-hidden rounded-[0.4rem]">
                <img
                  src={mapUrl}
                  alt={map.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="from-background/55 via-background/5 absolute inset-0 bg-gradient-to-t to-transparent" />
                {isSelected && (
                  <span className="bg-primary/90 text-primary-foreground absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[0.52rem] font-black tracking-wider">
                    {t('app.lobby.activeLabel') || 'ACTIVO'}
                  </span>
                )}
              </span>
              <strong className="block text-[0.72rem] font-black tracking-wider">
                {map.name}
              </strong>
              <small className="text-muted-foreground mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug">
                {map.subtitle}
              </small>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
