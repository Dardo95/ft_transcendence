import type { UserPrivate } from '@transcendence/shared';
import { Card } from '../../../components/ui/card';
import { AvatarUpload } from './AvatarUpload';
import { FriendList } from '../../friends/components/FriendListCard';
import { useLanguage } from '../../../locales/useLanguage';

interface PrivateProfileViewProps {
  user: UserPrivate;
  onAvatarUpload: (blob: Blob) => Promise<void>;
}

export function PrivateProfileView({
  user,
  onAvatarUpload,
}: PrivateProfileViewProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* User Information Card */}
      <Card className="flex flex-col items-center gap-6 rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl md:flex-row md:items-start">
        <AvatarUpload
          currentAvatarUrl={user.avatarUrl}
          username={user.username}
          onAvatarUpdated={onAvatarUpload}
        />

        <div className="w-full flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <h2 className="text-2xl font-bold tracking-wide text-white">
                {user.username}
              </h2>
              <span className="rounded-full border border-orange-800/40 bg-orange-950/60 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                User #{user.id}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {t('profile.joined') || 'Registered on'}:{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '2026'}
            </p>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 gap-4 border-t border-zinc-800/80 pt-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-left">
              <span className="block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                {t('profile.email') || 'Email'}
              </span>
              <span className="text-sm break-all text-zinc-200">
                {user.email}
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-left">
              <span className="block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                {t('profile.userId') || 'User ID'}
              </span>
              <span className="text-sm font-semibold text-orange-400">
                #{user.id}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Friends & Social Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FriendList />
        </div>
      </div>
    </div>
  );
}
