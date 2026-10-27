import { useEffect } from 'react';
import { useFriendsStore } from '../store/useFriendsStore';
import { useLanguage } from '@/locales/useLanguage';

import { Card } from '@/components/ui/card';

import { FriendListItem } from './FriendListItem';
import { AddFriendCard } from './AddFriendCard';
import { IncomingRequests } from '@/features/lobby/components/IncomingRequests';

import type { FriendUser } from '../service/friendsService';

interface FriendsListCardProps {
  onInviteToLobby?: (friend: FriendUser) => void;
  onSpectate?: (gameId: string) => void;
}

export function FriendsListCard({
  onInviteToLobby,
  onSpectate,
}: FriendsListCardProps) {
  const { t } = useLanguage();
  const { friends, isLoading, loadFriendsData, deleteFriend } =
    useFriendsStore();

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-700 pb-2">
        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-300 uppercase">
          <span>👥</span>
          <span>
            {t('app.friendList') || 'Lista de Amigos'} ({friends.length})
          </span>
        </h4>
        {isLoading && (
          <span className="animate-pulse text-[10px] text-zinc-500">
            {t('app.connecting') || 'Cargando...'}
          </span>
        )}
      </div>

      {/* Invitaciones y solicitudes entrantes pendientes (estilo unificado) */}
      <IncomingRequests />

      {/* Agregar amigos */}
      <AddFriendCard />

      {/* Lista de amigos confirmados */}
      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
        {friends.length === 0 && !isLoading ? (
          <p className="py-4 text-center text-xs text-zinc-500">
            {t('app.noFriendsYet') || 'No tienes amigos añadidos aún.'}
          </p>
        ) : (
          friends.map((friend) => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              onInviteToLobby={onInviteToLobby}
              onSpectate={onSpectate}
              onRemove={deleteFriend}
            />
          ))
        )}
      </div>
    </Card>
  );
}
