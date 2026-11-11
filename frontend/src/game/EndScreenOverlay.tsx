import { Button } from '../components/ui/button';
import { useLanguage } from '../locales/useLanguage';
import type { EndScreenState } from './endScreen';

interface EndScreenOverlayProps {
  state: Exclude<EndScreenState, 'playing'>;
  onReturnToLobby: () => void;
  onKeepWatching: () => void;
}

/**
 * Pantalla de fin de partida sobre el canvas:
 * - Muerte: "chau chao adios" con seguir viendo o volver.
 * - Victoria/derrota: resultado y vuelta al lobby.
 */
export function EndScreenOverlay({
  state,
  onReturnToLobby,
  onKeepWatching,
}: EndScreenOverlayProps) {
  const { t } = useLanguage();

  const title =
    state === 'dead'
      ? t('app.endScreen.deadTitle')
      : state === 'victory'
        ? t('app.endScreen.victoryTitle')
        : t('app.endScreen.defeatTitle');

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-zinc-950/85">
      <p className="text-center text-3xl font-black tracking-wide text-zinc-100">
        {title}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          size="lg"
          onClick={onReturnToLobby}
          className="bg-orange-500 font-black text-white hover:bg-orange-600"
        >
          {t('app.endScreen.returnLobby')}
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
