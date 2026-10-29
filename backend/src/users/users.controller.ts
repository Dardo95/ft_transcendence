import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SearchUsersDto } from './dto/search-users.dto.js';
import { SendFriendRequestDto } from './dto/send-friend-request.dto.js';
import { FriendshipsService } from './friendships.service.js';
import { UsersService } from './users.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendships: FriendshipsService,
    private readonly chatGateway: ChatGateway
  ) {}

  private emitToUser(userId: number, event: string, data: unknown) {
    const server = this.chatGateway?.server;
    if (!server) return;

    server.to(`user:${userId}`).emit(event, data);
  }

  @Get('me')
  me(@CurrentUser('sub') userId: number) {
    return this.usersService.findById(userId);
  }

  @Post('me/friend-requests')
  async requestFriend(
    @CurrentUser('sub') userId: number,
    @Body() dto: SendFriendRequestDto
  ) {
    const result = await this.friendships.request(userId, dto.username);
    if (result && typeof result === 'object' && 'addresseeId' in result) {
      this.emitToUser(
        Number(result.addresseeId),
        'friend:incoming_request',
        result
      );
    }
    return result;
  }

  @Get('me/friend-requests')
  listRequests(
    @CurrentUser('sub') userId: number,
    @Query('type') type = 'incoming'
  ) {
    if (type === 'incoming') return this.friendships.listIncoming(userId);
    if (type === 'outgoing') return this.friendships.listOutgoing(userId);
    throw new BadRequestException('type must be incoming or outgoing');
  }

  @Post('me/friend-requests/:id/accept')
  async acceptFriend(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    const result = await this.friendships.accept(userId, id);
    if (result && typeof result === 'object') {
      const requesterId = (result as any).requesterId;
      const addresseeId = (result as any).addresseeId;
      if (requesterId)
        this.emitToUser(Number(requesterId), 'friend:accepted', result);
      if (addresseeId)
        this.emitToUser(Number(addresseeId), 'friend:updated', result);
    }
    return result;
  }

  @Post('me/friend-requests/:id/reject')
  async rejectFriend(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    const result = await this.friendships.reject(userId, id);
    if (result && typeof result === 'object') {
      const requesterId = (result as any).requesterId;
      if (requesterId)
        this.emitToUser(Number(requesterId), 'friend:rejected', result);
    }
    return result;
  }

  @Get('me/friends')
  listFriends(@CurrentUser('sub') userId: number) {
    return this.friendships.listFriends(userId);
  }

  @Delete('me/friends/:username')
  async removeFriend(
    @CurrentUser('sub') userId: number,
    @Param('username') username: string
  ) {
    const result = await this.friendships.remove(userId, username);
    if (result && typeof result === 'object') {
      const otherId =
        userId === (result as any).requesterId
          ? (result as any).addresseeId
          : (result as any).requesterId;
      if (otherId) this.emitToUser(Number(otherId), 'friend:removed', result);
    }
    return result;
  }

  @Post('me/blocked')
  blockUser(
    @CurrentUser('sub') userId: number,
    @Body() dto: SendFriendRequestDto
  ) {
    return this.friendships.block(userId, dto.username);
  }

  @Delete('me/blocked/:username')
  unblockUser(
    @CurrentUser('sub') userId: number,
    @Param('username') username: string
  ) {
    return this.friendships.unblock(userId, username);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get()
  search(@Query() query: SearchUsersDto) {
    return this.usersService.search(query);
  }
}
