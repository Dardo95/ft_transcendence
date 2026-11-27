import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';

/**
 * Transition state shown after the player launches a match and before the
 * game route finishes loading. The parent clears it on socket errors,
 * disconnects or a timeout so the lobby never stays frozen here.
 */
export function ConnectingToMatchBanner() {
  const { t } = useLanguage();

  return (
    <Card
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="border-primary/30 bg-primary/10 my-4 flex items-center gap-4 p-4"
    >
      <span
        className={`${UI.icon.spinner} border-primary/25 border-t-primary h-8 w-8 shrink-0 rounded-full border-[3px]`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <span className={UI.text.eyebrow}>
          {t('app.lobby.connectingMatchEyebrow') || 'MATCH READY'}
        </span>
        <strong className="text-foreground mt-1 block text-[0.95rem]">
          {t('app.lobby.connectingToMatch') || 'Connecting to match...'}
        </strong>
        <span className="text-muted-foreground mt-0.5 block text-[0.7rem]">
          {t('app.lobby.connectingToMatchHint') ||
            'Hold on while the arena opens.'}
        </span>
      </div>
    </Card>
  );
}
