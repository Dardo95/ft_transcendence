import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './register.dto.js';

async function invalidFields(body: object): Promise<string[]> {
  const errors = await validate(plainToInstance(RegisterDto, body));
  return errors.map((error) => error.property);
}

const valid = {
  email: 'brivera@example.com',
  username: 'brivera',
  password: 'abc12345',
};

describe('RegisterDto', () => {
  it('accepts a valid body', async () => {
    expect(await invalidFields(valid)).toEqual([]);
  });

  it.each([
    ['email', { ...valid, email: 'not-an-email' }],
    ['username', { ...valid, username: 'with space' }],
    ['username', { ...valid, username: 'ab' }],
    ['password', { ...valid, password: 'abcdefgh' }],
    ['password', { ...valid, password: '12345678' }],
    ['password', { ...valid, password: 'abc1' }],
    ['password', { ...valid, password: `a1${'x'.repeat(127)}` }],
  ])('rejects an invalid %s', async (field, body) => {
    expect(await invalidFields(body)).toContain(field);
  });
});
