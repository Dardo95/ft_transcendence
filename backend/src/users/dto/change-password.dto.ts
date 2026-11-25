import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsPassword } from '../password.rules.js';

export class ChangePasswordDto {
  // Only checked against the stored hash: old accounts may predate the rule.
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  currentPassword: string;

  @IsPassword()
  newPassword: string;
}
