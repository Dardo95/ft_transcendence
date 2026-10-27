import { IncomingLobbyRequest } from '@/features/lobby/components/IncomingLobbyRequest';
import { IncomingFriendRequest } from '@/features/friends/components/IncomingFriendRequest';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';

export function IncomingRequests() {
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
          <IncomingLobbyRequest />
        </div>
      )}

      {hasFriendRequests && (
        <div className="mb-1">
          <IncomingFriendRequest />
        </div>
      )}
    </>
  );
}
