import { Injectable, Logger } from '@nestjs/common';
import type { Socket } from 'socket.io';

@Injectable()
export class SocketRegistryService {
  private readonly logger = new Logger(SocketRegistryService.name);

  // namespace -> (userId -> socket activo)
  private readonly sockets = new Map<string, Map<number, Socket>>();

  register(namespace: string, userId: number, socket: Socket): void {
    let byUser = this.sockets.get(namespace);

    if (!byUser) {
      byUser = new Map<number, Socket>();
      this.sockets.set(namespace, byUser);
    }

    const previous = byUser.get(userId);

    if (previous && previous.id !== socket.id) {
      this.logger.debug(
        `Replacing ${previous.id} with ${socket.id} for user ${userId} (${namespace})`
      );
      previous.emit('session:replaced', { reason: 'another-window' });
      previous.disconnect(true);
    }

    byUser.set(userId, socket);
  }

  unregister(namespace: string, userId: number, socketId: string): boolean {
    const byUser = this.sockets.get(namespace);
    const current = byUser?.get(userId);

    // El socket que cae ya fue reemplazado: no toca presencia ni lobby.
    if (!byUser || !current || current.id !== socketId) {
      return false;
    }

    byUser.delete(userId);

    if (byUser.size === 0) {
      this.sockets.delete(namespace);
    }

    return true;
  }

  isCurrent(namespace: string, userId: number, socketId: string): boolean {
    return this.sockets.get(namespace)?.get(userId)?.id === socketId;
  }
}
