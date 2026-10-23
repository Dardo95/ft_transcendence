import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parseCookie } from 'cookie';
import type { Namespace, Socket } from 'socket.io';

export interface WsUser {
  id: number;
  username: string;
}

interface AccessTokenPayload {
  sub: number;
  username: string;
}

@Injectable()
export class WsJwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  attach(namespace: Namespace): void {
    namespace.use((socket, next) => {
      void this.authenticate(socket, next);
    });
  }

  private async authenticate(
    socket: Socket,
    next: (err?: Error) => void
  ): Promise<void> {
    try {
      // La cookie llega en la cabecera del handshake.
      const cookieHeader = socket.handshake.headers.cookie ?? '';
      const token = parseCookie(cookieHeader).access_token;

      if (!token) {
        next(new Error('Unauthorized'));
        return;
      }

      // Verifica la firma y la expiración del JWT.
      const payload =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);

      if (
        !Number.isSafeInteger(payload.sub) ||
        payload.sub <= 0 ||
        typeof payload.username !== 'string' ||
        !payload.username
      ) {
        next(new Error('Unauthorized'));
        return;
      }

      // Guardamos la identidad verificada en el socket.
      socket.data.user = {
        id: payload.sub,
        username: payload.username,
      } satisfies WsUser;

      next();
    } catch {
      // No aceptamos tokens inválidos, ausentes o caducados.
      next(new Error('Unauthorized'));
    }
  }
}
