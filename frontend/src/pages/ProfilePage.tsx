import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLanguage } from '../locales/useLanguage';

import type { UserPrivate, UserPublic } from '@transcendence/shared';
import { apiFetch } from '../api/api';

import { Loader2 } from 'lucide-react';
import { UI } from '@/components/layout/layoutStyles';
import { Card } from '@/components/ui/card';
import { ProfilePagePrivate } from '../features/auth/components/ProfilePagePrivate';
import { ProfilePagePublic } from '../features/auth/components/ProfilePagePublic';
import { ProfilePageUnkown } from '../features/auth/components/ProfilePageUnkown';

type PublicProfileState = {
  username: string;
  user: UserPublic | null;
  notFound: boolean;
};

export function ProfilePage() {
  const { t } = useLanguage();
  const { username } = useParams<{ username?: string }>();
  const currentUser = useAuthStore((state) => state.user) as UserPrivate | null;
  const [profileState, setProfileState] = useState<PublicProfileState | null>(
    null
  );

  const isOwnProfile = !username || currentUser?.username === username;

  const loading =
    !isOwnProfile && Boolean(username) && profileState?.username !== username;
  const publicUser =
    profileState !== null && profileState.username === username
      ? profileState.user
      : null;
  const notFound =
    !isOwnProfile &&
    profileState !== null &&
    profileState.username === username &&
    profileState.notFound;

  useEffect(() => {
    if (isOwnProfile || !username) return;

    let cancelled = false;

    apiFetch<UserPublic>(`/users/${encodeURIComponent(username)}`, {
      method: 'GET',
    })
      .then((data) => {
        if (!cancelled) {
          setProfileState({ username, user: data, notFound: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileState({ username, user: null, notFound: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username, isOwnProfile]);

  if (isOwnProfile && currentUser) {
    return <ProfilePagePrivate user={currentUser} />;
  }

  if (loading) {
    return (
      <div className={UI.shell.page}>
        <div className={UI.shell.container}>
          <Card className="text-muted-foreground flex flex-col items-center justify-center gap-3 p-12">
            <Loader2
              className={`text-primary ${UI.icon.lg} ${UI.icon.spinner}`}
            />
            <p className="text-sm">
              {t('profile.loading') || 'Loading user profile...'}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (notFound || !publicUser) {
    return <ProfilePageUnkown />;
  }

  return <ProfilePagePublic user={publicUser} />;
}
