import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type {
  UpdateProfileInput,
  UpdateProfileResponse,
  UserPrivate,
  UserPublic,
} from '@transcendence/shared';
import { ArrowLeft, Loader2, UserX } from 'lucide-react';
import { apiFetch } from '../api/api';
import {
  updateMyAvatar,
  updateMyProfile,
} from '../features/auth/service/authService';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { PrivateProfileView } from '../features/auth/components/PrivateProfileView';
import { PublicProfileView } from '../features/auth/components/PublicProfileView';
import { useLanguage } from '../locales/useLanguage';

type PublicProfileState = {
  username: string;
  user: UserPublic | null;
  notFound: boolean;
};

export function ProfilePage() {
  const { t } = useLanguage();
  const { username } = useParams<{ username?: string }>();
  const currentUser = useAuthStore((state) => state.user) as UserPrivate | null;
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [profileState, setProfileState] = useState<PublicProfileState | null>(
    null
  );

  // Own profile when there is no username or it matches the session user.
  const isOwnProfile =
    !username || (currentUser && currentUser.username === username);

  // Derived state: never show the previous user's data while loading.
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

  const handleAvatarUpload = async (blob: Blob) => {
    await updateMyAvatar(blob);
    // Refresh global auth state to propagate the new avatar throughout the app.
    await checkAuth();
  };

  const handleUpdateProfile = async (
    input: UpdateProfileInput
  ): Promise<UpdateProfileResponse> => {
    const result = await updateMyProfile(input);
    if (result.outcome === 'updated') {
      await checkAuth();
    }
    return result;
  };

  // 1. Own profile (private view)
  if (isOwnProfile && currentUser) {
    return (
      <PrivateProfileView
        user={currentUser}
        onAvatarUpload={handleAvatarUpload}
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  // 2. Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 text-zinc-400">
        <Loader2 className="size-8 animate-spin text-orange-500" />
        <p className="text-sm">
          {t('profile.loading') || 'Loading user profile...'}
        </p>
      </div>
    );
  }

  // 3. User not found (404)
  if (notFound || !publicUser) {
    return (
      <div className="mx-auto my-12 max-w-md space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <div className="flex justify-center">
          <UserX className="size-12 text-zinc-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400">
          {t('profile.userNotFound') || 'User Not Found (404)'}
        </h3>
        <p className="text-sm text-zinc-400">
          {t('profile.userNotFoundDesc') || 'The user'}{' '}
          <span className="font-mono text-white">@{username}</span>{' '}
          {t('profile.doesNotExist') || 'does not exist.'}
        </p>
        <div className="pt-2">
          <Link
            to="/lobby"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            <ArrowLeft className="size-4" />
            {t('profile.backToLobby') || 'Back to Lobby'}
          </Link>
        </div>
      </div>
    );
  }

  // 4. Other user's profile (public view)
  return <PublicProfileView user={publicUser} />;
}
