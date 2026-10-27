import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';

export function InviteFriendToLobbyForm() {
  const user = useAuthStore((state) => state.user);
  const lobby = useLobbyStore((state) => state.lobby);
  const inviteFriend = useLobbyStore((state) => state.inviteFriendToLobby);
  const isConnected = useSocketStore((state) => state.isConnected);

  const [friendUsername, setFriendUsername] = useState('');

  const isFull = (lobby?.members.length ?? 0) >= 4;
  const isHost = lobby?.hostUserId === user?.id;

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = friendUsername.trim();

    if (!username) return;

    inviteFriend(username);
    setFriendUsername('');
  };

  return (
    <Card className="space-y-3 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 text-zinc-100 shadow-xl">
      <h2 className="font-bold">Invitar amigo a lobby</h2>

      <form onSubmit={handleInvite} className="flex gap-2">
        <Input
          value={friendUsername}
          onChange={(event) => setFriendUsername(event.target.value)}
          placeholder="Nombre de usuario"
          disabled={!isConnected || isFull || !isHost}
          maxLength={32}
        />

        <Button
          type="submit"
          disabled={!isConnected || isFull || !isHost || !friendUsername.trim()}
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
  );
}
