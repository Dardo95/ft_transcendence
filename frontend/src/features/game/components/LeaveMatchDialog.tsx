import { useEffect } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '../../../locales/useLanguage';
import { useMatchGuardStore } from '../store/useMatchGuardStore';

/**
 * Confirmación de salida (GAME-F-17): montado en
 * `AppLayout` para cubrir todas las salidas (topbar, logout,
 * navegación interna). Con la partida en accion ofrece abandonar
 * (derrota), dejarla en segundo plano (el jugador queda en pie
 * y se puede volver desde el lobby) o cancelar.
 *
 * Mientras está también añade el aviso nativo de
 * `beforeunload` al refrescar o cerrar la pestaña.
 */
export function LeaveMatchDialog() {
  const { t } = useLanguage();
  const armed = useMatchGuardStore((state) => state.armed);
  const open = useMatchGuardStore((state) => state.open);
  const confirmAbandon = useMatchGuardStore((state) => state.confirmAbandon);
  const confirmBackground = useMatchGuardStore(
    (state) => state.confirmBackground
  );
  const cancel = useMatchGuardStore((state) => state.cancel);

  useEffect(() => {
    if (!armed) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Compatibilidad con navegadores antiguos: sin `returnValue`
      // no muestran el aviso nativo.
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [armed]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          cancel();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('app.game.leaveConfirm.title') || 'Leave the match?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('app.game.leaveConfirm.description') ||
              'If you abandon, it counts as a defeat. You can also leave the match in the background and come back later.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-end gap-2">
          <AlertDialogCancel onClick={cancel}>
            {t('app.game.leaveConfirm.cancel') || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmBackground}>
            {t('app.game.leaveConfirm.background') || 'Leave in background'}
          </AlertDialogAction>
          <AlertDialogAction variant="destructive" onClick={confirmAbandon}>
            {t('app.game.leaveConfirm.abandon') || 'Abandon'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
