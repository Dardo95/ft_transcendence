import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/stores/useSocketStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';

export function LobbyInvitationsCard() {
  const isConnected = useSocketStore((state) => state.isConnected);
  const lobby = useLobbyStore((state) => state.lobby);
  const invitations = useLobbyStore((state) => state.invitations);
  const acceptInvitation = useLobbyStore((state) => state.acceptInvitation);
  const rejectInvitation = useLobbyStore((state) => state.rejectInvitation);

  return (
    <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-zinc-100 shadow-xl">
      <h2 className="mb-3 font-bold text-orange-300">
        Invitaciones pendientes
      </h2>

      {invitations.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No tienes invitaciones pendientes.
        </p>
      ) : (
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="space-y-2 rounded-lg border border-zinc-700 p-3"
            >
              <p className="text-sm">
                <strong>{invitation.inviterUsername}</strong> te invita a su
                lobby.
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!isConnected || (lobby?.members.length ?? 0) > 1}
                  onClick={() => acceptInvitation(invitation.id)}
                  className="flex-1 bg-emerald-700 text-white hover:bg-emerald-600"
                >
                  Aceptar
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!isConnected}
                  onClick={() => rejectInvitation(invitation.id)}
                >
                  Rechazar
                </Button>
              </div>

              {(lobby?.members.length ?? 0) > 1 && (
                <p className="text-xs text-zinc-400">
                  Abandona tu grupo actual antes de aceptar otra invitación.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
