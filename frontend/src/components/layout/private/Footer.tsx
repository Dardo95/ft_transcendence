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

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="z-10 w-full border-t border-zinc-800/80 bg-slate-950/80 py-4 text-center text-xs text-zinc-500 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-center gap-6 gap-y-2">
        {/* Year and Application Title */}
        <span>© 2026 {t('app.title') || 'Kitchen Mayhem'}</span>

        <span>•</span>

        {/* Links to legal pages */}
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
