import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, Unlock } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';
import defaultAvatar from '@/assets/default.jpg';

import { useFriendsStore } from '../store/useFriendsStore';

/**
 * Blocked users management card.
 * Lists every user blocked by the authenticated account and allows
 * unblocking them one by one.
 */
export function BlockedUsersCard() {
  const { t } = useLanguage();
  const blockedUsers = useFriendsStore((state) => state.blockedUsers);
  const isLoading = useFriendsStore((state) => state.isLoading);
  const isBlockedLoading = useFriendsStore((state) => state.isBlockedLoading);
  const blockedError = useFriendsStore((state) => state.blockedError);
  const fetchBlockedUsers = useFriendsStore((state) => state.fetchBlockedUsers);
  const clearBlockedError = useFriendsStore((state) => state.clearBlockedError);
  const unblockUser = useFriendsStore((state) => state.unblockUser);
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failedUser, setFailedUser] = useState<string | null>(null);

  const retryLabel = t('app.friends.retry') || 'Retry';
  const dismissLabel =
    t('app.friends.dismissNotification') || 'Dismiss notification';
  const isInitialLoading =
    (isLoading || isBlockedLoading) && blockedUsers.length === 0;

  const handleUnblock = async (username: string) => {
    setPendingUser(username);
    setError(null);
    setFailedUser(null);
    try {
      await unblockUser(username);
    } catch {
      setError(
        t('profile.unblockFailed') || 'Could not unblock the user. Try again.'
      );
      setFailedUser(username);
    } finally {
      setPendingUser(null);
    }
  };

  return (
    <Card className={UI.card.friendProfile}>
      <div className={UI.row.friendHeaderProfile}>
        <h4 className={UI.text.friendTitleProfile}>
          <Ban className={UI.icon.md} aria-hidden="true" />
          <span>{t('profile.blockedUsers') || 'Blocked-users List'}</span>
        </h4>
        <span className={UI.badge.pill}>
          <Ban className={UI.icon.xs} aria-hidden="true" />
          {blockedUsers.length}
        </span>
      </div>

      {blockedError && (
        <div
          role="alert"
          className={`${UI.feedback.error} mb-3 flex flex-wrap items-start justify-between gap-3`}
        >
          <span className="min-w-0 flex-1 break-words">
            {t(`app.friends.${blockedError}`) || blockedError}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className={UI.btn.chip}
              onClick={() => void fetchBlockedUsers()}
            >
              {retryLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={UI.btn.iconDanger}
              aria-label={dismissLabel}
              onClick={clearBlockedError}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {isInitialLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-24 flex-col items-center justify-center gap-2 py-6 text-center"
        >
          <span
            className={`${UI.icon.spinner} border-primary/30 border-t-primary size-6 shrink-0 rounded-full border-2`}
            aria-hidden="true"
          />
          <p className={UI.text.small}>
            {t('app.friends.loadingBlockedUsers') || 'Loading blocked users...'}
          </p>
        </div>
      ) : blockedUsers.length === 0 ? (
        !blockedError && (
          <p className={UI.list.profileEmpty}>
            {t('profile.blockedUsersEmpty') ||
              'You have not blocked any users yet.'}
          </p>
        )
      ) : (
        <ul className={`${UI.list.friendsScroll} ${UI.list.friendsScrollTall}`}>
          {blockedUsers.map((blocked) => (
            <li
              key={blocked.id}
              className={`flex items-center justify-between gap-3 ${UI.card.profileRow} ${UI.row.interactive}`}
            >
              <Link
                to={`/profile/${encodeURIComponent(blocked.username)}`}
                className={UI.link.profileRow}
              >
                <img
                  src={blocked.avatarUrl || defaultAvatar}
                  alt={blocked.username}
                  className={UI.avatar.lg}
                />
                <div className="min-w-0">
                  <p
                    className={`text-foreground text-sm ${UI.link.profileName}`}
                  >
                    {blocked.username}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {t('profile.blocked') || 'Blocked'}
                  </p>
                </div>
              </Link>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pendingUser === blocked.username}
                onClick={() => void handleUnblock(blocked.username)}
                className={UI.btn.unblock}
              >
                <Unlock className={UI.icon.xs} aria-hidden="true" />
                {t('profile.unblockButton') || 'Unblock'}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div
          role="alert"
          className={`${UI.feedback.error} mt-3 flex flex-wrap items-start justify-between gap-3`}
        >
          <span className="min-w-0 flex-1 break-words">{error}</span>
          <div className="flex items-center gap-1">
            {failedUser && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                className={UI.btn.chip}
                onClick={() => void handleUnblock(failedUser)}
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
              onClick={() => {
                setError(null);
                setFailedUser(null);
              }}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
