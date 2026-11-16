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
const FOOTER_NAV = 'flex flex-wrap items-center justify-center gap-6 gap-y-2';
const DRAWER_PANEL =
  'relative z-10 flex w-72 max-w-[80vw] flex-col justify-between border-r border-border bg-background p-6 shadow-2xl';
const NAV_LINK =
  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground';
const NAV_LINK_ACTIVE = 'bg-muted text-foreground';
const NAV_ICON_BTN =
  'text-muted-foreground hover:bg-muted hover:text-foreground';
const FOOTER_LINK = 'hover:text-foreground transition-colors';
const LOGO_IMAGE = 'cursor-pointer object-contain';

/* Surfaces */
const CARD_BASE =
  'rounded-2xl border border-border bg-card/90 text-card-foreground shadow-lg backdrop-blur-sm';
const HEADER_CARD = `${CARD_BASE} p-6 text-center shadow-xl sm:p-8`;
const SECTION_CARD = `${CARD_BASE} p-6 transition-colors hover:border-input`;
const SECTION_CARD_LARGE = `${SECTION_CARD} sm:p-8`;
const HIGHLIGHT_CARD = `${CARD_BASE} p-5`;
const INNER_BOX = 'rounded-xl border border-border/80 bg-background/60';
const INNER_BOX_PADDED = `${INNER_BOX} p-3.5`;
const INTERACTIVE_CARD = `${CARD_BASE} transition-colors hover:border-input hover:bg-card`;
const PROFILE_ROW = 'rounded-xl border border-border/80 bg-background/60 p-3.5';
const LOBBY_ROW = 'rounded-xl border border-input bg-background/40 p-2.5';
const INCOMING_CARD =
  'space-y-2 rounded-lg border border-input bg-background/40 p-3 text-foreground shadow-xl';
const INCOMING_CARD_PROFILE = `space-y-2 p-3.5 text-foreground ${INNER_BOX}`;

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
const TYPE_BADGE =
  'inline-block rounded border px-2 py-0.5 text-xs font-semibold';
const STATUS_PILL =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold';
const STATUS_ONLINE = 'border-success/40 bg-success/15 text-success-foreground';
const STATUS_OFFLINE = 'border-input bg-secondary text-muted-foreground';

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
const FORM_TITLE =
  'text-foreground text-xl font-bold tracking-tight sm:text-2xl';
const FORM_SUBTITLE = 'text-muted-foreground mt-1 text-sm';
const HINT_TEXT =
  'text-muted-foreground text-[0.68rem] font-medium tracking-normal';
const OPTION_HINT =
  'text-muted-foreground mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug';
const EYEBROW_TEXT =
  'text-muted-foreground block text-[0.65rem] font-extrabold tracking-[0.19em]';
const CENTER_TEXT = 'text-center text-sm';
const MUTED_TEXT = 'text-muted-foreground text-sm';
const SMALL_MUTED_TEXT = 'text-muted-foreground text-xs';
const VALUE_TEXT = 'mt-1 text-sm font-semibold break-all';

/* Lists & highlights */
const BULLET_LIST = 'mt-4 space-y-2 border-t border-border/80 pt-4';
const BULLET_ITEM =
  'flex items-start gap-2.5 text-xs leading-relaxed text-secondary-foreground sm:text-sm';
const BULLET_ICON = 'mt-0.5 size-4 shrink-0 text-primary';
const HIGHLIGHT_HEADER = 'mb-2.5 flex items-center gap-2 text-primary';
const HIGHLIGHT_TITLE =
  'text-xs font-bold tracking-wider text-foreground uppercase';
const FRIEND_LIST_SCROLL = 'flex flex-col gap-2 overflow-y-auto pr-1';
const SUBLABEL_ROW = `flex items-center gap-2 ${SECTION_SUBLABEL}`;
const FRIEND_TITLE_LOBBY = SUBLABEL_ROW;
const FRIEND_TITLE_PROFILE = `flex items-center gap-2 ${SECTION_TITLE}`;

/* Feedback */
const ALERT_ERROR =
  'rounded-xl border border-destructive/35 bg-destructive/15 px-3.5 py-3 text-[0.78rem] text-destructive-foreground';
