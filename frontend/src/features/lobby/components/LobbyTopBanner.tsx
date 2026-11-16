import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

interface Props {
  isGameConnected: boolean;
}

export function LobbyTopBanner({ isGameConnected }: Props) {
  const { t } = useLanguage();

  return (
    <Card className="relative my-6 grid min-h-[250px] items-center gap-6 p-[clamp(1.3rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,var(--banner-glow),transparent_30%),linear-gradient(115deg,var(--banner-sheen-start),var(--banner-sheen-end))]"
        aria-hidden="true"
      />
      <div className="absolute top-6 right-6 z-20">
        <div
          className={`text-secondary-foreground inline-flex items-center gap-2 px-3 py-2 text-[0.65rem] font-extrabold tracking-wider backdrop-blur-sm ${UI.card.inner}`}
        >
          <span
            className={`${UI.feedback.dot} h-[0.48rem] w-[0.48rem] shadow-[0_0_10px_currentColor] ${
              isGameConnected ? 'bg-success' : 'bg-destructive'
            }`}
          />
          {isGameConnected
            ? t('app.lobby.socketOnline') || 'SOCKET ONLINE'
            : t('app.lobby.socketOffline') || 'SOCKET OFFLINE'}
        </div>
      </div>

      <div className="relative z-10">
        <span className={UI.text.eyebrow}>
          {t('app.lobby.matchConfiguration') || 'CONFIGURACIÓN DE PARTIDA'}
        </span>

        <h2 className="text-foreground mt-2 mb-3 text-[clamp(2.5rem,6vw,4.4rem)] leading-[0.92] font-black tracking-[-0.075em]">
          {t('app.lobby.enterLobbyPrefix') || 'Entra al'}
          <em className="text-primary not-italic">
            {' '}
            {t('app.lobby.enterLobbyHighlight') || 'Lobby'}
          </em>
        </h2>
        <p className="text-muted-foreground max-w-[520px] text-sm leading-relaxed">
          {t('app.lobby.bannerDescription') ||
            'Configura tu partida. El servidor controla movimiento, bombas, explosiones, mejoras y victoria.'}
        </p>
      </div>

      <div
        className="relative w-[min(100%,370px)] justify-self-center"
        aria-hidden="true"
      >
        <span className="bg-primary/20 absolute inset-[15%] rounded-full blur-[45px]" />
        <div className="border-primary/25 bg-background/80 relative grid grid-cols-5 gap-1.5 rounded-xl border p-2 shadow-[var(--banner-panel-shadow)]">
          {Array.from({ length: 15 }, (_, index) => (
            <span
              key={index}
              className={`border-border grid aspect-square place-items-center rounded-[0.3rem] border text-[clamp(1rem,3vw,2rem)] [text-shadow:0_0_12px_currentColor] ${
                (index + 1) % 3 === 0
                  ? 'text-accent bg-[linear-gradient(145deg,var(--tile-warm-from),var(--tile-warm-to))]'
                  : index === 6 || index === 8 || index === 12
                    ? 'text-primary'
                    : 'text-muted-foreground bg-[linear-gradient(145deg,var(--tile-cool-from),var(--tile-cool-to))]'
              }`}
            >
              {index === 6 || index === 8 || index === 12
                ? '●'
                : (index + 1) % 3 === 0
                  ? '✹'
                  : '▦'}
            </span>
          ))}
        </div>
        <div className="text-muted-foreground relative mt-2.5 text-right text-[0.58rem] font-black tracking-[0.23em]">
          {t('app.lobby.bombsReady') || 'BOMBS READY / PLAYER MODE'}
        </div>
      </div>
    </Card>
  );
}
