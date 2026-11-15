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
  lobby: 'flex flex-col gap-3 p-5',
  profile: 'flex flex-col gap-4 p-6 sm:p-8',
};

const HEADER_STYLES: Record<FriendListVariant, string> = {
  lobby: 'flex items-center justify-between border-b border-border pb-2',
  profile:
    'flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4',
};

const TITLE_STYLES: Record<FriendListVariant, string> = {
  lobby: `flex items-center gap-2 ${UI.text.sublabel}`,
  profile: `flex items-center gap-2 ${UI.text.sectionTitle}`,
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
            className={variant === 'profile' ? 'size-5' : 'h-4 w-4'}
            aria-hidden="true"
          />
          <span>
            {t('app.friends.friendList') || 'Lista de Amigos'} ({friends.length}
            )
          </span>
        </h4>
        {isLoading && (
          <span className="text-muted-foreground animate-pulse text-[10px]">
            {t('app.general.connecting') || 'Cargando...'}
          </span>
        )}
      </div>

      {/* Incoming lobby invitations and friend requests */}
      <IncomingRequests variant={variant} />

      {/* Add friend search */}
      <AddFriendCard variant={variant} />

      {/* Confirmed friends */}
      <div
        className={`flex flex-col gap-2 overflow-y-auto pr-1 ${
          variant === 'profile' ? 'max-h-96' : 'max-h-64'
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
