/**
 * Design tokens del HUD de partida (topbar y overlay de
 * pantalla completa), con el mismo patrón que
 * components/layout/layoutStyles.ts: strings Tailwind planos,
 * sin componentes wrapper ni hojas de estilos. El sidebar de
 * partida usa los tokens UI.game del tema; estos tokens cubren
 * lo que se pinta sobre el canvas, con paleta propia.
 * Category: Game HUD Design Tokens
 */

/* Superficies */
const PANEL = 'rounded-lg border border-zinc-800 bg-zinc-900/90 shadow-lg';
const ROW = 'rounded-md border border-zinc-800 bg-zinc-950/70';

/* Controles del topbar */
const BUTTON =
  'h-9 gap-2 rounded-md border-1 border-zinc-800 bg-zinc-900 px-4 font-black text-zinc-400 transition-none hover:border-zinc-800 hover:bg-zinc-800 hover:text-white focus:ring-0 focus-visible:ring-0';

/* Tipografía */
const STAT_LABEL =
  'text-[10px] font-semibold tracking-widest text-zinc-400 uppercase';
const VALUE = 'font-mono font-bold text-zinc-100 uppercase';

export const HUD = {
  surface: {
    topbar: `shrink-0 px-4 py-3 text-zinc-100 ${PANEL}`,
    playerCard: `w-56 px-3 py-2 text-zinc-100 ${PANEL}`,
    timerBox: `px-6 py-2 text-center ${PANEL}`,
    alert:
      'flex flex-col items-center rounded-xl bg-zinc-950/90 px-8 py-4 text-center shadow-xl',
    statBoxTight: `min-w-0 px-1 py-1 text-center ${ROW}`,
    statGridTight: 'mt-2 grid grid-cols-3 gap-1.5',
    divider:
      'mt-3 flex flex-wrap gap-x-8 gap-y-2 border-t border-zinc-800 pt-3',
  },
  button: {
    base: BUTTON,
    active: `${BUTTON} aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-white`,
  },
  text: {
    eyebrow:
      'text-[11px] font-semibold tracking-normal text-zinc-400 uppercase',
    statLabelIcon: `flex items-center gap-1.5 ${STAT_LABEL}`,
    // Etiqueta compacta de la tarjeta fullscreen: sin tracking
    // extra para que "VELOCIDAD" quepa en su columna.
    statLabelCompact:
      'truncate text-[8px] font-semibold tracking-normal text-zinc-400 uppercase',
    valueTimer: `text-4xl leading-none ${VALUE}`,
    valueTopbar: `mt-0.5 text-xl leading-tight ${VALUE}`,
    valueSmall: `text-sm leading-tight ${VALUE}`,
    meta: 'mt-1 font-mono text-sm font-semibold',
    metaAccent: 'text-orange-500',
  },
  icon: {
    alert: 'h-7 w-7 shrink-0 text-orange-500',
    xs: 'h-3.5 w-3.5',
    topbarAccent: 'h-4 w-4 text-orange-500',
    topbarActive: 'h-4 w-4 text-white',
  },
} as const;
