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
      <section className={UI.ui.dialogContent}>
        <h2 className={UI.text.sectionTitle}>
          {t('app.general.openSession') || 'Sesión abierta en otra ventana'}
        </h2>
        <p className={UI.text.body}>
          {t('app.general.sessionReplaced') ||
            'Esta cuenta se ha iniciado en otra pestaña o dispositivo. Esta ventana ha quedado desconectada.'}
        </p>
        <Button
          type="button"
          variant="default"
          onClick={() => window.location.reload()}
          className="mt-2 w-full"
        >
          {t('app.general.reloadSession') || 'Recuperar sesión'}
        </Button>
      </section>
    </div>,
    document.body
  );
}
