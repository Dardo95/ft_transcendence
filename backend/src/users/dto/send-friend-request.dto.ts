import { IsUsername } from '../username.rules.js';

export class SendFriendRequestDto {
  @IsUsername()
  username!: string;
}
