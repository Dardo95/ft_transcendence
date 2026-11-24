import { CircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

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
    <Card className="p-5">
      {lobby ? (
        <div className="space-y-5">
          <div>
            <span className="text-primary text-xs font-bold tracking-wider uppercase">
              {t('app.lobby.yourLobby') || 'Your lobby'}
            </span>

            <span className="text-muted-foreground ml-2 text-xs break-all">
              | ID: {lobby.id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h4>
              {t('app.lobby.players') || 'Players'} ({lobby.members.length}/4)
            </h4>

            {isHost && (
              <span className="bg-primary/15 text-primary rounded-full px-3 py-1 text-xs">
                {t('app.lobby.host') || 'Host'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {lobby.members.map((member) => (
              <div
                key={member.userId}
                className={`flex items-center justify-between p-3 ${UI.card.inner}`}
              >
                <div>
                  <p className="font-medium">
                    {member.username}
                    {member.userId === user?.id
                      ? ` ${t('app.friends.youLabel') || '(You)'}`
                      : ''}
                  </p>

                  <p className={UI.text.small}>
                    {member.isHost
                      ? t('app.lobby.host') || 'Host'
                      : t('app.lobby.guest') || 'Guest'}
                  </p>
                </div>

                <CircleIcon
                  className="fill-success text-success h-3 w-3"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
          {lobby.members.length > 1 && (
            <Button type="button" variant="destructive" onClick={leaveLobby}>
              {t('app.lobby.leaveGroup') || 'Leave group'}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
          <div>
            <h2 className="text-primary text-lg font-bold">
              {t('app.lobby.preparingGroup') || 'Preparing your group...'}
            </h2>

            <p className="text-muted-foreground mt-2 text-sm">
              {t('app.lobby.syncingLobby') ||
                'We are syncing your lobby with the server.'}
            </p>
          </div>

          <span className="text-primary animate-pulse">
            {t('app.general.connectingStatus') || 'Connecting...'}
          </span>
        </div>
      )}
    </Card>
  );
}
