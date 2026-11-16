/**
 * Theme-bound UI design tokens wired to the rgba() CSS variables in src/index.css.
 * Plain Tailwind strings only: no wrapper components, no stylesheets.
 * Every visual surface resolves through the semantic tokens mapped in @theme inline
 * so pages and primitives share one source of truth.
 * Category: UI Design Tokens
 */

/* Application chrome */
const APP_FRAME =
  'flex min-h-screen flex-col justify-between bg-background font-sans text-foreground';
const PUBLIC_FRAME = `relative ${APP_FRAME} overflow-x-hidden`;
const HEADER_CHROME =
  'sticky top-0 z-40 flex w-full items-center justify-between border-b border-border bg-background/90 py-3 backdrop-blur-md md:px-4';
const FOOTER_CHROME =
  'z-10 w-full border-t border-border bg-background/80 py-4 text-center text-sm text-muted-foreground backdrop-blur-sm';

/* Surfaces */
const CARD_BASE =
  'rounded-2xl border border-border bg-card/90 text-card-foreground shadow-lg backdrop-blur-sm';
const HEADER_CARD = `${CARD_BASE} p-6 text-center shadow-xl sm:p-8`;
const SECTION_CARD = `${CARD_BASE} p-6 transition-colors hover:border-input`;
const HIGHLIGHT_CARD = `${CARD_BASE} p-5`;
const INNER_BOX = 'rounded-xl border border-border/80 bg-background/60';
const INTERACTIVE_CARD = `${CARD_BASE} transition-colors hover:border-input hover:bg-card`;

/* Badges & pills */
const PILL_BADGE =
  'inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase';
const HEADER_BADGE = `mb-2 self-center ${PILL_BADGE}`;
const META_ROW =
  'mt-5 flex flex-wrap items-center justify-center gap-3 text-xs';
const META_PILL =
  'rounded-lg border border-input bg-secondary/80 px-3 py-1.5 font-medium text-secondary-foreground';
const META_LINK =
  'inline-flex items-center gap-1.5 rounded-lg border border-input bg-secondary/80 px-3 py-1.5 font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-secondary';
const TAG_CHIP =
  'inline-flex items-center rounded-full border border-input bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground';

/* Typography */
const PAGE_TITLE =
  'mb-3 font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl';
const PAGE_SUBTITLE =
  'mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm';
const SECTION_TITLE = 'mb-2.5 font-heading text-lg font-bold text-foreground';
const SECTION_SUBLABEL =
  'text-[11px] font-semibold tracking-wider text-muted-foreground uppercase';
const SECTION_TEXT =
  'text-xs leading-relaxed text-secondary-foreground sm:text-sm';

/* Lists & highlights */
const BULLET_LIST = 'mt-4 space-y-2 border-t border-border/80 pt-4';
const BULLET_ITEM =
  'flex items-start gap-2.5 text-xs leading-relaxed text-secondary-foreground sm:text-sm';
const BULLET_ICON = 'mt-0.5 size-4 shrink-0 text-primary';
const HIGHLIGHT_HEADER = 'mb-2.5 flex items-center gap-2 text-primary';
const HIGHLIGHT_TITLE =
  'text-xs font-bold tracking-wider text-foreground uppercase';

/* Feedback */
const ALERT_ERROR =
  'rounded-xl border border-destructive/35 bg-destructive/15 px-3.5 py-3 text-[0.78rem] text-destructive-foreground';
const ALERT_SUCCESS =
  'rounded-xl border border-success/35 bg-success/15 px-3.5 py-3 text-[0.78rem] text-success-foreground';
const STATUS_DOT = 'inline-block size-2 shrink-0 rounded-full';

/* Tables */
const TABLE_WRAPPER = 'overflow-x-auto';
const TABLE_BASE = 'w-full text-left text-sm';
const TABLE_HEAD =
  'border-b border-border bg-background/60 text-xs tracking-wider text-muted-foreground uppercase';
const TABLE_ROW = 'align-top transition-colors hover:bg-muted/40';
const TABLE_CELL = 'px-4 py-3';

/* components/ui primitives */
const UI_CARD = `group/card flex flex-col overflow-hidden ${CARD_BASE} text-sm`;
const UI_INPUT =
  'h-9 w-full min-w-0 rounded-lg border border-input bg-background/60 px-2.5 py-1 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
