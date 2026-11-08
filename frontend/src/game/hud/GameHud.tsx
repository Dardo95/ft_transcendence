import { useLanguage } from '../../locales/useLanguage';
import { formatClock, type HudModel } from './hudModel';

interface GameHudProps {
  model: HudModel;
  className?: string;
}

/**
 * HUD flotante superpuesto al canvas (FRONTEND_STYLE §4):
 * tarjeta del jugador local, reloj central de la partida y
 * tarjetas de rivales.
 *
 * `pointer-events-none` en el contenedor: el HUD nunca roba
 * clicks ni foco al canvas ni al resto de la página.
 */
export function GameHud({ model, className = '' }: GameHudProps) {
  const { t } = useLanguage();
  const { local, rivals, playersRemaining, clockMs } = model;
  const totalPlayers = 1 + rivals.length;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2 ${className}`}
      aria-label="Game HUD"
    >
      {/* Tarjeta del jugador local */}
      <section className="rounded-md border border-zinc-700 bg-zinc-900/85 px-3 py-2 text-xs text-zinc-100 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">{local.alive ? '❤️' : '💀'}</span>
          <span className="font-semibold">{local.name}</span>
          <span
            className={
              local.alive
                ? 'rounded bg-emerald-900/70 px-1.5 py-0.5 text-[10px] text-emerald-200'
                : 'rounded bg-red-900/70 px-1.5 py-0.5 text-[10px] text-red-200'
            }
          >
            {local.alive ? t('app.hud.alive') : t('app.hud.down')}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-sm">
          <span title={t('app.hud.bombs')}>
            🍳 {local.availableBombs}/{local.bombCapacity}
          </span>
          <span title={t('app.hud.blast')}>🔥 {local.blastRadius}</span>
          <span title={t('app.hud.speed')}>☕ {local.speed}</span>
        </div>
      </section>

      {/* Reloj central + restantes */}
      <section className="flex flex-col items-center gap-1">
        <div
          className="rounded-md border border-zinc-700 bg-zinc-900/85 px-4 py-1 font-mono text-2xl font-bold text-amber-100 tabular-nums shadow-lg backdrop-blur-sm"
          aria-label={t('app.hud.time')}
        >
          {formatClock(clockMs)}
        </div>
        <div className="rounded border border-zinc-700 bg-zinc-950/85 px-2 py-0.5 text-[11px] text-zinc-300">
          {t('app.hud.remaining')}: {playersRemaining}/{totalPlayers}
        </div>
      </section>

      {/* Rivales */}
      <section
        className="flex flex-col items-end gap-1"
        aria-label={t('app.hud.rivals')}
      >
        {rivals.map((rival) => (
          <div
            key={rival.name}
            className={
              rival.alive
                ? 'flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900/85 px-2 py-1 text-xs text-zinc-100 shadow backdrop-blur-sm'
                : 'flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-950/85 px-2 py-1 text-xs text-zinc-500 line-through shadow backdrop-blur-sm'
            }
          >
            <span aria-hidden="true">{rival.alive ? '❤️' : '💀'}</span>
            {rival.name}
          </div>
        ))}
      </section>
    </div>
  );
}
