import { Button } from '@/components/ui/button';

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
    variant === 'profile'
      ? 'space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-zinc-100'
      : 'space-y-2 rounded-lg border border-zinc-700 bg-zinc-950/40 p-3 text-zinc-100 shadow-xl';

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div key={invitation.id} className={cardClass}>
          <p className="text-center text-sm">
            <strong>{invitation.inviterUsername}</strong>{' '}
            {t('app.lobby.invitesYou') || 'te invita a su lobby.'}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={!isConnected || (lobby?.members.length ?? 0) > 1}
              className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
              onClick={() => acceptLobbyInvitation(invitation.id)}
            >
              {t('app.lobby.acceptButton') || 'Aceptar'}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              disabled={!isConnected}
              onClick={() => rejectLobbyInvitation(invitation.id)}
            >
              {t('app.friends.cancelButton') || 'Rechazar'}
            </Button>
          </div>

          {(lobby?.members.length ?? 0) > 1 && (
            <p className="text-xs text-zinc-400">
              {t('app.lobby.leaveBeforeAccept') ||
                'Abandona tu grupo actual antes de aceptar otra invitación.'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
