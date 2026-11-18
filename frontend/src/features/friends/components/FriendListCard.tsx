import { useEffect } from 'react';
import { UsersIcon } from 'lucide-react';
import { useFriendsStore } from '../store/useFriendsStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

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
  const { friends, isLoading, loadFriendsData, deleteFriend } =
    useFriendsStore();

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  return (
    <Card className={CARD_STYLES[variant]}>
      <div className={HEADER_STYLES[variant]}>
        <h4 className={TITLE_STYLES[variant]}>
          <UsersIcon
            className={variant === 'profile' ? UI.icon.md : UI.icon.sm}
            aria-hidden="true"
          />
          <span>{t('app.friends.friendList') || 'Lista de Amigos'}</span>
        </h4>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-muted-foreground animate-pulse text-[10px]">
              {t('app.general.connecting') || 'Cargando...'}
            </span>
          )}
          <span className={UI.badge.pill}>
            <UsersIcon className={UI.icon.xs} aria-hidden="true" />
            {friends.length}
          </span>
        </div>
      </div>

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
        {friends.length === 0 && !isLoading ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            {t('app.friends.noFriendsYet') || 'No tienes amigos añadidos aún.'}
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
