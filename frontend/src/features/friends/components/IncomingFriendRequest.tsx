import { useFriendsStore } from '../store/useFriendsStore';
import { useLanguage } from '@/locales/useLanguage';

import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

type IncomingFriendRequestVariant = 'lobby' | 'profile';

interface IncomingFriendRequestProps {
  variant?: IncomingFriendRequestVariant;
}

export function IncomingFriendRequest({
  variant = 'lobby',
}: IncomingFriendRequestProps) {
  const { t } = useLanguage();
  const { incomingFriendRequests, acceptFriendRequest, rejectFriendRequest } =
    useFriendsStore();

  if (incomingFriendRequests.length === 0) return null;

  const cardClass =
    variant === 'profile'
      ? `space-y-2 p-3.5 text-foreground ${UI.card.inner}`
      : 'space-y-2 rounded-lg border border-input bg-background/40 p-3 text-foreground shadow-xl';

  return (
    <div className="space-y-3">
      {incomingFriendRequests.map((req) => (
        <div key={req.id} className={cardClass}>
          <p className="text-center text-sm">
            <strong>{req.from?.username || t('profile.someone')}</strong>{' '}
            {t('app.friends.friendRequestText') ||
              'te envió una solicitud de amistad.'}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-success text-success-foreground hover:bg-success/80 flex-1"
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
