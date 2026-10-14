/**
 * Application header.
 * Category: Layout Component
 *
 * Responsible for:
 * - Rendering the main navigation.
 * - Displaying application branding.
 * - Displaying global user actions.
 *
 * Does not:
 * - Implement authentication logic.
 * - Perform API requests directly.
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';
import { useLanguage } from '../../../locales/useLanguage';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface HeaderProps {
  onOpenDrawer: () => void;
}

export function Header({ onOpenDrawer }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setIsDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur-md md:px-8">
      {/* Left section: Drawer toggle button */}
      <button
        type="button"
        onClick={onOpenDrawer}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white focus:outline-none"
        aria-label="Open sidebar menu"
      >
        <span className="text-xl leading-none">☰</span>
      </button>

      {/* Center section: Brand title */}
      <Link
        to="/lobby"
        className="text-lg font-extrabold tracking-wider text-orange-400 md:text-xl"
      >
        {t('app.title') || 'Kitchen Mayhem'}
      </Link>

      {/* Right section: Language switcher and user profile dropdown */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        {/* User avatar menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full p-0.5 transition-all hover:ring-2 hover:ring-orange-500/60 focus:outline-none"
            aria-label="User menu"
          >
            <img
              src={user?.avatarUrl || '/default-chef.png'}
              alt={user?.username || 'Avatar'}
              className="h-full w-full rounded-full border border-zinc-700 bg-zinc-800 object-cover"
              onError={(e) => {
                // Fallback icon if image fails to load
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><text y="18" font-size="16">👨‍🍳</text></svg>';
              }}
            />
          </button>

          {/* Contextual dropdown panel */}
          {isDropdownOpen && (
            <div className="animate-in fade-in absolute right-0 z-50 mt-2 w-48 rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 shadow-2xl duration-150">
              <div className="border-b border-zinc-800 px-4 py-2">
                <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  {t('app.connectedAs') || 'Logged in as'}
                </p>
                <p className="justify-center truncate text-sm font-bold text-white">
                  {user?.username || 'Chef'}
                </p>
              </div>

              {/* Profile navigation link */}
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <span>👤</span>
                <span>{t('app.profile') || 'Profile'}</span>
              </Link>

              {/* Logout action */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
              >
                <span>🚪</span>
                <span>{t('app.logout') || 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
