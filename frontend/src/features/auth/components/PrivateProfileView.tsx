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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* User Information Card */}
      <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 items-center md:items-start">
        <AvatarUpload
          currentAvatarUrl={user.avatarUrl}
          username={user.username}
          onAvatarUpdated={onAvatarUpload}
        />

        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {user.username}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-950/60 text-orange-400 border border-orange-800/40">
                User #{user.id}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {t('profile.joined') || 'Registered on'}:{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '2026'}
            </p>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800 text-left">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                {t('profile.email') || 'Email'}
              </span>
              <span className="text-sm text-zinc-200 break-all">{user.email}</span>
            </div>

            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800 text-left">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FriendList />
        </div>
      </div>
    </div>
  );
}
