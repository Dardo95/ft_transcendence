import { IsEmail } from 'class-validator';
import { IsPassword } from '../../users/password.rules.js';
import { IsUsername } from '../../users/username.rules.js';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsUsername()
  username: string;

  @IsPassword()
  password: string;
}
