import { useEffect } from 'react';
import { UsersIcon } from 'lucide-react';
import { useFriendsStore } from '../store/useFriendsStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

import { FriendListItem } from './FriendListItem';
import { AddFriendCard } from './AddFriendCard';
import { IncomingRequests } from './IncomingRequests';

export type FriendListVariant = 'lobby' | 'profile';

interface FriendListProps {
  onSpectate?: (gameId: string) => void;
  variant?: FriendListVariant;
}

const CARD_STYLES: Record<FriendListVariant, string> = {
  lobby: UI.card.friendLobby,
  profile: UI.card.friendProfile,
};

const HEADER_STYLES: Record<FriendListVariant, string> = {
  lobby: UI.row.friendHeaderLobby,
  profile: UI.row.friendHeaderProfile,
};

const TITLE_STYLES: Record<FriendListVariant, string> = {
  lobby: UI.text.friendTitleLobby,
  profile: UI.text.friendTitleProfile,
};

export function FriendList({ onSpectate, variant = 'lobby' }: FriendListProps) {
  const { t } = useLanguage();
  const inviteFriend = useLobbyStore((state) => state.inviteFriendToLobby);
  const {
    friends,
    isLoading,
    error,
    loadFriendsData,
    deleteFriend,
    clearError,
  } = useFriendsStore();

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  const isInitialLoading = isLoading && friends.length === 0;
  const retryLabel = t('app.friends.retry') || 'Retry';
  const dismissLabel =
    t('app.friends.dismissNotification') || 'Dismiss notification';

  return (
    <Card className={CARD_STYLES[variant]}>
      <div className={HEADER_STYLES[variant]}>
        <h4 className={TITLE_STYLES[variant]}>
          <UsersIcon
            className={variant === 'profile' ? UI.icon.md : UI.icon.sm}
            aria-hidden="true"
          />
          <span>{t('app.friends.friendList') || 'Friend List'}</span>
        </h4>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-muted-foreground animate-pulse text-[10px]">
              {t('app.friends.loadingFriends') || 'Loading friends...'}
            </span>
          )}
          <span className={UI.badge.pill}>
            <UsersIcon className={UI.icon.xs} aria-hidden="true" />
            {friends.length}
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className={`${UI.feedback.error} flex flex-wrap items-start justify-between gap-3`}
        >
          <span className="min-w-0 flex-1 break-words">
            {t(`app.friends.${error}`) || error}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className={UI.btn.chip}
              onClick={() => void loadFriendsData()}
            >
              {retryLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={UI.btn.iconDanger}
              aria-label={dismissLabel}
              onClick={clearError}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Incoming lobby invitations and friend requests */}
      <IncomingRequests variant={variant} />

      {/* Add friend search */}
      <AddFriendCard variant={variant} />

      {/* Confirmed friends */}
      <div
        className={`${UI.list.friendsScroll} ${
          variant === 'profile'
            ? UI.list.friendsScrollTall
            : UI.list.friendsScrollShort
        }`}
      >
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
              {t('app.friends.loadingFriends') || 'Loading friends...'}
            </p>
          </div>
        ) : friends.length === 0 && !error ? (
          <p className={UI.list.profileEmpty}>
            {t('app.friends.noFriendsYet') || 'You have no friends added yet.'}
          </p>
        ) : (
          friends.map((friend) => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              variant={variant}
              onInviteToLobby={(f) => inviteFriend(f.username)}
              onSpectate={onSpectate}
              onRemove={deleteFriend}
            />
          ))
        )}
      </div>
    </Card>
  );
}
