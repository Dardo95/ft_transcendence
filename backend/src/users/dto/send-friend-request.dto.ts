import { IsString, MaxLength, MinLength } from 'class-validator';

export class SendFriendRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;
}
