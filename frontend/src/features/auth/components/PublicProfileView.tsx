import type { UserPublic } from '@transcendence/shared';
import { useLanguage } from '../../../locales/useLanguage';
import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { LevelProgress } from './LevelProgress';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

import { UserCheck, UserPlus, UserRound } from 'lucide-react';
import defaultAvatar from '../../../assets/default.jpg';

interface PublicProfileViewProps {
  user: UserPublic;
}

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
      tone: 'text-foreground',
    },
  ];

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        {/* Public identity */}
        <Card className={UI.card.sectionLarge}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative size-28 shrink-0">
                <div className="border-primary/40 bg-secondary size-28 overflow-hidden rounded-2xl border-2 shadow-lg">
                  <img
                    src={user.avatarUrl || defaultAvatar}
                    alt={user.username}
                    className={UI.avatar.full}
                  />
                </div>
                <span
                  className={`${UI.avatar.statusDot} right-1.5 bottom-1.5 size-3.5 ${
                    user.isOnline ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <span className={UI.badge.pill}>
                  <UserRound className={UI.icon.xs} aria-hidden="true" />
                  {t('profile.publicProfileBadge') || 'Player Profile'}
                </span>

                <h1 className="text-foreground mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
                  {user.username}
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className={UI.badge.tag}>#{user.id}</span>
                  <span
                    className={`${UI.badge.status} ${
                      user.isOnline
                        ? UI.badge.statusOnline
                        : UI.badge.statusOffline
                    }`}
                  >
                    <span
                      className={`${UI.feedback.dot} ${
                        user.isOnline ? 'bg-success' : 'bg-muted-foreground'
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
                  className={`${UI.badge.statusOnline} gap-2 border text-xs font-semibold`}
                >
                  <UserCheck className={UI.icon.sm} aria-hidden="true" />
                  {t('profile.alreadyFriends') || 'Friends'}
                </Button>
              ) : (
                <Button
                  onClick={() => sendRequest(user.username)}
                  className="gap-2 text-xs font-semibold"
                >
                  <UserPlus className={UI.icon.sm} aria-hidden="true" />
                  {t('profile.addFriend') || 'Add Friend'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Statistics and public properties */}
        <Card className={UI.card.sectionLarge}>
          <div className={UI.row.header}>
            <h2 className={UI.text.sectionTitle}>
              {t('profile.statistics') || 'Statistics'}
            </h2>
            <span className={UI.badge.pill}>
              {t('profile.level') || 'Level'} {level}
            </span>
          </div>

          <div className={`mt-5 ${UI.card.innerPadded}`}>
            <LevelProgress xp={user.xp} />
          </div>

          <dl className={UI.shell.detailGrid}>
            {details.map((field) => (
              <div key={field.label} className={UI.card.innerPadded}>
                <dt className={UI.text.sublabel}>{field.label}</dt>
                <dd
                  className={`text-foreground ${field.tone} ${UI.text.value}`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
