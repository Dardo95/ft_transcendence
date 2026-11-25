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
    variant === 'profile' ? UI.card.incomingProfile : UI.card.incoming;

  return (
    <div className={UI.form.stack}>
      {incomingFriendRequests.map((req) => (
        <div key={req.id} className={cardClass}>
          <p className={UI.text.center}>
            <strong>{req.from?.username || t('profile.someone')}</strong>{' '}
            {t('app.friends.friendRequestText') || 'sent you a friend request.'}
          </p>

          <div className={UI.row.actions}>
            <Button
              size="sm"
              className={`${UI.btn.success} flex-1`}
              onClick={() => acceptFriendRequest(req.id)}
            >
              {t('app.lobby.acceptButton') || 'Accept'}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => rejectFriendRequest(req.id)}
            >
              {t('app.friends.rejectButton') || 'Reject'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
