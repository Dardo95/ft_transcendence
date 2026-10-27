import { randomUUID } from 'node:crypto';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  // WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import { LobbyService } from '../lobby/lobby.service.js';
import { PrismaService } from '../database/prisma.service.js';

import { WsJwtAuthService, type WsUser } from '../auth/ws-jwt-auth.service.js';
import { websocketOptions } from '../realtime/websocket-options.js';

@WebSocketGateway({
  namespace: '/chat',
  ...websocketOptions,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly wsAuth: WsJwtAuthService,
    private readonly lobbyService: LobbyService,
    private readonly prisma: PrismaService
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const user = client.data.user as WsUser | undefined;
    if (!user?.id) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });
  }

  handleDisconnect(client: Socket): void {
    const user = client.data.user as WsUser | undefined;
    if (!user?.id) return;

    this.prisma.user
      .update({ where: { id: user.id }, data: { isOnline: false } })
      .catch(() => undefined);

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

  afterInit(server: Namespace): void {
    this.wsAuth.attach(server);
  }

  @SubscribeMessage('lobby:invite')
  async handleInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
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
      const invitation = this.lobbyService.createInvitation(inviter, invitee);

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
      error instanceof Error ? error.message : 'Lobby operation failed';

    client.emit('lobby:error', { message });
  }

  @SubscribeMessage('lobby:accept')
  async handleAcceptInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
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

      // 1. Recordar el lobby anterior antes de modificar el servicio.
      const previousLobby = this.lobbyService.getLobbyForUser(user.id);

      // 2. Validar la invitación y actualizar los mapas en memoria.
      const lobby = this.lobbyService.acceptInvitation(invitationId, user);

      // 3. Abandonar la sala anterior si hemos cambiado de lobby.
      if (previousLobby && previousLobby.id !== lobby.id) {
        await client.leave(`lobby:${previousLobby.id}`);
      }

      // 4. Entrar en la sala del lobby de destino.
      await client.join(`lobby:${lobby.id}`);

      // 5. Actualizar el estado del usuario que acepta.
      client.emit('lobby:joined', lobby);

      // 6. Notificar a los miembros del lobby de destino.
      this.server.to(`lobby:${lobby.id}`).emit('lobby:updated', lobby);
    } catch (error) {
      this.emitLobbyError(client, error);
    }
  }

  @SubscribeMessage('lobby:reject')
  handleRejectInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
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

      this.lobbyService.rejectInvitation(invitationId, user.id);

      client.emit('lobby:invitationRejected', {
        invitationId,
      });
    } catch (error) {
      this.emitLobbyError(client, error);
    }
  }

  @SubscribeMessage('lobby:sync')
  async handleLobbySync(@ConnectedSocket() client: Socket): Promise<void> {
    const user = client.data.user as WsUser;

    // Obtener el lobby actual o crear uno individual.
    const lobby = this.lobbyService.getOrCreateLobby(user);

    // Asegurar que el socket pertenece a su sala.
    await client.join(`lobby:${lobby.id}`);

    // Recuperar las invitaciones pendientes.
    const invitations = this.lobbyService.getPendingInvitations(user.id);

    // Enviar el estado inicial al frontend.
    client.emit('lobby:state', {
      lobby,
      invitations,
    });
  }

  @SubscribeMessage('lobby:create')
  async handleCreateLobby(@ConnectedSocket() client: Socket): Promise<void> {
    const user = client.data.user as WsUser;

    // 1. Crear el lobby en memoria.
    const lobby = this.lobbyService.getOrCreateLobby(user);

    // 2. Unir el socket a la sala de Socket.IO.
    await client.join(`lobby:${lobby.id}`);

    // 3. Enviar el estado inicial al creador.
    client.emit('lobby:created', lobby);
  }

  @SubscribeMessage('lobby:leave')
  async handleLeaveLobby(@ConnectedSocket() client: Socket): Promise<void> {
    const user = client.data.user as WsUser;

    // Recordamos el lobby anterior.
    const previousLobby = this.lobbyService.getLobbyForUser(user.id);

    // Salimos del grupo actual.
    const result = this.lobbyService.leaveLobby(user.id);

    // Abandonamos la sala anterior de Socket.IO.
    if (previousLobby) {
      await client.leave(`lobby:${previousLobby.id}`);
    }

    // Actualizamos a los antiguos compañeros.
    if (result?.lobby) {
      this.server
        .to(`lobby:${result.lobbyId}`)
        .emit('lobby:updated', result.lobby);
    }

    // Creamos o recuperamos el lobby individual.
    const soloLobby = this.lobbyService.getOrCreateLobby(user);

    // Entramos en la nueva sala.
    await client.join(`lobby:${soloLobby.id}`);

    // Actualizamos la interfaz con el estado definitivo.
    client.emit('lobby:state', {
      lobby: soloLobby,
      invitations: this.lobbyService.getPendingInvitations(user.id),
    });
  }

  @SubscribeMessage('chat:send')
  handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown
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
    this.server.to(`lobby:${lobby.id}`).emit('chat:message', message);
  }
}
