/**
 * Theme-bound layout and surface tokens wired to CSS custom properties in src/index.css.
 * Shared semantic Tailwind tokens for functional views.
 * Plain strings only: no wrapper components, no stylesheets.
 * Composition is intentional so editing a base token updates every variant.
 * Category: UI Design Tokens
 */

/* Containers */
export const PAGE_SHELL = 'flex w-full justify-center px-4 py-4 md:py-8';
export const PAGE_CONTAINER = 'w-full max-w-5xl space-y-8';
export const PAGE_CONTAINER_COMPACT = 'w-full max-w-4xl space-y-8';

/* Surfaces */
export const CARD =
  'rounded-2xl border border-border bg-card/90 text-card-foreground shadow-lg backdrop-blur-sm';
export const HEADER_CARD = `${CARD} p-6 text-center shadow-xl sm:p-8`;
export const SECTION_CARD = `${CARD} p-6 transition-colors hover:border-input`;
export const HIGHLIGHT_CARD = `${CARD} p-5`;
export const INNER_BOX = 'rounded-xl border border-border/80 bg-background/60';

/* Badges & pills */
export const PILL_BADGE =
  'inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary';
export const HEADER_BADGE = `mb-2 ${PILL_BADGE}`;
export const META_ROW =
  'mt-5 flex flex-wrap items-center justify-center gap-3 text-xs';
export const META_PILL =
  'rounded-lg border border-input bg-secondary/80 px-3 py-1.5 font-medium text-secondary-foreground';
export const META_LINK =
  'inline-flex items-center gap-1.5 rounded-lg border border-input bg-secondary/80 px-3 py-1.5 font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-secondary';
export const TAG_CHIP =
  'inline-flex items-center rounded-full border border-input bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground';

/* Typography */
export const PAGE_TITLE =
  'mb-3 font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl';
export const PAGE_SUBTITLE =
  'mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm';
export const SECTION_TITLE =
  'mb-2.5 font-heading text-lg font-bold text-foreground';
export const SECTION_SUBLABEL =
  'text-[11px] font-semibold tracking-wider text-muted-foreground uppercase';
export const SECTION_TEXT =
  'text-xs leading-relaxed text-secondary-foreground sm:text-sm';

/* Lists & highlights */
export const BULLET_LIST = 'mt-4 space-y-2 border-t border-border/80 pt-4';
export const BULLET_ITEM =
  'flex items-start gap-2.5 text-xs leading-relaxed text-secondary-foreground sm:text-sm';
export const BULLET_ICON = 'mt-0.5 size-4 shrink-0 text-primary';
export const HIGHLIGHT_HEADER = 'mb-2.5 flex items-center gap-2 text-primary';
export const HIGHLIGHT_TITLE =
  'text-xs font-bold tracking-wider text-foreground uppercase';

/* Feedback */
export const ALERT_ERROR =
  'rounded-xl border border-destructive/35 bg-destructive/15 px-3.5 py-3 text-[0.78rem] text-destructive-foreground';
export const ALERT_SUCCESS =
  'rounded-xl border border-success/35 bg-success/15 px-3.5 py-3 text-[0.78rem] text-success-foreground';
export const STATUS_DOT = 'inline-block size-2 shrink-0 rounded-full';

/* Tables */
export const TABLE_WRAPPER = 'overflow-x-auto';
export const TABLE_BASE = 'w-full text-left text-sm';
export const TABLE_HEAD =
  'border-b border-border bg-background/60 text-xs tracking-wider text-muted-foreground uppercase';
export const TABLE_ROW = 'align-top transition-colors hover:bg-muted/40';
