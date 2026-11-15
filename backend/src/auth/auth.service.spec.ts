import type { JwtService } from '@nestjs/jwt';
import type { PrismaService } from '../database/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService.issueAccessToken', () => {
  it('signs a token with the current id and username', () => {
    const jwtService = { sign: vi.fn().mockReturnValue('signed-token') };
    const service = new AuthService(
      {} as PrismaService,
      jwtService as unknown as JwtService
    );

    expect(service.issueAccessToken({ id: 1, username: 'new_name' })).toBe(
      'signed-token'
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      username: 'new_name',
    });
  });
});
