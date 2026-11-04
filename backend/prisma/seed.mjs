import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo1234!';

const demoUsers = [
  { username: 'ozamora-', email: 'ozamora@example.com', xp: 0 },
  { username: 'brivera', email: 'brivera@example.com', xp: 120 },
  { username: 'raperez-', email: 'raperez@example.com', xp: 340 },
  { username: 'enogueir', email: 'enogueir@example.com', xp: 75 },
  { username: 'nsantand', email: 'nsantand@example.com', xp: 200 },
  { username: 'brian', email: 'brian@example.com', xp: 150 }
];

const demoFriendships = [
  ['ozamora-', 'brivera'],
  ['ozamora-', 'raperez-'],
  ['ozamora-', 'enogueir'],
  ['ozamora-', 'nsantand'],
];

const achievements = [
  {
    key: 'first_blood',
    name: 'First Blood',
    description: 'Win your first match',
    xpReward: 50,
  },
  {
    key: 'survivor',
    name: 'Survivor',
    description: 'Win without dying',
    xpReward: 100,
  },
  {
    key: 'hat_trick',
    name: 'Hat Trick',
    description: 'Win three matches in a row',
    xpReward: 150,
  },
];

async function upsertUser({ username, email, xp }) {
  const password = await argon2.hash(DEMO_PASSWORD);

  return prisma.user.upsert({
    where: { username },
    update: { email, password },
    create: { username, email, password, xp },
    select: { id: true, username: true },
  });
}

async function ensureFriendship(requesterId, addresseeId) {
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    },
  });

  if (existing) {
    if (existing.status !== 'ACCEPTED') {
      await prisma.friendship.update({
        where: { id: existing.id },
        data: { status: 'ACCEPTED' },
      });
    }
    return;
  }

  await prisma.friendship.create({
    data: { requesterId, addresseeId, status: 'ACCEPTED' },
  });
}

async function main() {
  const users = [];

  for (const demo of demoUsers) {
    users.push(await upsertUser(demo));
  }

  const idByUsername = new Map(
  users.map((user) => [user.username, user.id])
  );

  for (const [a, b] of demoFriendships) {
    await ensureFriendship(idByUsername.get(a), idByUsername.get(b));
  }

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {},
      create: achievement,
    });
  }

   console.log(
    `Seed OK: ${users.length} users, ${demoFriendships.length} friendships, ${achievements.length} achievements`
  );
  console.log(`Login: ${demoUsers[0].email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });