import type { UserPublic } from '@transcendence/shared';

import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { useLanguage } from '../../../locales/useLanguage';
import { LevelProgress } from './LevelProgress';

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

  const level = Math.floor(user.xp / 100) + 1;
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—';
  const statusLabel = user.isOnline
    ? t('profile.statusOnline') || 'Online'
    : t('profile.statusOffline') || 'Offline';

  const details = [
    {
      label: t('profile.userId') || 'User ID',
      value: `#${user.id}`,
      accent: true,
    },
    {
      label: t('profile.totalXp') || 'Total XP',
      value: String(user.xp),
    },
    {
      label: t('profile.level') || 'Level',
      value: String(level),
    },
    {
      label: t('profile.joined') || 'Registered on',
      value: registrationDate,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Read-only avatar */}
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

          {/* Public identity */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <span className="mx-auto w-fit rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300 sm:mx-0">
                #{user.id}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                user.isOnline
                  ? 'border-emerald-900/60 bg-emerald-950/50 text-emerald-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400'
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  user.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                }`}
              />
              {statusLabel}
            </span>
          </div>
        </div>

        {/* XP and level */}
        <div className="mt-6">
          <LevelProgress xp={user.xp} />
        </div>

        {/* Public properties */}
        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
            >
              <dt className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                {field.label}
              </dt>
              <dd
                className={`mt-0.5 text-sm break-all ${
                  field.accent
                    ? 'font-semibold text-orange-400'
                    : 'text-zinc-200'
                }`}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 border-t border-zinc-800/80 pt-4">
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
      </Card>
    </div>
  );
}