const ALERT_SUCCESS =
  'rounded-xl border border-success/35 bg-success/15 px-3.5 py-3 text-[0.78rem] text-success-foreground';
const ALERT_BANNER =
  'flex w-full items-center justify-center text-center font-semibold';
const STATUS_DOT = 'inline-block size-2 shrink-0 rounded-full';

/* Tables */
const TABLE_WRAPPER = 'overflow-x-auto';
const TABLE_BASE = 'w-full text-left text-sm';
const TABLE_HEAD =
  'border-b border-border bg-background/60 text-xs tracking-wider text-muted-foreground uppercase';
const TABLE_ROW = 'align-top transition-colors hover:bg-muted/40';
const TABLE_CELL = 'px-4 py-3';
const TABLE_CELL_RIGHT = `${TABLE_CELL} text-right`;
const TABLE_DIVIDER_LIST = 'divide-border/60 divide-y';

/* Avatars & media */
const AVATAR_BASE =
  'shrink-0 rounded-full border border-input bg-secondary object-cover';
const AVATAR_SM = `${AVATAR_BASE} h-7 w-7`;
const AVATAR_MD = `${AVATAR_BASE} h-8 w-8`;
const AVATAR_LG = `${AVATAR_BASE} size-10`;
const AVATAR_FULL = 'size-full object-cover';
const AVATAR_STATUS_DOT = 'border-background absolute rounded-full border-2';

/* Navigation, overlays, rows, actions */
const OVERLAY_BACKDROP =
  'fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity';
const ROW_ITEM =
  'flex items-center justify-between gap-2 rounded-lg p-2 transition-colors';
const ROW_INTERACTIVE = 'transition-colors hover:bg-muted/40';
const ROW_HEADER =
  'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between';
const ROW_ACTIONS = 'flex gap-2';
const ROW_SECTION_LABEL =
  'text-primary mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider';
const STACK = 'grid min-w-0 content-start gap-4';
const GRID_THREE_TIGHT = 'grid grid-cols-1 gap-2.5 sm:grid-cols-3';
const DETAIL_GRID = 'mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

/* Buttons, chips & interactive option tiles */
const BTN_PRIMARY = 'bg-primary text-primary-foreground hover:bg-primary/80';
const BTN_SECONDARY = 'bg-muted text-muted-foreground';
const BTN_GHOST = 'text-muted-foreground hover:text-foreground';
const BTN_DANGER =
  'text-destructive hover:bg-destructive/10 hover:text-destructive';
const BTN_SUCCESS = 'bg-success text-success-foreground hover:bg-success/80';
const BTN_CHIP =
  'h-7 shrink-0 px-3 text-[11px] font-semibold transition-colors';
const BTN_SUBMIT = 'h-10 w-full cursor-pointer';
const BTN_OAUTH = 'h-10 w-full gap-2.5 text-sm font-semibold';
const BTN_LINK = 'h-auto p-0 font-semibold';
const BTN_TAB =
  'relative flex-1 cursor-pointer pb-3 text-xs font-bold transition-all sm:text-sm';
const BTN_TAB_ACTIVE =
  'text-primary after:bg-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full';
const BTN_TAB_INACTIVE =
  'text-muted-foreground hover:text-secondary-foreground';
const BTN_ACTION = 'px-4 py-3 text-[0.68rem] font-black tracking-wider';
const BTN_SM_SAVE = 'gap-1.5 text-xs font-semibold';
const BTN_SM_GHOST = 'gap-1.5 text-xs';
const BTN_ICON_GHOST = 'text-muted-foreground hover:text-primary';
const BTN_ICON_DANGER =
  'text-muted-foreground hover:text-destructive h-7 w-7 cursor-pointer p-0 text-xs';
const BTN_OPTION =
  'text-foreground hover:border-primary/50 min-w-0 cursor-pointer rounded-xl border text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0';
const BTN_OPTION_ACTIVE =
  'border-primary bg-primary/10 shadow-[inset_0_0_0_1px_var(--primary)]';
const SOCIAL_LINK =
  'flex items-center gap-2 rounded-lg border border-input bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground';

/* Forms */
const FORM_CONTAINER = 'mx-auto w-full max-w-sm';
const INPUT_ICON =
  'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2';
