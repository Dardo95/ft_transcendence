import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  ChefHatIcon,
  GamepadIcon,
  PackageIcon,
  // TrophyIcon,
  XIcon,
} from 'lucide-react';
import { useLanguage } from '../../../locales/useLanguage';
import { useMatchGuardStore } from '../../../features/game/store/useMatchGuardStore';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const requestGuard = useMatchGuardStore((state) => state.request);
  const abandon = useMatchGuardStore((state) => state.abandon);

  if (!isOpen) return null;

  // Salir de una partida pide confirmación (GAME-F-17);
  const guardLink =
    (to: string) =>
    (event: MouseEvent<HTMLAnchorElement>): void => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      onClose();
      requestGuard({ abandon, proceed: () => navigate(to) });
    };

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
            <h2 className="text-primary text-lg font-bold">
              {t('app.general.title') || 'ft_bomberman'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className={UI.nav.iconBtn}
              aria-label={t('app.general.closeMenu') || 'Close navigation menu'}
            >
              <XIcon className={UI.icon.md} aria-hidden="true" />
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/lobby"
              onClick={guardLink('/lobby')}
              className={UI.nav.drawerLink}
            >
              <GamepadIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.lobby.lobbyTitle') || 'Lobby'}</span>
            </Link>

            {/* <Link to="/stats" onClick={onClose} className={UI.nav.drawerLink}>
              <TrophyIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.stats') || 'Game Statistics'}</span>
            </Link> */}
            <Link
              to="/rules"
              onClick={guardLink('/rules')}
              className={UI.nav.drawerLink}
            >
              <BookOpenIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.aboutGame') || 'Rules'}</span>
            </Link>

            <Link
              to="/project"
              onClick={guardLink('/project')}
              className={UI.nav.drawerLink}
            >
              <PackageIcon className={UI.icon.sm} aria-hidden="true" />
              <span>{t('app.general.aboutProject') || 'Project'}</span>
            </Link>

            <Link
              to="/about-us"
              onClick={guardLink('/about-us')}
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
