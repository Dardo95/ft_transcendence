import { Link } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';

export function FooterPublic() {
  const { t } = useLanguage();

  return (
    <footer className={UI.chrome.footer}>
      {/* Legal and About Links */}
      <nav className={UI.chrome.footerNav}>
        {/* Year and Application Title */}
        <span>© 2026 {t('app.general.title') || 'ft_boomberman'}</span>
        <span aria-hidden="true">✦</span>

        <Link to="/about-us" className={UI.nav.footerLink}>
          {t('app.general.aboutUs') || 'About Us'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/rules" className={UI.nav.footerLink}>
          {t('app.general.aboutGame') || 'About the Game'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/project" className={UI.nav.footerLink}>
          {t('app.general.aboutProject') || 'About the Project'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/terms" className={UI.nav.footerLink}>
          {t('app.general.termsOfService') || 'Terms of Service'}
        </Link>
        <span aria-hidden="true">✦</span>
        <Link to="/privacy" className={UI.nav.footerLink}>
          {t('app.general.privacyPolicy') || 'Privacy Policy'}
        </Link>
      </nav>
    </footer>
  );
}