const INPUT_WITH_ICON = 'h-10 pl-9';
const INPUT_WITH_ICONS = 'h-10 pr-10 pl-9';
const FORM_DIVIDER = 'relative my-5 flex items-center';
const FORM_DIVIDER_LINE = 'border-border grow border-t';
const FORM_DIVIDER_LABEL =
  'text-muted-foreground mx-3 shrink text-sm uppercase';
const FORM_LABEL = `block ${SECTION_SUBLABEL}`;

/* Icon sizing */
const ICON_XS = 'size-3.5';
const ICON_SM = 'size-4';
const ICON_MD = 'size-5';
const ICON_LG = 'size-8';
const ICON_SPINNER = 'animate-spin';

/* components/ui primitives */
const UI_CARD = `group/card flex flex-col overflow-hidden ${CARD_BASE} text-sm`;
const UI_INPUT =
  'h-9 w-full min-w-0 rounded-lg border border-input bg-background/60 px-2.5 py-1 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
const UI_TEXTAREA =
  'flex min-h-16 w-full field-sizing-content rounded-lg border border-input bg-background/60 px-2.5 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
const UI_BUBBLE =
  'w-fit max-w-[85%] rounded-2xl px-3.5 py-1 text-xs break-words shadow-sm transition-all';
const UI_BUBBLE_GROUP = 'flex min-w-0 flex-col gap-2';
const UI_MESSAGE_GROUP = UI_BUBBLE_GROUP;
const UI_MESSAGE_META =
  'text-muted-foreground flex max-w-full min-w-0 items-center px-3 text-xs font-medium group-has-data-[variant=ghost]/message:px-0';
