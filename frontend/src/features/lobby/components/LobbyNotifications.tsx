import { useEffect } from 'react';

import { useLanguage } from '@/locales/useLanguage';
import { ALERT_ERROR, ALERT_SUCCESS } from '@/components/layout/layoutStyles';

const AUTO_DISMISS_MS = 5_000;

interface Props {
  error: string | null;
  gameError: string | null;
  notice: string | null;
  noticeData: string | null;
  onDismissError: () => void;
  onDismissGameError: () => void;
  onDismissNotice: () => void;
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

export function LobbyNotifications({
  error,
  gameError,
  notice,
  noticeData,
  onDismissError,
  onDismissGameError,
  onDismissNotice,
}: Props) {
  const { t } = useLanguage();

  useAutoDismiss(error, onDismissError);
  useAutoDismiss(gameError, onDismissGameError);
  useAutoDismiss(notice, onDismissNotice);

  if (!error && !gameError && !notice) {
    return null;
  }

  return (
    <div className="mb-4 grid gap-2" aria-live="polite">
      {error && (
        <div role="alert" className={ALERT_ERROR}>
          {t(`app.lobby.${error}`) || error}
        </div>
      )}

      {gameError && (
        <div role="alert" className={ALERT_ERROR}>
          {gameError}
        </div>
      )}

      {notice && (
        <div role="status" className={ALERT_SUCCESS}>
          {t(`app.lobby.${notice}`) || notice}
          {notice === 'noticeInvitationSent' && noticeData && (
            <span className="ms-2 text-sm">a {noticeData}</span>
          )}
        </div>
      )}
    </div>
  );
}
