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
import { LogOutIcon, MenuIcon, UserIcon } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';
import { useLanguage } from '../../../locales/useLanguage';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';
import { LanguageSwitcher } from '../LanguageSwitcher';

import logoUrl from '@/assets/ui_logo.svg';
import defaultAvatar from '@/assets/default.jpg';

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    <header className={UI.chrome.header}>
      {/* Left section: Drawer toggle button */}
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={onOpenDrawer}
        className={UI.nav.iconBtn}
        aria-label="Open sidebar menu"
      >
        <MenuIcon className={UI.icon.md} aria-hidden="true" />
      </Button>

      {/* Center section: logo */}
      <div className="flex gap-2">
        <img
          src={logoUrl}
          alt="ft_bomberman Logo"
          className={`absolute top-1/2 left-1/2 m-0 h-12 -translate-x-1/2 -translate-y-1/2 ${UI.chrome.logo}`}
          onClick={() => navigate('/lobby')}
        />
      </div>

      {/* Right section: Language switcher and user profile dropdown */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        {/* User avatar menu */}
        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="hover:ring-primary/60 rounded-full p-0.5 hover:ring-2"
            aria-label="User menu"
          >
            <img
              src={user?.avatarUrl || defaultAvatar}
              alt={user?.username || 'Avatar'}
              className="border-input bg-secondary h-full w-full cursor-pointer rounded-full border object-cover"
              onError={(e) => {
                // Fallback icon if image fails to load (lucide chef-hat)
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="%23a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/></svg>';
              }}
            />
          </Button>

          {/* Contextual dropdown panel */}
          {isDropdownOpen && (
            <div className={UI.chrome.dropdown}>
              <div className="border-border border-b px-4 py-2">
                <p className={`${UI.text.small} font-semibold`}>
                  {t('app.general.connectedAs') || 'Logged in as'}
                </p>
                <p className="text-foreground m-2 truncate text-center text-sm font-bold">
                  {user?.username || 'User'}
                </p>
              </div>

              {/* Profile navigation link */}
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className={UI.chrome.dropdownItem}
              >
                <UserIcon className={UI.icon.sm} aria-hidden="true" />
                <span>{t('app.general.profile') || 'Profile'}</span>
              </Link>

              {/* Logout action */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className={`${UI.btn.danger} w-full justify-start rounded-none px-4 py-2 text-left`}
              >
                <LogOutIcon className={UI.icon.sm} aria-hidden="true" />
                <span>{t('app.general.logout') || 'Logout'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
