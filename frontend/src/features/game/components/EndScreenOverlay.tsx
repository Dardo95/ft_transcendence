import { CrownIcon, ScaleIcon, SkullIcon, type LucideIcon } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import type { EndScreenState } from '../endScreen';
import { HUD } from '../hud/hudStyles';

interface EndScreenOverlayProps {
  state: Exclude<EndScreenState, 'playing'>;
  onReturnToLobby: () => void;
  onKeepWatching: () => void;
  /** En la demo (Rules), reinicia la partida en vez de volver. */
  onRestart?: () => void;
}

/**
 * Pantalla de fin de partida sobre el canvas:
 * - Muerte: "chau chao adios" con seguir viendo o volver.
 * - Victoria/derrota: resultado y vuelta al lobby.
 * - Con `onRestart` (demo): el botón principal reinicia.
 */
export function EndScreenOverlay({
  state,
  onReturnToLobby,
  onKeepWatching,
  onRestart,
}: EndScreenOverlayProps) {
  const { t } = useLanguage();

  const title =
    state === 'dead'
      ? t('app.endScreen.deadTitle')
      : state === 'victory'
        ? t('app.endScreen.victoryTitle')
        : state === 'draw'
          ? t('app.endScreen.drawTitle')
          : t('app.endScreen.defeatTitle');

  const ICONS: Record<Exclude<EndScreenState, 'playing'>, LucideIcon> = {
    dead: SkullIcon,
    victory: CrownIcon,
    defeat: SkullIcon,
    draw: ScaleIcon,
  };
  const Icon = ICONS[state];

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-zinc-950/85">
      <div className={HUD.surface.alert} role="status">
        <div className="flex items-center gap-3">
          <Icon className={HUD.icon.alert} aria-hidden="true" />
          <p className={UI.text.pageTitle}>{title}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          size="lg"
          onClick={onRestart ?? onReturnToLobby}
          className="bg-orange-500 font-black text-white hover:bg-orange-600"
        >
          {onRestart
            ? t('app.endScreen.restart')
            : t('app.endScreen.returnLobby')}
        </Button>

        {state === 'dead' && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onKeepWatching}
          >
            {t('app.endScreen.keepWatching')}
          </Button>
        )}
      </div>
    </div>
  );
}
