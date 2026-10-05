import {
	IsEmail,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(128)
  password: string;
}