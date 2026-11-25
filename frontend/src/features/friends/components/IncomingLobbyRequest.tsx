import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

import { useSocketStore } from '@/stores/useSocketStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

type IncomingLobbyRequestVariant = 'lobby' | 'profile';

interface IncomingLobbyRequestProps {
  variant?: IncomingLobbyRequestVariant;
}

export function IncomingLobbyRequest({
  variant = 'lobby',
}: IncomingLobbyRequestProps) {
  const { t } = useLanguage();
  const isConnected = useSocketStore((state) => state.isConnected);
  const lobby = useLobbyStore((state) => state.lobby);
  const invitations = useLobbyStore((state) => state.lobbyInvitations);
  const acceptLobbyInvitation = useLobbyStore(
    (state) => state.acceptLobbyInvitation
  );
  const rejectLobbyInvitation = useLobbyStore(
    (state) => state.rejectLobbyInvitation
  );

  if (invitations.length === 0) return null;

  const cardClass =
    variant === 'profile' ? UI.card.incomingProfile : UI.card.incoming;

  return (
    <div className={UI.form.stack}>
      {invitations.map((invitation) => (
        <div key={invitation.id} className={cardClass}>
          <p className={UI.text.center}>
            <strong>{invitation.inviterUsername}</strong>{' '}
            {t('app.lobby.invitesYou') || 'invites you to their lobby.'}
          </p>

          <div className={UI.row.actions}>
            <Button
              size="sm"
              disabled={!isConnected || (lobby?.members.length ?? 0) > 1}
              className={`${UI.btn.success} flex-1`}
              onClick={() => acceptLobbyInvitation(invitation.id)}
            >
              {t('app.lobby.acceptButton') || 'Accept'}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              disabled={!isConnected}
              onClick={() => rejectLobbyInvitation(invitation.id)}
            >
              {t('app.friends.rejectButton') || 'Reject'}
            </Button>
          </div>

          {(lobby?.members.length ?? 0) > 1 && (
            <p className={UI.text.small}>
              {t('app.lobby.leaveBeforeAccept') ||
                'Leave your current group before accepting another invitation.'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
