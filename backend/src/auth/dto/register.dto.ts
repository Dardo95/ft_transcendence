import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsUsername } from '../../users/username.rules.js';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsUsername()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
