import { useState } from 'react';
import { useLanguage } from '@/locales/useLanguage';

import { Link } from 'react-router-dom';

import { EyeIcon, XIcon } from 'lucide-react';
import defaultAvatar from '@/assets/default.jpg';

import { Button } from '@/components/ui/button';
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
  const isProfile = variant === 'profile';

  return (
    <div
      className={`flex items-center justify-between transition-colors ${
        isProfile
          ? 'rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 hover:bg-zinc-900/60'
          : 'rounded-xl border border-zinc-700 bg-zinc-950/40 p-2.5 hover:bg-zinc-800/40'
      }`}
    >
      <Link
        to={`/profile/${encodeURIComponent(friend.username)}`}
        title={t('profile.publicProfile')}
        className="flex min-w-0 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
      >
        <div className="relative">
          <img
            src={friend.avatarUrl || defaultAvatar}
            alt={friend.username}
            className={`rounded-full border border-zinc-700 bg-zinc-800 object-cover ${
              isProfile ? 'size-10' : 'h-8 w-8'
            }`}
          />
          <span
            className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${
              isPlaying
                ? 'bg-amber-500'
                : isOnline
                  ? 'bg-emerald-500'
                  : 'bg-zinc-600'
            }`}
          />
        </div>
        <div>
          <p
            className={`font-semibold text-zinc-100 ${
              isProfile ? 'text-sm' : 'text-xs'
            }`}
          >
            {friend.username}
          </p>
          <p
            className={`text-zinc-400 ${
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
            className="h-7 w-7 border-zinc-700 bg-zinc-900 p-0 text-xs text-amber-400 hover:bg-amber-950/40"
            onClick={() => onSpectate?.(friend.currentGameId!)}
            title={t('app.friends.spectateTitle') || 'Espectar partida'}
          >
            <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        )}

        {/* Invite to lobby button (+) */}
        {onInviteToLobby && isOnline && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-7 border-zinc-700 bg-zinc-900 p-0 text-xs font-bold text-zinc-200 hover:bg-orange-600 hover:text-white"
            onClick={() => onInviteToLobby(friend)}
            title={t('app.friends.inviteToLobby') || 'Invitar a lobby'}
          >
            +
          </Button>
        )}

        {/* Remove friend button */}
        {onRemove && (
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-xs text-zinc-500 hover:text-red-400"
                title={t('app.friends.deleteFriendTitle') || 'Eliminar amigo'}
              >
                <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
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
