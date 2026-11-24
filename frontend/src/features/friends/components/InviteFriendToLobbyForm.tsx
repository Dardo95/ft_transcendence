import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { useLanguage } from '@/locales/useLanguage';

import { USERNAME_MAX_LENGTH } from '@transcendence/shared';
import { validateUsername } from '@/features/auth/utils/validation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UI } from '@/components/layout/layoutStyles';

export function InviteFriendToLobbyForm() {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const lobby = useLobbyStore((state) => state.lobby);
  const inviteFriend = useLobbyStore((state) => state.inviteFriendToLobby);
  const isConnected = useSocketStore((state) => state.isConnected);

  const [friendUsername, setFriendUsername] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const isFull = (lobby?.members.length ?? 0) >= 4;
  const isHost = lobby?.hostUserId === user?.id;

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = friendUsername.trim();
    const usernameError = validateUsername(username);

    if (usernameError) {
      setValidationError(t(usernameError));
      return;
    }

    setValidationError(null);
    inviteFriend(username);
    setFriendUsername('');
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFriendUsername(event.target.value);
    // Clear a stale error as soon as the user edits the field.
    if (validationError) setValidationError(null);
  };

  return (
    <Card className="text-foreground space-y-3 p-5">
      <h2 className={UI.text.sectionTitle}>
        {t('app.friends.inviteLobbyTitle') || 'Invite friend to lobby'}
      </h2>

      <form onSubmit={handleInvite} className={UI.row.actions}>
        <Input
          value={friendUsername}
          onChange={handleUsernameChange}
          placeholder={t('app.friends.inviteLobbyPlaceholder') || 'Username'}
          disabled={!isConnected || isFull || !isHost}
          maxLength={USERNAME_MAX_LENGTH}
        />

        <Button
          type="submit"
          disabled={!isConnected || isFull || !isHost || !friendUsername.trim()}
          className="text-xs"
        >
          {t('app.friends.inviteLobbyButton') || 'Invite'}
        </Button>
      </form>

      {validationError && (
        <p className={`${UI.feedback.banner} ${UI.feedback.error}`}>
          {validationError}
        </p>
      )}

      <p className={UI.text.small}>
        {isFull
          ? t('app.friends.lobbyFull') || 'The lobby is full.'
          : t('app.friends.inviteOnlyFriends') ||
            'You can only invite friends with an accepted friendship.'}
      </p>
    </Card>
  );
}
