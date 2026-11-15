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
      <nav className="flex flex-wrap items-center justify-center gap-6 gap-y-2">
        {/* Year and Application Title */}
        <span>© 2026 {t('app.general.title') || 'ft_boomberman'}</span>

        <span aria-hidden="true">✦</span>

        {/* Links to legal pages */}
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
