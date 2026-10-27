import { Link } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer slide-out panel */}
      <div className="relative z-10 flex w-72 max-w-[80vw] flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold tracking-wider text-orange-400">
              {t('app.general.title') || 'ft_boomberman'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-lg font-bold text-zinc-400 hover:text-white"
              aria-label="Close navigation drawer"
            >
              ✕
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/lobby"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <span>🍳</span>
              <span>{t('app.lobby') || 'Lobby'}</span>
            </Link>
            <Link
              to="/stats"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <span>🏆</span>
              <span>{t('app.general.stats') || 'Game Statistics'}</span>
            </Link>
            <Link
              to="/rules"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <span>📖</span>
              <span>{t('app.general.aboutGame') || 'Rules'}</span>
            </Link>

            <Link
              to="/project"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <span>📦</span>
              <span>{t('app.general.aboutProject') || 'Project'}</span>
            </Link>

            <Link
              to="/about-us"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              <span>👨‍🍳</span>
              <span>{t('app.general.aboutUs') || 'About Us'}</span>
            </Link>
          </nav>
        </div>

        {/* Footer info inside drawer */}
        <div className="border-t border-zinc-900 pt-4 text-xs text-zinc-600">
          ft_transcendence — v1.0.0
        </div>
      </div>
    </div>
  );
}