const UI_TEXTAREA =
  'flex min-h-16 w-full field-sizing-content rounded-lg border border-input bg-background/60 px-2.5 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
const UI_BUBBLE =
  'w-fit max-w-[85%] rounded-2xl px-3.5 py-1 text-xs break-words shadow-sm transition-all';
const UI_BUBBLE_GROUP = 'flex min-w-0 flex-col gap-2';
const UI_BUBBLE_CONTENT = 'leading-relaxed';
const UI_DIALOG_OVERLAY =
  'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm';
const UI_DIALOG_CONTENT =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl outline-none';
const UI_DIALOG_HEADER = 'flex flex-col gap-1.5 text-center sm:text-left';
const UI_DIALOG_TITLE = 'font-heading text-lg font-semibold text-foreground';
const UI_DIALOG_DESCRIPTION = 'text-sm text-muted-foreground';
const UI_DIALOG_FOOTER =
  'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end';
const UI_LABEL =
  'flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none';

/**
 * Single grouped token object. Import once per file: `import { UI } from ...`.
 */
export const UI = {
  shell: {
    page: 'flex w-full justify-center px-4 py-4',
    container: 'w-full max-w-5xl space-y-8',
    containerCompact: 'w-full max-w-4xl space-y-8',
    grid2: 'grid grid-cols-1 gap-6 sm:grid-cols-2',
    grid3: 'grid grid-cols-1 gap-4 sm:grid-cols-3',
  },
  chrome: {
    appFrame: APP_FRAME,
    publicFrame: PUBLIC_FRAME,
    header: HEADER_CHROME,
    footer: FOOTER_CHROME,
    drawer:
      'relative z-10 flex w-72 max-w-[80vw] flex-col justify-between border-r border-border bg-background p-6 shadow-2xl',
    navLink:
      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground',
    dropdown:
      'animate-in fade-in absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-card py-1.5 shadow-2xl duration-150',
    dropdownItem:
      'flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground',
  },
  card: {
    base: CARD_BASE,
    header: HEADER_CARD,
    section: SECTION_CARD,
    highlight: HIGHLIGHT_CARD,
    inner: INNER_BOX,
    interactive: INTERACTIVE_CARD,
  },
  badge: {
    pill: PILL_BADGE,
    header: HEADER_BADGE,
    metaRow: META_ROW,
    metaPill: META_PILL,
    metaLink: META_LINK,
    tag: TAG_CHIP,
  },
  text: {
    pageTitle: PAGE_TITLE,
    pageSubtitle: PAGE_SUBTITLE,
    sectionTitle: SECTION_TITLE,
    sublabel: SECTION_SUBLABEL,
    body: SECTION_TEXT,
  },
  list: {
    ul: BULLET_LIST,
    li: BULLET_ITEM,
    icon: BULLET_ICON,
    highlightHeader: HIGHLIGHT_HEADER,
    highlightTitle: HIGHLIGHT_TITLE,
  },
  form: {
    stack: 'space-y-3',
    fieldGroup: 'flex w-full flex-col gap-5',
  },
  feedback: {
    error: ALERT_ERROR,
    success: ALERT_SUCCESS,
    dot: STATUS_DOT,
  },
  table: {
    wrapper: TABLE_WRAPPER,
    base: TABLE_BASE,
    head: TABLE_HEAD,
    row: TABLE_ROW,
    cell: TABLE_CELL,
  },
  ui: {
    card: UI_CARD,
    input: UI_INPUT,
    textarea: UI_TEXTAREA,
    bubble: UI_BUBBLE,
    bubbleGroup: UI_BUBBLE_GROUP,
    bubbleContent: UI_BUBBLE_CONTENT,
    dialogOverlay: UI_DIALOG_OVERLAY,
    dialogContent: UI_DIALOG_CONTENT,
    dialogHeader: UI_DIALOG_HEADER,
    dialogTitle: UI_DIALOG_TITLE,
    dialogDescription: UI_DIALOG_DESCRIPTION,
    dialogFooter: UI_DIALOG_FOOTER,
    label: UI_LABEL,
  },
} as const;
