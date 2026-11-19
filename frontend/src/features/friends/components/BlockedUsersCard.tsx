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
  const unblockUser = useFriendsStore((state) => state.unblockUser);
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUnblock = async (username: string) => {
    setPendingUser(username);
    setError(null);
    try {
      await unblockUser(username);
    } catch {
      setError(
        t('profile.unblockFailed') || 'Could not unblock the user. Try again.'
      );
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

      {blockedUsers.length === 0 ? (
        <p className={UI.list.profileEmpty}>
          {t('profile.blockedUsersEmpty') ||
            'You have not blocked any users yet.'}
        </p>
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
        <p className={`mt-3 ${UI.feedback.inlineError}`} role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
