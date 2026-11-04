export class UserPublicDto {
  id!: number;
  username!: string;
  xp!: number;
  isOnline!: boolean;
  avatarUrl!: string | null;
  createdAt!: Date;
}