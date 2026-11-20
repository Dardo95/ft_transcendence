import { useEffect, useState } from 'react';
import type { UserPublic } from '@transcendence/shared';
import { toast } from 'sonner';
import { useLanguage } from '../../../locales/useLanguage';
import { useFriendsStore } from '../../friends/store/useFriendsStore';
import { LevelProgress } from './LevelProgress';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';
import { UI } from '@/components/layout/layoutStyles';

import { Ban, Unlock, UserCheck, UserPlus, UserRound } from 'lucide-react';
import defaultAvatar from '../../../assets/default.jpg';

interface PublicProfileViewProps {
  user: UserPublic;
}

/**
 * Public profile view.
 * Shows every UserPublic property using the same visual tokens as the
 * About Us and Project pages. Blocked users lose every social action and
 * their online status is hidden.
 */
export function PublicProfileView({ user }: PublicProfileViewProps) {
  const { t } = useLanguage();
  const friends = useFriendsStore((state) => state.friends);
  const blockedUsers = useFriendsStore((state) => state.blockedUsers);
  const sendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const blockUser = useFriendsStore((state) => state.blockUser);
  const unblockUser = useFriendsStore((state) => state.unblockUser);
  const fetchBlockedUsers = useFriendsStore((state) => state.fetchBlockedUsers);
  const isFriend = friends.some((f) => f.username === user.username);
  const isBlocked = blockedUsers.some((u) => u.username === user.username);

  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void fetchBlockedUsers();
  }, [fetchBlockedUsers]);

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
      fullWidth: true,
    },
  ];

  const handleBlock = async () => {
    setIsPending(true);
    setActionError(null);
    try {
      await blockUser(user.username);
      toast.success(
        t('profile.blockedSuccess') || 'User blocked successfully.'
      );
    } catch {
      setActionError(
        t('profile.blockFailed') || 'Could not block the user. Try again.'
      );
    } finally {
      setIsPending(false);
      setIsBlockOpen(false);
    }
  };

  const handleUnblock = async () => {
    setIsPending(true);
    setActionError(null);
    try {
      await unblockUser(user.username);
      toast.success(
        t('profile.unblockedSuccess') || 'User unblocked successfully.'
      );
    } catch {
      setActionError(
        t('profile.unblockFailed') || 'Could not unblock the user. Try again.'
      );
    } finally {
      setIsPending(false);
    }
  };

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
                {!isBlocked && (
                  <span
                    className={`${UI.avatar.statusDot} right-1.5 bottom-1.5 size-3.5 ${
                      user.isOnline ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0">
                <span className={UI.badge.pill}>
                  <UserRound className={UI.icon.xs} aria-hidden="true" />
                  {t('profile.publicProfileBadge') || 'Player Profile'}
                </span>

                <h1 className="text-foreground mt-3 text-2xl font-extrabold md:text-3xl">
                  {user.username}
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className={UI.badge.tag}>#{user.id}</span>
                  {isBlocked ? (
                    <span
                      className={`${UI.badge.status} ${UI.badge.statusBlocked}`}
                    >
                      <Ban className={UI.icon.xs} aria-hidden="true" />
                      {t('profile.blockedUser') || 'Blocked user'}
                    </span>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 self-center sm:items-end sm:self-auto">
              {isBlocked ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => void handleUnblock()}
                  className={UI.btn.unblock}
                >
                  <Unlock className={UI.icon.sm} aria-hidden="true" />
                  {t('profile.unblockUser') || 'Unblock user'}
                </Button>
              ) : (
                <>
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

                  <AlertDialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        className={UI.btn.block}
                      >
                        <Ban className={UI.icon.sm} aria-hidden="true" />
                        {t('profile.blockUser') || 'Block user'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('profile.blockUserTitle') || 'Block user'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {(
                            t('profile.blockUserConfirm') ||
                            'Are you sure you want to block {username}?'
                          ).replace('{username}', user.username)}{' '}
                          {t('profile.blockUserWarning') ||
                            'You will stop being friends, pending requests will be cancelled, and you will not be able to send friend requests or game invitations to each other.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center justify-end gap-2">
                        <AlertDialogCancel>
                          {t('profile.cancel') || 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => void handleBlock()}
                        >
                          {t('profile.blockButton') || 'Block'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {actionError && (
                <p className={UI.feedback.inlineError} role="alert">
                  {actionError}
                </p>
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
              <div
                key={field.label}
                className={`${UI.card.innerPadded} ${
                  field.fullWidth ? UI.shell.detailGridFull : ''
                }`}
              >
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
