import { createPortal } from 'react-dom'; // createPortal is used to render the overlay outside of the main app hierarchy, ensuring it appears above all other content.
import { UI } from '@/components/layout/layoutStyles';
import { Button } from '@/components/ui/button';

import { useSocketStore } from '@/stores/useSocketStore';
import { useLanguage } from '../../../locales/useLanguage';

export function SessionReplacedOverlay() {
  const sessionReplaced = useSocketStore((state) => state.sessionReplaced);
  const { t } = useLanguage();

  if (!sessionReplaced) return null;

  return createPortal(
    <div role="alertdialog" aria-modal="true" className={UI.ui.dialogOverlay}>
      <section className={UI.overlay.modalCard}>
        <h2 className={UI.text.sectionTitle}>
          {t('app.general.openSession') || 'Session opened in another window'}
        </h2>
        <p className={UI.text.body}>
          {t('app.general.sessionReplaced') ||
            'This account has been logged in on another tab or device. This window has been disconnected.'}
        </p>
        <Button
          type="button"
          variant="default"
          onClick={() => window.location.reload()}
          className="mt-2 w-full"
        >
          {t('app.general.reloadSession') || 'Recover session'}
        </Button>
      </section>
    </div>,
    document.body
  );
}
