import { useState } from 'react';
import { useLanguage } from '@/locales/useLanguage';

import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Ban, EyeIcon, XIcon } from 'lucide-react';
import defaultAvatar from '@/assets/default.jpg';

import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';
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
} from '@/components/ui/alert-dialog';
import { useFriendsStore } from '../store/useFriendsStore';
import type { FriendUser } from '../service/friendsService';

type FriendListItemVariant = 'lobby' | 'profile';

interface FriendListItemProps {
  friend: FriendUser;
  onInviteToLobby?: (friend: FriendUser) => void;
  onSpectate?: (gameId: string) => void;
  onRemove?: (username: string) => void;
  variant?: FriendListItemVariant;
}

export function FriendListItem({
  friend,
  onInviteToLobby,
  onSpectate,
  onRemove,
  variant = 'lobby',
}: FriendListItemProps) {
  const { t } = useLanguage();
  const status = friend.status?.toLowerCase();
  const isPlaying = status === 'in_game';
  const isOnline = status === 'online';
  const statusLabel = isPlaying
    ? t('app.friends.inGameStatus') || 'En partida'
    : isOnline
      ? t('app.friends.onlineStatus') || 'Online'
      : t('app.friends.offlineStatus') || 'Desconectado';

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const blockUser = useFriendsStore((state) => state.blockUser);
  const isProfile = variant === 'profile';

  // Handle blocking a user
  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await blockUser(friend.username);
      toast.success(
        t('profile.blockedSuccess') || 'User blocked successfully.'
      );
    } catch {
      toast.error(
        t('profile.blockFailed') || 'Could not block the user. Try again.'
      );
    } finally {
      setIsBlocking(false);
      setIsBlockOpen(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between ${UI.row.interactive} ${
        isProfile ? UI.card.profileRow : UI.card.lobbyRow
      }`}
    >
      <Link
        to={`/profile/${encodeURIComponent(friend.username)}`}
        title={t('profile.publicProfile')}
        className={UI.link.profileRow}
      >
        <div className="relative">
          <img
            src={friend.avatarUrl || defaultAvatar}
            alt={friend.username}
            className={isProfile ? UI.avatar.lg : UI.avatar.md}
          />
          <span
            className={`${UI.avatar.statusDot} -right-0.5 -bottom-0.5 h-2.5 w-2.5 ${
              isPlaying
                ? 'bg-accent'
                : isOnline
                  ? 'bg-success'
                  : 'bg-muted-foreground'
            }`}
          />
        </div>
        <div>
          <p
            className={`text-foreground font-semibold ${
              isProfile ? 'text-sm' : 'text-xs'
            }`}
          >
            {friend.username}
          </p>
          <p
            className={`text-muted-foreground ${
              isProfile ? 'text-[11px]' : 'text-[10px]'
            }`}
          >
            {statusLabel}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-1.5">
        {/* Spectate button */}
        {isPlaying && friend.currentGameId && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-input bg-card text-accent hover:bg-accent/10 h-7 w-7 cursor-pointer p-0 text-xs"
            onClick={() => onSpectate?.(friend.currentGameId!)}
            title={t('app.friends.spectateTitle') || 'Espectar partida'}
          >
            <EyeIcon className={UI.icon.xs} aria-hidden="true" />
          </Button>
        )}

        {/* Invite to lobby button (+) */}
        {onInviteToLobby && isOnline && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-input bg-card text-secondary-foreground hover:bg-primary hover:text-primary-foreground h-7 w-7 cursor-pointer p-0 text-xs font-bold"
            onClick={() => onInviteToLobby(friend)}
            title={t('app.friends.inviteToLobby') || 'Invitar a lobby'}
          >
            +
          </Button>
        )}

        {/* Block user button */}
        <AlertDialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isBlocking}
              className={UI.btn.iconGhost}
              title={t('profile.blockUser') || 'Block user'}
            >
              <Ban className={UI.icon.xs} aria-hidden="true" />
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
                ).replace('{username}', friend.username)}{' '}
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

        {/* Remove friend button */}
        {onRemove && (
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className={UI.btn.iconDanger}
                title={t('app.friends.deleteFriendTitle') || 'Eliminar amigo'}
              >
                <XIcon className={UI.icon.xs} aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('app.friends.deleteFriendTitle') || 'Eliminar amigo'}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="mt-1">
                {t('app.friends.deleteFriendConfirm') ||
                  '¿Estás seguro de que deseas eliminar a'}{' '}
                {friend.username}{' '}
                {t('app.friends.deleteFriendConfirm2') ||
                  'de tu lista de amigos?'}
              </AlertDialogDescription>
              <AlertDialogFooter className="flex items-center justify-end gap-2">
                <AlertDialogCancel>
                  {t('app.friends.cancelButton') || 'Cancelar'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onRemove?.(friend.username);
                    setIsDeleteOpen(false);
                  }}
                >
                  {t('app.friends.removeButton') || 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
