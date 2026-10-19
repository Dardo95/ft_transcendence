import { randomUUID } from 'node:crypto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import { LobbyService } from '../lobby/lobby.service.js';
import { PrismaService } from '../database/prisma.service.js';

import {
  WsJwtAuthService,
  type WsUser,
} from '../auth/ws-jwt-auth.service.js';
import { websocketOptions } from '../realtime/websocket-options.js';

@WebSocketGateway({
  namespace: '/chat',
  ...websocketOptions,
})
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly wsAuth: WsJwtAuthService,
    private readonly lobbyService: LobbyService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit(server: Namespace): void {
    this.wsAuth.attach(server);
  }

  @SubscribeMessage('lobby:invite')
  async handleInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): Promise<void> {
    try {
      const username = this.readString(body, 'username').trim();

      if (!username) {
        client.emit('lobby:error', {
          message: 'Username is required',
        });
        return;
      }

      const inviter = client.data.user as WsUser;

      // 1. Buscar al destinatario por su nombre de usuario.
      const invitee = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true, username: true },
      });

      if (!invitee) {
        client.emit('lobby:error', {
          message: 'User not found',
        });
        return;
      }

      // 2. Comprobar que existe una amistad aceptada.
      const friendship = await this.prisma.friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            {
              requesterId: inviter.id,
              addresseeId: invitee.id,
            },
            {
              requesterId: invitee.id,
              addresseeId: inviter.id,
            },
          ],
        },
        select: { id: true },
      });

      if (!friendship) {
        client.emit('lobby:error', {
          message: 'You can only invite accepted friends',
        });
        return;
      }

      // 3. Crear la invitación en memoria.
      const invitation = this.lobbyService.createInvitation(
        inviter,
        invitee,
      );

      // 4. Notificar al destinatario si está conectado.
      for (const socket of this.server.sockets.values()) {
        const connectedUser = socket.data.user as WsUser | undefined;

        if (connectedUser?.id === invitee.id) {
          socket.emit('lobby:invitation', invitation);
        }
      }

      // 5. Confirmar el envío al anfitrión.
      client.emit('lobby:invitationSent', {
        lobbyId: invitation.lobbyId,
        username: invitee.username,
      });
    } catch (error) {
      this.emitLobbyError(client, error);
    }
  }
  
  private readString(body: unknown, key: string): string {
    if (typeof body !== 'object' || body === null) {
      return '';
    }

    const value = (body as Record<string, unknown>)[key];

    return typeof value === 'string' ? value : '';
  }
  
  private emitLobbyError(client: Socket, error: unknown): void {
    const message =
      error instanceof Error
        ? error.message
        : 'Lobby operation failed';

    client.emit('lobby:error', { message });
  }

  @SubscribeMessage('lobby:accept')
  async handleAcceptInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): Promise<void> {
    try {
      const invitationId = this.readString(body, 'invitationId');

      if (!invitationId) {
        client.emit('lobby:error', {
          message: 'Invitation ID is required',
        });
        return;
      }

      const user = client.data.user as WsUser;

      // El servicio comprueba que la invitación va dirigida a este usuario.
      const lobby = this.lobbyService.acceptInvitation(
        invitationId,
        user,
      );

      // Unir su socket a la sala privada del lobby.
      await client.join(`lobby:${lobby.id}`);

      client.emit('lobby:joined', lobby);

      // Actualizar la lista de miembros para todo el lobby.
      this.server
        .to(`lobby:${lobby.id}`)
        .emit('lobby:updated', lobby);
    } catch (error) {
      this.emitLobbyError(client, error);
    }
  }

  @SubscribeMessage('lobby:reject')
  handleRejectInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): void {
    try {
      const invitationId = this.readString(body, 'invitationId');

      if (!invitationId) {
        client.emit('lobby:error', {
          message: 'Invitation ID is required',
        });
        return;
      }

      const user = client.data.user as WsUser;

      this.lobbyService.rejectInvitation(
        invitationId,
        user.id,
      );

      client.emit('lobby:invitationRejected', {
        invitationId,
      });
    } catch (error) {
      this.emitLobbyError(client, error);
    }
  }

  @SubscribeMessage('lobby:sync')
  async handleLobbySync(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client.data.user as WsUser;

    const lobby = this.lobbyService.getLobbyForUser(user.id);
    const invitations =
      this.lobbyService.getPendingInvitations(user.id);

    if (lobby) {
      await client.join(`lobby:${lobby.id}`);
    }

    client.emit('lobby:state', {
      lobby,
      invitations,
    });
  }

  @SubscribeMessage('lobby:create')
  async handleCreateLobby(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client.data.user as WsUser;

    // 1. Crear el lobby en memoria.
    const lobby = this.lobbyService.createLobby(user);

    // 2. Unir el socket a la sala de Socket.IO.
    await client.join(`lobby:${lobby.id}`);

    // 3. Enviar el estado inicial al creador.
    client.emit('lobby:created', lobby);
  }

  @SubscribeMessage('lobby:leave')
  async handleLeaveLobby(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client.data.user as WsUser;

    // 1. Eliminar al usuario del estado del lobby.
    const result = this.lobbyService.leaveLobby(user.id);

    if (!result) {
      client.emit('lobby:left', { lobbyId: null });
      return;
    }

    const room = `lobby:${result.lobbyId}`;

    // 2. Sacar el socket de la sala.
    await client.leave(room);

    // 3. Notificar a los miembros que permanecen.
    if (result.lobby) {
      this.server.to(room).emit('lobby:updated', result.lobby);
    }

    // 4. Confirmar la salida al propio usuario.
    client.emit('lobby:left', {
      lobbyId: result.lobbyId,
    });
  }


  @SubscribeMessage('chat:send')
  handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): void {
    const user = client.data.user as WsUser;

    // 1. Comprobar a qué lobby pertenece el remitente.
    const lobby = this.lobbyService.getLobbyForUser(user.id);

    if (!lobby) {
      client.emit('lobby:error', {
        message: 'You must be in a lobby to send messages',
      });
      return;
    }

    // 2. Leer y validar el texto.
    const text = this.readString(body, 'text').trim();

    if (!text || text.length > 500) {
      client.emit('lobby:error', {
        message: 'Message must contain between 1 and 500 characters',
      });
      return;
    }

    // 3. Construir el mensaje con la identidad autenticada.
    const message = {
      id: randomUUID(),
      senderId: user.id,
      sender: user.username,
      text,
      timestamp: new Date().toISOString(),
    };

    // 4. Enviar el mensaje exclusivamente al lobby del remitente.
    this.server
      .to(`lobby:${lobby.id}`)
      .emit('chat:message', message);
  }

  
  handleDisconnect(client: Socket): void {
    const user = client.data.user as WsUser | undefined;

    // Puede que la conexión se haya rechazado antes de autenticar.
    if (!user) {
      return;
    }

    // Eliminar al usuario del lobby.
    const result = this.lobbyService.leaveLobby(user.id);

    if (!result || !result.lobby) {
      return;
    }

    // Actualizar el estado visible para los miembros restantes.
    this.server
      .to(`lobby:${result.lobbyId}`)
      .emit('lobby:updated', result.lobby);
  }

}