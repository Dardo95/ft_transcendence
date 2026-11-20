import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ChefHatIcon,
  GamepadIcon,
  PackageIcon,
  TrophyIcon,
  XIcon,
} from 'lucide-react';
import { useLanguage } from '../../../locales/useLanguage';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className={UI.overlay.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer slide-out panel */}
      <aside className={UI.overlay.drawerPanel}>
        <div className="flex flex-col gap-6">
          <div className="border-border flex items-center justify-between border-b pb-4">
            <h2 className="text-primary text-lg font-bold tracking-wider">
              {t('app.general.title') || 'ft_boomberman'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className={UI.nav.iconBtn}
              aria-label="Close navigation drawer"
            >
              <XIcon className={UI.icon.md} aria-hidden="true" />
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <Link to="/lobby" onClick={onClose} className={UI.nav.drawerLink}>
              <GamepadIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.lobby') || 'Lobby'}</span>
            </Link>
            <Link to="/stats" onClick={onClose} className={UI.nav.drawerLink}>
              <TrophyIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.stats') || 'Game Statistics'}</span>
            </Link>
            <Link to="/rules" onClick={onClose} className={UI.nav.drawerLink}>
              <BookOpenIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.aboutGame') || 'Rules'}</span>
            </Link>
            <Link to="/project" onClick={onClose} className={UI.nav.drawerLink}>
              <PackageIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.aboutProject') || 'Project'}</span>
            </Link>
            <Link
              to="/about-us"
              onClick={onClose}
              className={UI.nav.drawerLink}
            >
              <ChefHatIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.aboutUs') || 'About Us'}</span>
            </Link>
          </nav>
        </div>
      </aside>
    </div>
  );
}
