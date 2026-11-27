import { IncomingLobbyRequest } from './IncomingLobbyRequest';
import { IncomingFriendRequest } from './IncomingFriendRequest';

import { UI } from '@/components/layout/layoutStyles';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';
import { useLanguage } from '@/locales/useLanguage';

type IncomingRequestsVariant = 'lobby' | 'profile';

interface IncomingRequestsProps {
  variant?: IncomingRequestsVariant;
}

export function IncomingRequests({ variant = 'lobby' }: IncomingRequestsProps) {
  const { t } = useLanguage();
  const lobbyInvitations = useLobbyStore((state) => state.lobbyInvitations);
  const friendRequests = useFriendsStore(
    (state) => state.incomingFriendRequests
  );
  const isLoading = useFriendsStore((state) => state.isLoading);

  const hasLobbyInvitations = lobbyInvitations.length > 0;
  const hasFriendRequests = friendRequests.length > 0;

  if (!hasLobbyInvitations && !hasFriendRequests && isLoading) {
    return null;
  }

  return (
    <>
      {hasLobbyInvitations && (
        <div className="mb-1">
          <IncomingLobbyRequest variant={variant} />
        </div>
      )}

      {hasFriendRequests && (
        <div className="mb-1">
          <IncomingFriendRequest variant={variant} />
        </div>
      )}

      {!hasLobbyInvitations && !hasFriendRequests && !isLoading && (
        <p className={UI.list.profileEmpty}>
          {t('app.friends.noIncomingRequests') || 'No pending requests.'}
        </p>
      )}
    </>
  );
}
