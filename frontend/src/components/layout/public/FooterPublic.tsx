import { Link } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';

export function FooterPublic() {
  const { t } = useLanguage();

  return (
    <footer className="z-10 w-full border-t border-zinc-800/80 bg-slate-950/80 py-4 text-center text-sm text-white backdrop-blur-sm">
      {/* Legal and About Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 gap-y-2">
        {/* Year and Application Title */}
        <span>© 2026 {t('app.general.title') || 'ft_boomberman'}</span>
        <span>✦</span>

        <Link to="/about-us" className="transition-colors hover:text-zinc-300">
          {t('app.general.aboutUs') || 'About Us'}
        </Link>
        <span>✦</span>
        <Link to="/rules" className="transition-colors hover:text-zinc-300">
          {t('app.general.aboutGame') || 'About the Game'}
        </Link>
        <span>✦</span>
        <Link to="/project" className="transition-colors hover:text-zinc-300">
          {t('app.general.aboutProject') || 'About the Project'}
        </Link>
        <span>✦</span>
        <Link to="/terms" className="transition-colors hover:text-zinc-300">
          {t('app.general.termsOfService') || 'Terms of Service'}
        </Link>
        <span>✦</span>
        <Link to="/privacy" className="transition-colors hover:text-zinc-300">
          {t('app.general.privacyPolicy') || 'Privacy Policy'}
        </Link>
      </div>
    </footer>
  );
}
