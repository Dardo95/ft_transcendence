import { Link } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';

export function FooterPublic() {
  const { t } = useLanguage();

  return (
    <footer className={UI.chrome.footer}>
      {/* Legal and About Links */}
      <nav className="flex flex-wrap items-center justify-center gap-6 gap-y-2">
        {/* Year and Application Title */}
        <span>© 2026 {t('app.general.title') || 'ft_boomberman'}</span>
        <span aria-hidden="true">✦</span>

        <Link
          to="/about-us"
          className="hover:text-foreground transition-colors"
        >
          {t('app.general.aboutUs') || 'About Us'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/rules" className="hover:text-foreground transition-colors">
          {t('app.general.aboutGame') || 'About the Game'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/project" className="hover:text-foreground transition-colors">
          {t('app.general.aboutProject') || 'About the Project'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/terms" className="hover:text-foreground transition-colors">
          {t('app.general.termsOfService') || 'Terms of Service'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/privacy" className="hover:text-foreground transition-colors">
          {t('app.general.privacyPolicy') || 'Privacy Policy'}
        </Link>
      </nav>
    </footer>
  );
}
