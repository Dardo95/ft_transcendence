import type { UserPublic } from '@transcendence/shared';
import { useLanguage } from '../../../locales/useLanguage';
import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { LevelProgress } from './LevelProgress';
import { Button } from '../../../components/ui/button';

import { UserCheck, UserPlus, UserRound } from 'lucide-react';
import defaultAvatar from '../../../assets/default.jpg';

interface PublicProfileViewProps {
  user: UserPublic;
}

const SECTION_CARD =
  'rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-sm sm:p-8';
const INNER_BOX = 'rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5';
const LABEL =
  'text-[11px] font-semibold tracking-wider text-zinc-400 uppercase';
const ORANGE_BADGE =
  'inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-400 uppercase';

/**
 * Public profile view.
 * Shows every UserPublic property using the same visual tokens as the
 * About Us and Project pages.
 */
export function PublicProfileView({ user }: PublicProfileViewProps) {
  const { t } = useLanguage();
  const friends = useFriendsStore((state) => state.friends);
  const sendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const isFriend = friends.some((f) => f.username === user.username);

  const level = Math.floor(user.xp / 100);
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';
  const statusLabel = user.isOnline
    ? t('profile.statusOnline') || 'Online'
    : t('profile.statusOffline') || 'Offline';

  const details = [

    {
      label: t('profile.joined') || 'Registered on',
      value: registrationDate,
      tone: 'text-white',
    },
  ];

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Public identity */}
        <section className={SECTION_CARD}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative size-28 shrink-0">
                <div className="size-28 overflow-hidden rounded-2xl border-2 border-orange-500/40 bg-zinc-800 shadow-lg">
                  <img
                    src={user.avatarUrl || defaultAvatar}
                    alt={user.username}
                    className="size-full object-cover"
                  />
                </div>
                <span
                  className={`absolute right-1.5 bottom-1.5 size-3.5 rounded-full border-2 border-zinc-900 ${
                    user.isOnline ? 'bg-emerald-500' : 'bg-zinc-600'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <span className={ORANGE_BADGE}>
                  <UserRound className="size-3.5" aria-hidden="true" />
                  {t('profile.publicProfileBadge') || 'Player Profile'}
                </span>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  {user.username}
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                    #{user.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
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
            </div>

            <div className="self-center sm:self-auto">
              {isFriend ? (
                <Button
                  disabled
                  variant="secondary"
                  className="gap-2 border border-emerald-900/60 bg-emerald-950/50 text-xs font-semibold text-emerald-400"
                >
                  <UserCheck className="size-4" aria-hidden="true" />
                  {t('profile.alreadyFriends') || 'Friends'}
                </Button>
              ) : (
                <Button
                  onClick={() => sendRequest(user.username)}
                  className="gap-2 bg-orange-600 text-xs font-semibold text-white hover:bg-orange-500"
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  {t('profile.addFriend') || 'Add Friend'}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Statistics and public properties */}
        <section className={SECTION_CARD}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('profile.statistics') || 'Statistics'}
            </h2>
            <span className={ORANGE_BADGE}>
              {t('profile.level') || 'Level'} {level}
            </span>
          </div>

          <div className={`${INNER_BOX} mt-5`}>
            <LevelProgress xp={user.xp} />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((field) => (
              <div key={field.label} className={INNER_BOX}>
                <dt className={LABEL}>{field.label}</dt>
                <dd
                  className={`mt-1 text-sm font-semibold break-all ${field.tone}`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
