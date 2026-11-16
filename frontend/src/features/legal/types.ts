import type { LucideIcon } from 'lucide-react';

export interface LegalBullet {
  key: string;
  fallback: string;
}

export interface LegalSection {
  id: string;
  titleKey: string;
  defaultTitle: string;
  contentKey: string;
  defaultContent: string;
  bullets?: LegalBullet[];
}

export interface LegalHighlight {
  icon: LucideIcon;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
}

export interface LegalCrossLink {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  defaultLabel: string;
}

export interface LegalPageContent {
  badgeIcon: LucideIcon;
  badgeKey: string;
  defaultBadge: string;
  titleKey: string;
  defaultTitle: string;
  subtitleKey: string;
  defaultSubtitle: string;
  highlights?: LegalHighlight[];
  sections: LegalSection[];
  crossLink: LegalCrossLink;
}
