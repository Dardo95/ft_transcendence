import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  currentPassword: string;

  // Same rules as RegisterDto.password
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
