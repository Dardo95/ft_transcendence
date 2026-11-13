import { useEffect } from 'react';
import { UsersIcon } from 'lucide-react';
import { useFriendsStore } from '../store/useFriendsStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

import { Card } from '@/components/ui/card';

import { FriendListItem } from './FriendListItem';
import { AddFriendCard } from './AddFriendCard';
import { IncomingRequests } from './IncomingRequests';

export type FriendListVariant = 'lobby' | 'profile';

interface FriendListProps {
  onSpectate?: (gameId: string) => void;
  variant?: FriendListVariant;
}

const CARD_STYLES: Record<FriendListVariant, string> = {
  lobby:
    'flex flex-col gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl',
  profile:
    'flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-sm sm:p-8',
};

const HEADER_STYLES: Record<FriendListVariant, string> = {
  lobby: 'flex items-center justify-between border-b border-zinc-700 pb-2',
  profile:
    'flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4',
};

const TITLE_STYLES: Record<FriendListVariant, string> = {
  lobby:
    'flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-300 uppercase',
  profile: 'flex items-center gap-2 text-xl font-bold text-white',
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
          <span className="animate-pulse text-[10px] text-zinc-500">
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
          <p className="py-4 text-center text-xs text-zinc-500">
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