const UI_BUBBLE_CONTENT = 'leading-relaxed';
const UI_DIALOG_OVERLAY = `${OVERLAY_BACKDROP} z-50`;
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
    bootScreen: 'bg-background fixed inset-0',
    stack: STACK,
    grid2: 'grid grid-cols-1 gap-6 sm:grid-cols-2',
    grid3: 'grid grid-cols-1 gap-4 sm:grid-cols-3',
    grid3Tight: GRID_THREE_TIGHT,
    detailGrid: DETAIL_GRID,
  },
  chrome: {
    appFrame: APP_FRAME,
    publicFrame: PUBLIC_FRAME,
    header: HEADER_CHROME,
    footer: FOOTER_CHROME,
    footerNav: FOOTER_NAV,
    drawer: DRAWER_PANEL,
    navLink: NAV_LINK,
    dropdown:
      'animate-in fade-in absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-surface-elevated py-1.5 shadow-2xl duration-150',
    dropdownItem:
      'flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground',
    logo: LOGO_IMAGE,
  },
  nav: {
    link: NAV_LINK,
    linkActive: NAV_LINK_ACTIVE,
    drawerLink: NAV_LINK,
    iconBtn: NAV_ICON_BTN,
    footerLink: FOOTER_LINK,
  },
  overlay: {
    backdrop: OVERLAY_BACKDROP,
    modalCard: UI_DIALOG_CONTENT,
    drawerPanel: DRAWER_PANEL,
  },
  card: {
    base: CARD_BASE,
    header: HEADER_CARD,
    section: SECTION_CARD,
    sectionLarge: SECTION_CARD_LARGE,
    highlight: HIGHLIGHT_CARD,
    inner: INNER_BOX,
    innerPadded: INNER_BOX_PADDED,
    interactive: INTERACTIVE_CARD,
    profileRow: PROFILE_ROW,
    lobbyRow: LOBBY_ROW,
    incoming: INCOMING_CARD,
    incomingProfile: INCOMING_CARD_PROFILE,
    friendLobby: 'flex flex-col gap-3 p-5',
    friendProfile: 'flex flex-col gap-4 p-6 sm:p-8',
  },
  badge: {
    pill: PILL_BADGE,
    header: HEADER_BADGE,
    metaRow: META_ROW,
    metaPill: META_PILL,
    metaLink: META_LINK,
    tag: TAG_CHIP,
    type: TYPE_BADGE,
    status: STATUS_PILL,
    statusOnline: STATUS_ONLINE,
    statusOffline: STATUS_OFFLINE,
  },
  text: {
    pageTitle: PAGE_TITLE,
    pageSubtitle: PAGE_SUBTITLE,
    sectionTitle: SECTION_TITLE,
    sublabel: SECTION_SUBLABEL,
    body: SECTION_TEXT,
    formTitle: FORM_TITLE,
    formSubtitle: FORM_SUBTITLE,
    hint: HINT_TEXT,
    optionHint: OPTION_HINT,
    eyebrow: EYEBROW_TEXT,
    center: CENTER_TEXT,
    muted: MUTED_TEXT,
    small: SMALL_MUTED_TEXT,
    value: VALUE_TEXT,
    friendTitleLobby: FRIEND_TITLE_LOBBY,
    friendTitleProfile: FRIEND_TITLE_PROFILE,
    sublabelRow: SUBLABEL_ROW,
  },
  list: {
    ul: BULLET_LIST,
    li: BULLET_ITEM,
    icon: BULLET_ICON,
    highlightHeader: HIGHLIGHT_HEADER,
    highlightTitle: HIGHLIGHT_TITLE,
    friendsScroll: FRIEND_LIST_SCROLL,
    friendsScrollShort: 'max-h-64',
    friendsScrollTall: 'max-h-96',
  },
  form: {
    stack: 'space-y-3',
    fieldGroup: 'flex w-full flex-col gap-5',
    container: FORM_CONTAINER,
    label: FORM_LABEL,
    inputIcon: INPUT_ICON,
    inputWithIcon: INPUT_WITH_ICON,
    inputWithIcons: INPUT_WITH_ICONS,
    divider: FORM_DIVIDER,
    dividerLine: FORM_DIVIDER_LINE,
    dividerLabel: FORM_DIVIDER_LABEL,
  },
  feedback: {
    error: ALERT_ERROR,
    success: ALERT_SUCCESS,
    banner: ALERT_BANNER,
    dot: STATUS_DOT,
  },
  table: {
    wrapper: TABLE_WRAPPER,
    base: TABLE_BASE,
    head: TABLE_HEAD,
    row: TABLE_ROW,
    cell: TABLE_CELL,
    cellRight: TABLE_CELL_RIGHT,
    dividerList: TABLE_DIVIDER_LIST,
  },
  avatar: {
    sm: AVATAR_SM,
    md: AVATAR_MD,
    lg: AVATAR_LG,
    full: AVATAR_FULL,
    statusDot: AVATAR_STATUS_DOT,
    fallback:
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-input bg-secondary text-xs font-bold text-muted-foreground',
  },
  row: {
    item: ROW_ITEM,
    interactive: ROW_INTERACTIVE,
    header: ROW_HEADER,
    actions: ROW_ACTIONS,
    sectionLabel: ROW_SECTION_LABEL,
    dividerList: TABLE_DIVIDER_LIST,
    friendHeaderLobby:
      'flex items-center justify-between border-b border-border pb-2',
    friendHeaderProfile:
      'flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4',
  },
  btn: {
    primary: BTN_PRIMARY,
    secondary: BTN_SECONDARY,
    ghost: BTN_GHOST,
    danger: BTN_DANGER,
    success: BTN_SUCCESS,
    chip: BTN_CHIP,
    chipActive: BTN_PRIMARY,
    submit: BTN_SUBMIT,
    oauth: BTN_OAUTH,
    link: BTN_LINK,
    tab: BTN_TAB,
    tabActive: BTN_TAB_ACTIVE,
    tabInactive: BTN_TAB_INACTIVE,
    action: BTN_ACTION,
    smSave: BTN_SM_SAVE,
    smGhost: BTN_SM_GHOST,
    iconGhost: BTN_ICON_GHOST,
    iconDanger: BTN_ICON_DANGER,
    option: BTN_OPTION,
    optionActive: BTN_OPTION_ACTIVE,
    social: SOCIAL_LINK,
  },
  icon: {
    xs: ICON_XS,
    sm: ICON_SM,
    md: ICON_MD,
    lg: ICON_LG,
    spinner: ICON_SPINNER,
  },
  ui: {
    card: UI_CARD,
    input: UI_INPUT,
    textarea: UI_TEXTAREA,
    bubble: UI_BUBBLE,
    bubbleGroup: UI_BUBBLE_GROUP,
    messageGroup: UI_MESSAGE_GROUP,
    messageMeta: UI_MESSAGE_META,
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
