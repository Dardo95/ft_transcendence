import { IncomingLobbyRequest } from './IncomingLobbyRequest';
import { IncomingFriendRequest } from './IncomingFriendRequest';

import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';

type IncomingRequestsVariant = 'lobby' | 'profile';

interface IncomingRequestsProps {
  variant?: IncomingRequestsVariant;
}

export function IncomingRequests({ variant = 'lobby' }: IncomingRequestsProps) {
  const lobbyInvitations = useLobbyStore((state) => state.lobbyInvitations);
  const friendRequests = useFriendsStore(
    (state) => state.incomingFriendRequests
  );

  const hasLobbyInvitations = lobbyInvitations.length > 0;
  const hasFriendRequests = friendRequests.length > 0;

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
    </>
  );
}
