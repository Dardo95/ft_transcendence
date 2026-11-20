/**
 * Application footer.
 * Category: Layout Component
 *
 * Responsible for:
 * - Rendering global footer content.
 * - Displaying application information and links.
 *
 * Does not:
 * - Contain application business logic.
 */

import { Link } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={UI.chrome.footer}>
      <nav className={UI.chrome.footerNav}>
        {/* Year and Application Title */}
        <span>© 2026 {t('app.general.title') || 'ft_boomberman'}</span>

        <span aria-hidden="true">✦</span>

        {/* Links to legal pages */}
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
