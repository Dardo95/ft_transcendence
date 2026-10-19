
import { useEffect, useState } from 'react';

import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useSocketStore } from '../stores/useSocketStore';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';

import { LobbyChat } from '../features/chat/components/LobbyChat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LobbyPage() {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const isConnected = useSocketStore((state) => state.isConnected);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  const lobby = useLobbyStore((state) => state.lobby);
  const invitations = useLobbyStore((state) => state.invitations);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);

  const initListeners = useLobbyStore((state) => state.initListeners);
  const createLobby = useLobbyStore((state) => state.createLobby);
  const leaveLobby = useLobbyStore((state) => state.leaveLobby);
  const inviteFriend = useLobbyStore((state) => state.inviteFriend);
  const acceptInvitation = useLobbyStore(
    (state) => state.acceptInvitation,
  );
  const rejectInvitation = useLobbyStore(
    (state) => state.rejectInvitation,
  );

  const [friendUsername, setFriendUsername] = useState('');

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
  const isFull = (lobby?.members.length ?? 0) >= 4;

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = friendUsername.trim();

    if (!username) return;

    inviteFriend(username);
    setFriendUsername('');
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
          <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 text-zinc-100 shadow-xl">
            {lobby ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-orange-300">
                    Tu lobby
                  </h2>

                  <p className="mt-1 break-all text-xs text-zinc-400">
                    ID: {lobby.id}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Jugadores ({lobby.members.length}/4)
                  </h3>

                  {isHost && (
                    <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs text-orange-300">
                      Anfitrión
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {lobby.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/70 p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {member.username}
                          {member.userId === user?.id ? ' (Tú)' : ''}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {member.isHost ? 'Anfitrión' : 'Invitado'}
                        </p>
                      </div>

                      <span className="text-emerald-400">●</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={leaveLobby}
                >
                  Salir del lobby
                </Button>
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
                <div>
                  <h2 className="text-lg font-bold text-orange-300">
                    Todavía no tienes un lobby
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    Crea tu grupo e invita a tus amigos para jugar juntos.
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={!isConnected}
                  onClick={createLobby}
                  className="bg-orange-600 text-white hover:bg-orange-500"
                >
                  Crear lobby
                </Button>
              </div>
            )}
          </Card>

          {/* Invitar amigos: solamente el anfitrión */}
          {lobby && isHost && (
            <Card className="space-y-3 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 text-zinc-100 shadow-xl">
              <h2 className="font-bold">Invitar a un amigo</h2>

              <form onSubmit={handleInvite} className="flex gap-2">
                <Input
                  value={friendUsername}
                  onChange={(event) =>
                    setFriendUsername(event.target.value)
                  }
                  placeholder="Nombre de usuario"
                  disabled={!isConnected || isFull}
                  maxLength={32}
                />

                <Button
                  type="submit"
                  disabled={
                    !isConnected || isFull || !friendUsername.trim()
                  }
                  className="bg-orange-600 text-white hover:bg-orange-500"
                >
                  Invitar
                </Button>
              </form>

              <p className="text-xs text-zinc-400">
                {isFull
                  ? 'El lobby está completo.'
                  : 'Solo puedes invitar a amigos con una amistad aceptada.'}
              </p>
            </Card>
          )}
        </div>

        {/* Columna lateral: invitaciones y chat */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-zinc-100 shadow-xl">
            <h2 className="mb-3 font-bold text-orange-300">
              Invitaciones pendientes
            </h2>

            {invitations.length === 0 ? (
              <p className="text-sm text-zinc-400">
                No tienes invitaciones pendientes.
              </p>
            ) : (
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="space-y-2 rounded-lg border border-zinc-700 p-3"
                  >
                    <p className="text-sm">
                      <strong>{invitation.inviterUsername}</strong> te invita
                      a su lobby.
                    </p>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!isConnected || Boolean(lobby)}
                        onClick={() => acceptInvitation(invitation.id)}
                        className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
                      >
                        Aceptar
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!isConnected}
                        onClick={() => rejectInvitation(invitation.id)}
                      >
                        Rechazar
                      </Button>
                    </div>

                    {lobby && (
                      <p className="text-xs text-zinc-400">
                        Sal de tu lobby actual antes de aceptar otra invitación.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

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
