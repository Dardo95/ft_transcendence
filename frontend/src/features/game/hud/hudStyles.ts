/**
 * Design tokens del HUD de partida (topbar, sidebar y overlay
 * de pantalla completa), con el mismo patrón que
 * components/layout/layoutStyles.ts: strings Tailwind planos,
 * sin componentes wrapper ni hojas de estilos. El HUD vuela
 * sobre el canvas oscuro, así que mantiene la paleta fija
 * zinc/amber en lugar de los tokens semánticos del tema (UI).
 * Category: Game HUD Design Tokens
 */

/* Superficies */
const PANEL = 'rounded-lg border border-zinc-800 bg-zinc-900/90 shadow-lg';
const ROW = 'rounded-md border border-zinc-800 bg-zinc-950/70';

/* Controles del topbar */
const BUTTON =
  'h-9 gap-2 rounded-md border-1 border-zinc-800 bg-zinc-900 px-4 font-black text-zinc-400 transition-none hover:border-zinc-800 hover:bg-zinc-800 hover:text-white focus:ring-0 focus-visible:ring-0';

/* Tipografía */
const SECTION_TITLE = 'text-[11px] font-semibold text-zinc-400 uppercase';
const STAT_LABEL =
  'text-[10px] font-semibold tracking-widest text-zinc-400 uppercase';
const STAT_LABEL_SMALL =
  'text-[10px] font-semibold tracking-widest text-zinc-400 uppercase';
const VALUE = 'font-mono font-bold text-zinc-100 uppercase';

export const HUD = {
  surface: {
    topbar: `shrink-0 px-4 py-3 text-zinc-100 ${PANEL}`,
    section: `p-3 text-zinc-100 ${PANEL}`,
    playerCard: `w-56 px-3 py-2 text-zinc-100 ${PANEL}`,
    timerBox: `px-6 py-2 text-center ${PANEL}`,
    alert:
      'flex flex-col items-center rounded-xl bg-zinc-950/90 px-8 py-4 text-center shadow-xl',
    rowPlayer: `flex items-center gap-2.5 px-2.5 py-2 ${ROW}`,
    statBox: `px-1 py-2 text-center ${ROW}`,
    statBoxTight: `min-w-0 px-1 py-1 text-center ${ROW}`,
    statGrid: 'mt-2 grid grid-cols-3 gap-2',
    statGridTight: 'mt-2 grid grid-cols-3 gap-1.5',
    list: 'mt-2 flex flex-col gap-1.5',
    divider:
      'mt-3 flex flex-wrap gap-x-8 gap-y-2 border-t border-zinc-800 pt-3',
    legendThumb:
      'h-5 w-5 shrink-0 rounded-sm border border-zinc-800 object-cover',
    avatarBox:
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
  },
  button: {
    base: BUTTON,
    active: `${BUTTON} aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-white`,
  },
  text: {
    eyebrow:
      'text-[11px] font-semibold tracking-normal text-zinc-400 uppercase',
    sectionTitle: SECTION_TITLE,
    sectionTitleIcon: `flex items-center gap-2 ${SECTION_TITLE}`,
    statLabelIcon: `flex items-center gap-1.5 ${STAT_LABEL}`,
    statLabelSmall: STAT_LABEL_SMALL,
    // Etiqueta compacta de la tarjeta fullscreen: sin tracking
    // extra para que "VELOCIDAD" quepa en su columna.
    statLabelCompact:
      'truncate text-[8px] font-semibold tracking-normal text-zinc-400 uppercase',
    value: VALUE,
    valueTimer: `text-4xl leading-none ${VALUE}`,
    valueTopbar: `mt-0.5 text-xl leading-tight ${VALUE}`,
    valueSection: `text-lg leading-tight ${VALUE}`,
    valueSmall: `text-sm leading-tight ${VALUE}`,
    valueCompact: `text-sm ${VALUE}`,
    meta: 'mt-1 font-mono text-sm font-semibold',
    metaAccent: 'text-orange-500',
    name: 'block truncate text-xs font-semibold',
    nameOut: 'block truncate text-xs font-semibold line-through',
    you: 'text-[10px] font-semibold tracking-wider text-orange-500 uppercase',
    legendItem: 'flex items-center gap-2.5 text-xs',
    legendLabel: 'text-zinc-300',
  },
  icon: {
    section: 'h-4 w-4',
    alert: 'h-7 w-7 shrink-0 text-orange-500',
    xs: 'h-3.5 w-3.5',
    alive: 'h-3 w-3 shrink-0 fill-emerald-400 text-emerald-400',
    down: 'h-3.5 w-3.5 shrink-0 text-zinc-600',
    topbarAccent: 'h-4 w-4 text-orange-500',
    topbarActive: 'h-4 w-4 text-white',
  },
} as const;
