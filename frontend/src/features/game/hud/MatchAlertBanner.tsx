import { SkullIcon, TimerIcon, type LucideIcon } from 'lucide-react';

import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';

import { HUD } from './hudStyles';

export type MatchAlertKind = 'finalSeconds' | 'suddenDeath';

interface MatchAlertBannerProps {
  kind: MatchAlertKind;
}

const ICONS: Record<MatchAlertKind, LucideIcon> = {
  finalSeconds: TimerIcon,
  suddenDeath: SkullIcon,
};

/**
 * Aviso temporal centrado sobre el canvas: cuenta atrás de
 * los últimos segundos del reloj regular y anuncio de muerte
 * súbita al llegar a 0. Usa la tipografía principal de las
 * páginas (`UI.text.pageTitle`) sobre un panel del HUD.
 *
 * Sin eventos (pointer-events-none, z-10) para no tapar el
 * juego ni interferir con EndScreenOverlay (z-20).
 */
export function MatchAlertBanner({ kind }: MatchAlertBannerProps) {
  const { t } = useLanguage();
  const isSuddenDeath = kind === 'suddenDeath';
  const Icon = ICONS[kind];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex justify-center px-4">
      <div
        className={`${HUD.surface.alert} ${
          isSuddenDeath ? 'motion-safe:animate-pulse' : ''
        }`}
        role="status"
      >
        <div className="flex items-center gap-3">
          <Icon className={HUD.icon.alert} aria-hidden="true" />
          <p className={UI.text.pageTitle}>
            {isSuddenDeath
              ? t('app.hud.suddenDeath')
              : t('app.hud.finalSeconds')}
          </p>
        </div>
        {isSuddenDeath && (
          <p className={UI.text.pageSubtitle}>{t('app.hud.suddenDeathSub')}</p>
        )}
      </div>
    </div>
  );
}
