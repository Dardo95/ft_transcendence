import { Link } from 'react-router-dom';
import { useLanguage } from '../../locales/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

export function FooterPublic() {
  const { t } = useLanguage();

  return (
    <footer className="z-10 w-full border-t border-zinc-800/80 bg-slate-950/80 py-4 text-center text-xs text-zinc-500 backdrop-blur-sm">
      {/* Language Switcher */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-xs text-zinc-500"></span>
        <LanguageSwitcher />
      </div>

      {/* Legal and About Links */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link to="/about-us" className="transition-colors hover:text-zinc-300">
          {t('app.aboutUs') || 'About Us'}
        </Link>
        <span>•</span>
        <Link to="/rules" className="transition-colors hover:text-zinc-300">
          {t('app.aboutGame') || 'About the Game'}
        </Link>
        <span>•</span>
        <Link to="/project" className="transition-colors hover:text-zinc-300">
          {t('app.aboutProject') || 'About the Project'}
        </Link>
        <span>•</span>
        <Link to="/terms" className="transition-colors hover:text-zinc-300">
          {t('app.termsOfService') || 'Terms of Service'}
        </Link>
        <span>•</span>
        <Link to="/privacy" className="transition-colors hover:text-zinc-300">
          {t('app.privacyPolicy') || 'Privacy Policy'}
        </Link>
      </div>
    </footer>
  );
}
