import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFriendsStore } from '../store/useFriendsStore';

export function IncomingFriendRequest() {
  const {
    incomingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriendsStore();

  if (incomingFriendRequests.length === 0) return null;

  return (
    <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-zinc-100 shadow-xl">
      {incomingFriendRequests.length > 0 && (
        <div className="space-y-3">
          {incomingFriendRequests.map((req) => (
            <div
              key={req.id}
              className="space-y-2 rounded-lg border border-zinc-700 p-3"
            >
              <p className="text-sm text-center">
                <strong>{req.from?.username || 'Alguien'}</strong> te envió una
                solicitud de amistad.
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
                  onClick={() => acceptFriendRequest(req.id)}
                >
                  Aceptar
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => rejectFriendRequest(req.id)}
                >
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}