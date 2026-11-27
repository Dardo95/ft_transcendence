import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '@transcendence/shared';

// class-validator decorator for DTO fields that carry a new password.
export function IsPassword() {
  return applyDecorators(
    IsString(),
    Matches(PASSWORD_REGEX, {
      message: `password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters with at least one letter and one number`,
    })
  );
}
