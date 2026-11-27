import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';
import { resolveLobbyErrorKey } from '@/features/lobby/lobbyErrorMessage';

const AUTO_DISMISS_MS = 5_000;

interface Props {
  error: string | null;
  gameError: string | null;
  notice: string | null;
  noticeData: string | null;
  onDismissError: () => void;
  onDismissGameError: () => void;
  onDismissNotice: () => void;
  onRetryGameError?: () => void;
}

function useAutoDismiss(
  message: string | null,
  onDismiss: () => void,
  delay = AUTO_DISMISS_MS
): void {
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(onDismiss, delay);

    return () => window.clearTimeout(timer);
  }, [message, onDismiss, delay]);
}

function localizeLobbyError(error: string, t: (key: string) => string): string {
  return t(`app.lobby.${error}`) || t(resolveLobbyErrorKey(error)) || error;
}

export function LobbyNotifications({
  error,
  gameError,
  notice,
  noticeData,
  onDismissError,
  onDismissGameError,
  onDismissNotice,
  onRetryGameError,
}: Props) {
  const { t } = useLanguage();

  useAutoDismiss(error, onDismissError);
  useAutoDismiss(gameError, onDismissGameError);
  useAutoDismiss(notice, onDismissNotice);

  const dismissLabel = t('app.lobby.dismissNotification') || 'Dismiss';
  const retryLabel = t('app.lobby.retry') || 'Retry';

  if (!error && !gameError && !notice) {
    return null;
  }

  return (
    <div className="mb-4 grid gap-2" aria-live="polite">
      {error && (
        <div
          role="alert"
          className={`${UI.feedback.error} flex items-start justify-between gap-3`}
        >
          <span className="min-w-0 flex-1 break-words">
            {localizeLobbyError(error, t)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={UI.btn.iconDanger}
            aria-label={dismissLabel}
            onClick={onDismissError}
          >
            ×
          </Button>
        </div>
      )}

      {gameError && (
        <div
          role="alert"
          className={`${UI.feedback.error} flex flex-wrap items-start justify-between gap-3`}
        >
          <span className="min-w-0 flex-1 break-words">{gameError}</span>
          <div className="flex items-center gap-1">
            {onRetryGameError && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                className={UI.btn.chip}
                onClick={onRetryGameError}
              >
                {retryLabel}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={UI.btn.iconDanger}
              aria-label={dismissLabel}
              onClick={onDismissGameError}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {notice && (
        <div role="status" className={UI.feedback.success}>
          {t(`app.lobby.${notice}`) || notice}
          {notice === 'noticeInvitationSent' && noticeData && (
            <span className="ms-2 text-sm">{noticeData}</span>
          )}
        </div>
      )}
    </div>
  );
}
