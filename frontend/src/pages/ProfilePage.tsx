import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { UserPrivate, UserPublic } from '@transcendence/shared';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { PrivateProfileView } from '../features/auth/components/PrivateProfileView';
import { PublicProfileView } from '../features/auth/components/PublicProfileView';
import { apiFetch } from '../api/api';
import { useLanguage } from '../locales/useLanguage';
import { Loader2, ArrowLeft, UserX } from 'lucide-react';

export function ProfilePage() {
  const { t } = useLanguage();
  const { username } = useParams<{ username?: string }>();
  const currentUser = useAuthStore((state) => state.user) as UserPrivate | null;
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [publicUser, setPublicUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Check if viewing authenticated user's own profile or a public user's profile
  const isOwnProfile = !username || (currentUser && currentUser.username === username);

  useEffect(() => {
    if (!isOwnProfile && username) {
      setLoading(true);
      setNotFound(false);

      apiFetch<UserPublic>(`/users/${encodeURIComponent(username)}`, {
        method: 'GET',
      })
        .then((data) => {
          setPublicUser(data);
        })
        .catch(() => {
          setNotFound(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username, isOwnProfile]);

  const handleAvatarUpload = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');

    await fetch('/api/users/me/avatar', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    // Refresh global auth state to propagate the new avatar throughout the app
    await checkAuth();
  };

  // 1. Own profile (Private view)
  if (isOwnProfile && currentUser) {
    return (
      <PrivateProfileView
        user={currentUser}
        onAvatarUpload={handleAvatarUpload}
      />
    );
  }

  // 2. Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-400 gap-3">
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
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-center">
          <UserX className="size-12 text-zinc-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400">
          {t('profile.userNotFound') || 'User Not Found (404)'}
        </h3>
        <p className="text-sm text-zinc-400">
          {t('profile.userNotFoundDesc') || 'The user'}{' '}
          <span className="text-white font-mono">@{username}</span>{' '}
          {t('profile.doesNotExist') || 'does not exist.'}
        </p>
        <div className="pt-2">
          <Link
            to="/lobby"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t('app.general.lobby') || 'Back to Lobby'}
          </Link>
        </div>
      </div>
    );
  }

  // 4. Other user's profile (Public view)
  return <PublicProfileView user={publicUser} />;
}
