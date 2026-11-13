import type { UserPrivate, UserPublic } from '@transcendence/shared';

// Prisma select shared by every endpoint that exposes public user data.
// Keep it in one place so no endpoint can accidentally leak private fields.
export const userPublicSelect = {
  id: true,
  username: true,
  xp: true,
  isOnline: true,
  avatarUrl: true,
  createdAt: true,
} as const;

// Private select used only for the owner of the account.
export const userPrivateSelect = {
  ...userPublicSelect,
  email: true,
  twoFaEnabled: true,
  oauthProvider: true,
} as const;

// Shapes returned by Prisma for the selects above.
// They are backend-internal and intentionally not part of the shared contract.
type UserPublicRow = {
  id: number;
  username: string;
  xp: number;
  isOnline: boolean;
  avatarUrl: string | null;
  createdAt: Date;
};

type UserPrivateRow = UserPublicRow & {
  email: string;
  twoFaEnabled: boolean;
  oauthProvider: string | null;
};

// Converts a Prisma row to the public user contract.
export function toUserPublic(row: UserPublicRow): UserPublic {
  return {
    id: row.id,
    username: row.username,
    xp: row.xp,
    isOnline: row.isOnline,
    avatarUrl: row.avatarUrl,
    createdAt: row.createdAt.toISOString(),
  };
}

// Converts a Prisma row to the private user contract.
export function toUserPrivate(row: UserPrivateRow): UserPrivate {
  return {
    ...toUserPublic(row),
    email: row.email,
    twoFaEnabled: row.twoFaEnabled,
    oauthProvider: row.oauthProvider,
  };
}
