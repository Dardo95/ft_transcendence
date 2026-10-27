import { useState } from 'react';
import { useLanguage } from '@/locales/useLanguage';

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

interface FriendListItemProps {
  friend: FriendUser;
  onInviteToLobby?: (friend: FriendUser) => void;
  onSpectate?: (gameId: string) => void;
  onRemove?: (username: string) => void;
}

export function FriendListItem({
  friend,
  onInviteToLobby,
  onSpectate,
  onRemove,
}: FriendListItemProps) {
  const { t } = useLanguage();
  const isPlaying = friend.status?.toLowerCase() === 'in_game';
  const isOnline = friend.status?.toLowerCase() === 'online';

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2.5 transition-colors hover:bg-zinc-800/40">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          {friend.avatarUrl ? (
            <img
              src={friend.avatarUrl}
              alt={friend.username}
              className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs">
              👨‍🍳
            </div>
          )}
          <span
            className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${
              isOnline
                ? 'bg-emerald-500'
                : isPlaying
                  ? 'bg-amber-500'
                  : 'bg-zinc-600'
            }`}
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">
            {friend.username}
          </p>
          <p className="text-[10px] text-zinc-400 capitalize">
            {isPlaying
              ? t('app.inGameStatus') || 'En partida'
              : friend.status || t('app.offlineStatus') || 'Desconectado'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">

        {/* Botón Espectador */}
        {isPlaying && friend.currentGameId && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-7 border-zinc-700 bg-zinc-900 p-0 text-xs text-amber-400 hover:bg-amber-950/40"
            onClick={() => onSpectate?.(friend.currentGameId!)}
            title={t('app.spectateTitle') || 'Espectar partida'}
          >
            👁
          </Button>
        )}

        {/* Botón Invitar a Lobby (+) */}
        {onInviteToLobby && isOnline && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-7 border-zinc-700 bg-zinc-900 p-0 text-xs font-bold text-zinc-200 hover:bg-orange-600 hover:text-white"
            onClick={() => onInviteToLobby(friend)}
            title={t('app.inviteToLobby') || 'Invitar a lobby'}
          >
            +
          </Button>
        )}

        {/* Boton Eliminar amigo */}
        {onRemove && (
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-xs text-zinc-500 hover:text-red-400"
                title={t('app.deleteFriendTitle') || 'Eliminar amigo'}
              >
                ✕
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('app.deleteFriendTitle') || 'Eliminar amigo'}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="mt-1">
                {t('app.deleteFriendConfirm') ||
                  '¿Estás seguro de que deseas eliminar a'}{' '}
                {friend.username}{' '}
                {t('app.deleteFriendConfirm2') || 'de tu lista de amigos?'}
              </AlertDialogDescription>
              <AlertDialogFooter className="flex items-center justify-end gap-2">
                <AlertDialogCancel>
                  {t('app.cancelButton') || 'Cancelar'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onRemove?.(friend.username);
                    setIsDeleteOpen(false);
                  }}
                >
                  {t('app.removeButton') || 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
