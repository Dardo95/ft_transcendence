import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFriendsStore } from '../store/useFriendsStore';
import { FriendListItem } from './FriendListItem';
import type { FriendUser } from '../service/friendsService';

interface FriendsListCardProps {
  onInviteToLobby?: (friend: FriendUser) => void;
  onSpectate?: (gameId: string) => void;
}

export function FriendsListCard({
  onInviteToLobby,
  onSpectate,
}: FriendsListCardProps) {
  const {
    friends,
    incomingRequests,
    isLoading,
    loadFriendsData,
    acceptRequest,
    rejectRequest,
    deleteFriend,
  } = useFriendsStore();

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-700 pb-2">
        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-300 uppercase">
          <span>👥</span>
          <span>Lista de Amigos ({friends.length})</span>
        </h4>
        {isLoading && (
          <span className="animate-pulse text-[10px] text-zinc-500">
            Cargando...
          </span>
        )}
      </div>

      {/* Solicitudes de amistad entrantes pendientes */}
      {incomingRequests.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-orange-500/30 bg-orange-950/20 p-2">
          <p className="text-[10px] font-bold tracking-wide text-orange-400 uppercase">
            Solicitudes pendientes ({incomingRequests.length})
          </p>
          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between py-1 text-xs"
            >
              <span className="font-semibold text-zinc-200">
                {req.from?.username || 'Chef'}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="h-6 bg-emerald-600 px-2 text-[10px] hover:bg-emerald-500"
                  onClick={() => acceptRequest(req.id)}
                >
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[10px] text-zinc-400 hover:text-red-400"
                  onClick={() => rejectRequest(req.id)}
                >
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de amigos confirmados */}
      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
        {friends.length === 0 && !isLoading ? (
          <p className="py-4 text-center text-xs text-zinc-500">
            No tienes amigos añadidos aún.
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
