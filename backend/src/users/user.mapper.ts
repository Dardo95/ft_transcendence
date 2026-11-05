import type { UserPrivate, UserPublic } from '@transcendence/shared';

// Shapes returned by Prisma for the user selects used below.
// They are backend-internal and intentionally not part of the shared contract.
type UserPublicRow = {
  id: number;
  username: string;
  xp: number;
  isOnline: boolean;
  createdAt: Date;
};

type UserPrivateRow = UserPublicRow & {
  email: string;
  twoFaEnabled: boolean;
  oauthProvider: string | null;
};

export function toUserPublic(row: UserPublicRow): UserPublic {
  return {
    id: row.id,
    username: row.username,
    xp: row.xp,
    isOnline: row.isOnline,
    // The database does not store avatars yet. Keep the API contract stable.
    avatarUrl: null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toUserPrivate(row: UserPrivateRow): UserPrivate {
  return {
    ...toUserPublic(row),
    email: row.email,
    twoFaEnabled: row.twoFaEnabled,
    oauthProvider: row.oauthProvider,
  };
}
