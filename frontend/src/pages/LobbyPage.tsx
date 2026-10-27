import { useEffect } from 'react';

import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useSocketStore } from '../stores/useSocketStore';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';

import { Card } from '@/components/ui/card';

import { LobbyStatusCard } from '../features/lobby/components/LobbyStatusCard';
import { LobbyInvitationsCard } from '../features/lobby/components/LobbyInvitationsCard';
import { LobbyChat } from '../features/chat/components/LobbyChat';

import { InviteFriendToLobbyForm } from '@/features/friends/components/InviteFriendToLobbyForm';
import { FriendsListCard } from '@/features/friends/components/FriendListCard';
import { AddFriendCard } from '@/features/friends/components/AddFriendCard';
import type { FriendUser } from '@/features/friends/service/friendsService';

export function LobbyPage() {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const isConnected = useSocketStore((state) => state.isConnected);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);

  const initListeners = useLobbyStore((state) => state.initListeners);

  // Registrar los listeners antes de conectar el socket.
  useEffect(() => {
    const cleanupListeners = initListeners();

    connect();

    return () => {
      cleanupListeners();
      disconnect();
    };
  }, [initListeners, connect, disconnect]);

  const isHost = lobby?.hostUserId === user?.id;

  const inviteFriend = useLobbyStore((state) => state.inviteFriend);
  const handleInviteToLobby = async (friend: FriendUser) => {
    try {
      await inviteFriend(friend.username);
      console.log(`Invitación enviada a ${friend.username}`);
    } catch (error) {
      console.error('Error al invitar al lobby:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-orange-400">
        {t('app.Lobby') || 'Lobby'}
      </h1>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-400">
          {isConnected ? 'Conectado al servidor' : 'Conectando...'}
        </span>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300"
        >
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal: estado del lobby */}
        <div className="space-y-4 lg:col-span-2">
          <LobbyStatusCard />

          {/* Invitar amigos: solamente el anfitrión */}
          {lobby && isHost && <InviteFriendToLobbyForm />}
        </div>

        {/* Columna lateral: invitaciones y chat */}
        <div className="space-y-4">
          <LobbyInvitationsCard />

          <AddFriendCard />

          <FriendsListCard
            onInviteToLobby={handleInviteToLobby}
            onSpectate={(gameId) => {
              // navigate(`/game/${gameId}?mode=spectator`);
              console.log('Espectar partida:', gameId);
            }}
          />

          {lobby ? (
            <LobbyChat />
          ) : (
            <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center text-sm text-zinc-400">
              Entra en un lobby para utilizar el chat privado con sus miembros.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
