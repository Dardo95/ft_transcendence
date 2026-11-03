import { useSocketStore } from '@/stores/useSocketStore';
import { useLanguage } from '../../../locales/useLanguage';

export function SessionReplacedOverlay() {
  const sessionReplaced = useSocketStore((state) => state.sessionReplaced);
  const { t } = useLanguage();

  if (!sessionReplaced) return null;

  return (
    <div className="z100 fixed inset-0 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-center shadow-2xl">
        <h2 className="text-lg font-bold text-white">
          {t('app.general.openSession') || 'Sesión abierta en otra ventana'}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          { t('app.general.sessionReplaced') || 'Esta cuenta se ha iniciado en otra pestaña o dispositivo. Esta ventana ha quedado desconectada.' }
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white uppercase hover:bg-orange-500"
        >
          {t('app.general.reloadSession') || 'Recuperar sesión'}
        </button>
      </div>
    </div>
  );
}
