import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

export function LobbyStatusCard() {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const lobby = useLobbyStore((state) => state.lobby);
  const leaveLobby = useLobbyStore((state) => state.leaveLobby);

  const isHost = lobby?.hostUserId === user?.id;

  return (
    <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 text-zinc-100 shadow-xl">
      {lobby ? (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-orange-300">
              {t('app.yourLobby') || 'Tu lobby'}
            </h2>

            <p className="mt-1 text-xs break-all text-zinc-400">
              ID: {lobby.id}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {t('app.players') || 'Jugadores'} ({lobby.members.length}/4)
            </h3>

            {isHost && (
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs text-orange-300">
                {t('app.host') || 'Anfitrión'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {lobby.members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/70 p-3"
              >
                <div>
                  <p className="font-medium">
                    {member.username}
                    {member.userId === user?.id
                      ? ` ${t('app.youLabel') || '(Tú)'}`
                      : ''}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {member.isHost
                      ? t('app.host') || 'Anfitrión'
                      : t('app.guest') || 'Invitado'}
                  </p>
                </div>

                <span className="text-emerald-400">●</span>
              </div>
            ))}
          </div>
          {lobby.members.length > 1 && (
            <Button type="button" variant="destructive" onClick={leaveLobby}>
              {t('app.leaveGroup') || 'Abandonar grupo'}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
          <div>
            <h2 className="text-lg font-bold text-orange-300">
              {t('app.preparingGroup') || 'Preparando tu grupo...'}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {t('app.syncingLobby') ||
                'Estamos sincronizando tu lobby con el servidor.'}
            </p>
          </div>

          <span className="animate-pulse text-orange-400">
            {t('app.connectingStatus') || 'Conectando...'}
          </span>
        </div>
      )}
    </Card>
  );
}
