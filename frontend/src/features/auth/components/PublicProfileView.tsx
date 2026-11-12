import type { UserPublic } from '@transcendence/shared';

import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { useLanguage } from '../../../locales/useLanguage';

import { UserPlus, UserCheck } from 'lucide-react';
import defaultAvatar from '../../../assets/default.jpg';

interface PublicProfileViewProps {
  user: UserPublic;
}

export function PublicProfileView({ user }: PublicProfileViewProps) {
  const { t } = useLanguage();
  const friends = useFriendsStore((state) => state.friends);
  const sendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const isFriend = friends.some((f) => f.username === user.username);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card className="flex flex-col items-center gap-6 rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl sm:flex-row">
        {/* Read-only Avatar */}
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-800">
          <img
            src={user.avatarUrl || defaultAvatar}
            alt={user.username}
            className="size-full object-cover"
          />
          <span
            className={`absolute right-2 bottom-2 size-3.5 rounded-full border-2 border-zinc-900 ${
              user.isOnline ? 'bg-emerald-500' : 'bg-zinc-600'
            }`}
          />
        </div>

        {/* Public Information (No Email) */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <span className="mx-auto w-fit rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300 sm:mx-0">
              User #{user.id}
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            {user.isOnline
              ? t('profile.statusOnline') || 'Online'
              : t('profile.statusOffline') || 'Offline'}
          </p>

          <div className="pt-2">
            {isFriend ? (
              <Button disabled variant="secondary" className="gap-2 text-xs">
                <UserCheck className="size-4 text-emerald-400" />
                {t('profile.alreadyFriends') || 'Friends'}
              </Button>
            ) : (
              <Button
                onClick={() => sendRequest(user.username)}
                className="gap-2 bg-orange-600 text-xs font-semibold text-white hover:bg-orange-500"
              >
                <UserPlus className="size-4" />
                {t('profile.addFriend') || 'Add Friend'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
