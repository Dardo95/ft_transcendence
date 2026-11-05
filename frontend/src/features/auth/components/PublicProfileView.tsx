import type { UserPublic } from '@transcendence/shared';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { useLanguage } from '../../../locales/useLanguage';
import { UserPlus, UserCheck } from 'lucide-react';

interface PublicProfileViewProps {
  user: UserPublic;
}

export function PublicProfileView({ user }: PublicProfileViewProps) {
  const { t } = useLanguage();
  const friends = useFriendsStore((state) => state.friends);
  const sendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const isFriend = friends.some((f) => f.username === user.username);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-6 items-center">
        {/* Read-only Avatar */}
        <div className="relative size-28 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-800 shrink-0">
          <img
            src={user.avatarUrl || '/default-avatar.png'}
            alt={user.username}
            className="size-full object-cover"
          />
          <span
            className={`absolute bottom-2 right-2 size-3.5 rounded-full border-2 border-zinc-900 ${
              user.isOnline ? 'bg-emerald-500' : 'bg-zinc-600'
            }`}
          />
        </div>

        {/* Public Information (No Email) */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <span className="px-2 py-0.5 w-fit mx-auto sm:mx-0 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
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
                className="gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
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
