import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useSocketStore } from '@/stores/useSocketStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

export function IncomingLobbyRequest() {
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

  return (
    <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-zinc-100 shadow-xl">
      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="space-y-2 rounded-lg border border-zinc-700 p-3"
          >
            <p className="text-center text-sm">
              <strong>{invitation.inviterUsername}</strong>{' '}
              {t('app.invitesYou') || 'te invita a su lobby.'}
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!isConnected || (lobby?.members.length ?? 0) > 1}
                className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
                onClick={() => acceptLobbyInvitation(invitation.id)}
              >
                {t('app.sendButton') || 'Aceptar'}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                disabled={!isConnected}
                onClick={() => rejectLobbyInvitation(invitation.id)}
              >
                {t('app.cancelButton') || 'Rechazar'}
              </Button>
            </div>

            {(lobby?.members.length ?? 0) > 1 && (
              <p className="text-xs text-zinc-400">
                {t('app.leaveBeforeAccept') ||
                  'Abandona tu grupo actual antes de aceptar otra invitación.'}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
