import { useFriendsStore } from '../store/useFriendsStore';
import { useLanguage } from '@/locales/useLanguage';

import { Button } from '@/components/ui/button';

export function IncomingFriendRequest() {
  const { t } = useLanguage();
  const { incomingFriendRequests, acceptFriendRequest, rejectFriendRequest } =
    useFriendsStore();

  if (incomingFriendRequests.length === 0) return null;

  return (
      <div className="space-y-3">
        {incomingFriendRequests.map((req) => (
          <div
            key={req.id}
            className="space-y-2 rounded-lg border border-zinc-700 bg-zinc-950/40 p-3 text-zinc-100 shadow-xl"
          >
            <p className="text-center text-sm">
              <strong>{req.from?.username || 'Alguien'}</strong>{' '}
              {t('app.friends.friendRequestText') ||
                'te envió una solicitud de amistad.'}
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
                onClick={() => acceptFriendRequest(req.id)}
              >
                {t('app.lobby.acceptButton') || 'Aceptar'}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => rejectFriendRequest(req.id)}
              >
                {t('app.friends.cancelButton') || 'Rechazar'}
              </Button>
            </div>
          </div>
        ))}
      </div>
  );
}
