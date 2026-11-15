import { createPortal } from 'react-dom'; // createPortal is used to render the overlay outside of the main app hierarchy, ensuring it appears above all other content.
import {
  BTN_DEFAULT_PLUS,
  MODAL_BACKDROP,
  MODAL_CARD,
  SECTION_TEXT,
  SECTION_TITLE,
} from '@/components/layout/layoutStyles';
import { Button } from '@/components/ui/button';

import { useSocketStore } from '@/stores/useSocketStore';
import { useLanguage } from '../../../locales/useLanguage';

export function SessionReplacedOverlay() {
  const sessionReplaced = useSocketStore((state) => state.sessionReplaced);
  const { t } = useLanguage();

  if (!sessionReplaced) return null;

  return createPortal(
    <div role="alertdialog" aria-modal="true" className={MODAL_BACKDROP}>
      <div className={MODAL_CARD}>
        <h2 className={SECTION_TITLE}>
          {t('app.general.openSession') || 'Sesión abierta en otra ventana'}
        </h2>
        <p className={SECTION_TEXT}>
          {t('app.general.sessionReplaced') ||
            'Esta cuenta se ha iniciado en otra pestaña o dispositivo. Esta ventana ha quedado desconectada.'}
        </p>
        <Button
          type="button"
          variant="default"
          onClick={() => window.location.reload()}
          className={`mt-5 w-full cursor-pointer ${BTN_DEFAULT_PLUS}`}
        >
          {t('app.general.reloadSession') || 'Recuperar sesión'}
        </Button>
      </div>
    </div>,
    document.body
  );
}
