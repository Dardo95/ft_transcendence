/**
 * Shared semantic Tailwind tokens for functional views.
 * Plain strings only: no wrapper components, no stylesheets.
 * Composition is intentional so editing a base token updates every variant.
 */

/* Containers */
export const PAGE_SHELL = 'flex w-full justify-center px-4 py-4';
export const PAGE_CONTAINER = 'w-full max-w-5xl space-y-8';
export const PAGE_CONTAINER_COMPACT = 'w-full max-w-4xl space-y-8';

/* Surfaces */
export const CARD =
  'rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-lg backdrop-blur-sm';
export const HEADER_CARD = `${CARD} p-6 text-center shadow-xl sm:p-8`;
export const SECTION_CARD = `${CARD} p-6 transition-colors hover:border-zinc-700/80`;
export const HIGHLIGHT_CARD = `${CARD} p-5`;
export const INNER_BOX = 'rounded-xl border border-zinc-800/80 bg-zinc-950/60';

/* Badges & pills */
export const PILL_BADGE =
  'inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400';
export const HEADER_BADGE = `mb-2 ${PILL_BADGE}`;
export const META_ROW =
  'mt-5 flex flex-wrap items-center justify-center gap-3 text-xs';
export const META_PILL =
  'rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-medium text-zinc-300';
export const META_LINK =
  'inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 font-semibold text-orange-400 transition-colors hover:border-orange-500/40 hover:bg-zinc-800';
export const TAG_CHIP =
  'inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300';

/* Typography */
export const PAGE_TITLE =
  'mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl';
export const PAGE_SUBTITLE =
  'mx-auto max-w-3xl text-xs leading-relaxed text-zinc-400 sm:text-sm';
export const SECTION_TITLE = 'mb-2.5 text-lg font-bold text-white';
export const SECTION_SUBLABEL =
  'text-[11px] font-semibold tracking-wider text-zinc-400 uppercase';
export const SECTION_TEXT = 'text-xs leading-relaxed text-zinc-300 sm:text-sm';

/* Lists & highlights */
export const BULLET_LIST = 'mt-4 space-y-2 border-t border-zinc-800/80 pt-4';
export const BULLET_ITEM =
  'flex items-start gap-2.5 text-xs leading-relaxed text-zinc-300 sm:text-sm';
export const BULLET_ICON = 'mt-0.5 size-4 shrink-0 text-orange-400';
export const HIGHLIGHT_HEADER =
  'mb-2.5 flex items-center gap-2 text-orange-400';
export const HIGHLIGHT_TITLE =
  'text-xs font-bold tracking-wider text-white uppercase';

/* Feedback */
export const ALERT_ERROR =
  'rounded-xl border border-red-700/30 bg-red-900/15 px-3.5 py-3 text-[0.78rem] text-red-200';
export const ALERT_SUCCESS =
  'rounded-xl border border-emerald-700/25 bg-emerald-900/15 px-3.5 py-3 text-[0.78rem] text-emerald-200';
export const STATUS_DOT = 'inline-block size-2 shrink-0 rounded-full';

/* Tables */
export const TABLE_WRAPPER = 'overflow-x-auto';
export const TABLE_BASE = 'w-full text-left text-sm';
export const TABLE_HEAD =
  'border-b border-zinc-800 bg-zinc-950/60 text-xs tracking-wider text-zinc-400 uppercase';
export const TABLE_ROW = 'align-top transition-colors hover:bg-zinc-800/40';
