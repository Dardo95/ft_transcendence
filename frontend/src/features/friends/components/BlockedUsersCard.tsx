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
    <Card className={UI.card.sectionLarge}>
      <div className={UI.row.header}>
        <h2 className={UI.text.sectionTitle}>
          {t('profile.blockedUsers') || 'Blocked users'}
        </h2>
        <span className={UI.badge.pill}>
          <Ban className={UI.icon.xs} aria-hidden="true" />
          {blockedUsers.length}
        </span>
      </div>

      {blockedUsers.length === 0 ? (
        <p className={`mt-4 ${UI.card.innerPadded} ${UI.text.small}`}>
          {t('profile.blockedUsersEmpty') ||
            'You have not blocked any users yet.'}
        </p>
      ) : (
        <ul className={`mt-5 ${UI.card.inner} ${UI.row.dividerList}`}>
          {blockedUsers.map((blocked) => (
            <li key={blocked.id} className={UI.row.itemRoomy}>
              <Link
                to={`/profile/${encodeURIComponent(blocked.username)}`}
                className={UI.link.profileRow}
              >
                <img
                  src={blocked.avatarUrl || defaultAvatar}
                  alt={blocked.username}
                  className={UI.avatar.md}
                />
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-semibold">
                    {blocked.username}
                  </span>
                  <span className={UI.text.small}>
                    {t('profile.blocked') || 'Blocked'}
                  </span>
                </span>
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
