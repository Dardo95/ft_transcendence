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

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendships: FriendshipsService
  ) {}

  @Get('me')
  me(@CurrentUser('sub') userId: number) {
    return this.usersService.findById(userId);
  }

  @Post('me/friend-requests')
  requestFriend(
    @CurrentUser('sub') userId: number,
    @Body() dto: SendFriendRequestDto
  ) {
    return this.friendships.request(userId, dto.username);
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
  acceptFriend(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.friendships.accept(userId, id);
  }

  @Post('me/friend-requests/:id/reject')
  rejectFriend(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.friendships.reject(userId, id);
  }

  @Get('me/friends')
  listFriends(@CurrentUser('sub') userId: number) {
    return this.friendships.listFriends(userId);
  }

  @Delete('me/friends/:username')
  removeFriend(
    @CurrentUser('sub') userId: number,
    @Param('username') username: string
  ) {
    return this.friendships.remove(userId, username);
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
