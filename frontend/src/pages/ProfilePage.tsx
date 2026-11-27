import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLanguage } from '../locales/useLanguage';

import type { UserPrivate, UserPublic } from '@transcendence/shared';
import { ApiError, apiFetch } from '../api/api';

import { ArrowLeft, Loader2, TriangleAlert } from 'lucide-react';
import { UI } from '@/components/layout/layoutStyles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfilePagePrivate } from '../features/auth/components/ProfilePagePrivate';
import { ProfilePagePublic } from '../features/auth/components/ProfilePagePublic';
import { ProfilePageUnkown } from '../features/auth/components/ProfilePageUnkown';

type PublicProfileStatus = 'success' | 'notFound' | 'error';

type PublicProfileState = {
  username: string;
  user: UserPublic | null;
  status: PublicProfileStatus;
};

/**
 * Shared shell used by every asynchronous profile state so the page never
 * collapses into an unstyled or blank container while data is loading.
 */
function ProfileStateShell({ children }: { children: ReactNode }) {
  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={`${UI.card.header} flex flex-col gap-4`}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function ProfileLoadingView() {
  const { t } = useLanguage();

  return (
    <ProfileStateShell>
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex flex-col items-center justify-center gap-3"
      >
        <Loader2
          className={`text-primary ${UI.icon.lg} ${UI.icon.spinner}`}
          aria-hidden="true"
        />
        <p className={UI.text.small}>
          {t('profile.loading') || 'Loading profile...'}
        </p>
      </div>
    </ProfileStateShell>
  );
}

function ProfileLoadErrorView({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();

  return (
    <ProfileStateShell>
      <div
        role="alert"
        className={`${UI.feedback.error} flex flex-col items-center gap-3`}
      >
        <div className="flex items-center gap-2 font-semibold">
          <TriangleAlert className={UI.icon.sm} aria-hidden="true" />
          <span>
            {t('profile.loadErrorTitle') || 'Could not load this profile'}
          </span>
        </div>
        <p>
          {t('profile.loadError') ||
            'We could not reach the server. Please try again.'}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className={UI.btn.secondary}
        >
          {t('profile.retry') || 'Retry'}
        </Button>
      </div>
    </ProfileStateShell>
  );
}

function ProfileMissingSessionView() {
  const { t } = useLanguage();

  return (
    <ProfileStateShell>
      <h1 className={UI.text.pageTitle}>
        {t('profile.sessionMissingTitle') || 'Session not available'}
      </h1>
      <p className={UI.text.pageSubtitle}>
        {t('profile.sessionMissing') ||
          'Please sign in again to view your profile.'}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link to="/login" className="gap-2 font-semibold">
            <ArrowLeft className={UI.icon.sm} aria-hidden="true" />
            {t('app.general.login') || 'Login'}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/lobby" className="gap-2 font-semibold">
            {t('profile.backToLobby') || 'Back to Lobby'}
          </Link>
        </Button>
      </div>
    </ProfileStateShell>
  );
}

export function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const currentUser = useAuthStore((state) => state.user) as UserPrivate | null;
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const [profileState, setProfileState] = useState<PublicProfileState | null>(
    null
  );
  // Bumping this token re-runs the public profile request after a retry.
  const [retryToken, setRetryToken] = useState(0);

  const isOwnProfile = !username || currentUser?.username === username;

  const profileForCurrentUsername =
    profileState !== null && profileState.username === username
      ? profileState
      : null;

  const loading =
    !isOwnProfile && Boolean(username) && profileForCurrentUsername === null;

  useEffect(() => {
    if (isOwnProfile || !username) return;

    let cancelled = false;

    apiFetch<UserPublic>(`/users/${encodeURIComponent(username)}`, {
      method: 'GET',
    })
      .then((data) => {
        if (!cancelled) {
          setProfileState({ username, user: data, status: 'success' });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        // Only a real 404 means the user does not exist. Network and server
        // failures stay recoverable so the page never lies about missing data.
        const status =
          error instanceof ApiError && error.status === 404
            ? 'notFound'
            : 'error';

        setProfileState({ username, user: null, status });
      });

    return () => {
      cancelled = true;
    };
  }, [username, isOwnProfile, retryToken]);

  const handleRetry = () => {
    setProfileState(null);
    setRetryToken((token) => token + 1);
  };

  // Auth session is still being restored; show the same styled shell instead
  // of a blank page.
  if (!isAuthChecked && !currentUser) {
    return <ProfileLoadingView />;
  }

  if (isOwnProfile) {
    if (currentUser) {
      return <ProfilePagePrivate user={currentUser} />;
    }

    // The route guard normally prevents this, but an empty authenticated state
    // must still render a clean recovery path.
    return <ProfileMissingSessionView />;
  }

  if (loading) {
    return <ProfileLoadingView />;
  }

  if (profileForCurrentUsername?.status === 'error') {
    return <ProfileLoadErrorView onRetry={handleRetry} />;
  }

  if (
    profileForCurrentUsername?.status === 'notFound' ||
    !profileForCurrentUsername?.user
  ) {
    return <ProfilePageUnkown />;
  }

  return <ProfilePagePublic user={profileForCurrentUsername.user} />;
}
