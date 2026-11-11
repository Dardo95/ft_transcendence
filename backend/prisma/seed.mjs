import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo1234!';

const demoUsers = [
  {
    username: 'brivera',
    email: 'brivera@example.com',
    legacyEmail: 'demo1@example.com',
    xp: 0,
  },
  {
    username: 'ozamora-',
    email: 'ozamora-@example.com',
    legacyEmail: 'demo2@example.com',
    xp: 120,
  },
  {
    username: 'raperez-',
    email: 'raperez-@example.com',
    legacyEmail: 'demo3@example.com',
    xp: 340,
  },
  {
    username: 'enogueir',
    email: 'enogueir@example.com',
    legacyEmail: 'demo4@example.com',
    xp: 75,
  },
  {
    username: 'nsantand',
    email: 'nsantand@example.com',
    xp: 0,
  },
];

const demoFriendships = [
  ['brivera', 'ozamora-'],
  ['brivera', 'raperez-'],
  ['brivera', 'enogueir'],
  ['brivera', 'nsantand'],
  ['raperez-', 'enogueir'],
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

// Fixed dates so the seed is reproducible.
const demoMatches = [
  {
    mapId: 'map1',
    legacyMapId: 'seed-demo-1',
    finishedAt: new Date('2026-10-20T18:00:00.000Z'),
    winner: 'brivera',
    loser: 'ozamora-',
    winnerScore: 120,
    loserScore: 80,
    winnerKills: 5,
    loserKills: 3,
  },
  {
    mapId: 'map2',
    legacyMapId: 'seed-demo-2',
    finishedAt: new Date('2026-10-21T18:00:00.000Z'),
    winner: 'brivera',
    loser: 'raperez-',
    winnerScore: 100,
    loserScore: 60,
    winnerKills: 4,
    loserKills: 2,
  },
  {
    mapId: 'map3',
    legacyMapId: 'seed-demo-3',
    finishedAt: new Date('2026-10-22T18:00:00.000Z'),
    winner: 'ozamora-',
    loser: 'brivera',
    winnerScore: 120,
    loserScore: 90,
    winnerKills: 6,
    loserKills: 4,
  },
  {
    mapId: 'map1',
    legacyMapId: 'seed-demo-4',
    finishedAt: new Date('2026-10-23T18:00:00.000Z'),
    winner: 'ozamora-',
    loser: 'enogueir',
    winnerScore: 110,
    loserScore: 70,
    winnerKills: 5,
    loserKills: 2,
  },
  {
    mapId: 'map2',
    legacyMapId: 'seed-demo-5',
    finishedAt: new Date('2026-10-24T18:00:00.000Z'),
    winner: 'raperez-',
    loser: 'enogueir',
    winnerScore: 100,
    loserScore: 90,
    winnerKills: 3,
    loserKills: 4,
  },
  {
    mapId: 'map3',
    legacyMapId: 'seed-demo-6',
    finishedAt: new Date('2026-10-25T18:00:00.000Z'),
    winner: 'enogueir',
    loser: 'brivera',
    winnerScore: 130,
    loserScore: 80,
    winnerKills: 6,
    loserKills: 2,
  },
];

async function upsertUser({ username, email, legacyEmail, xp }) {
  const password = await argon2.hash(DEMO_PASSWORD);

  // Rename the previous demo account in place (same id, xp, friendships and
  // matches) instead of creating a duplicate. Once renamed, the next run
  // finds it by its new email.
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(legacyEmail ? [{ email: legacyEmail }] : [])],
    },
    select: { id: true },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { username, email, password },
      select: { id: true, username: true },
    });
  }

  return prisma.user.create({
    data: { username, email, password, xp },
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

async function ensureMatch(match, idByUsername) {
  const existing = await prisma.match.findFirst({
    where: {
      OR: [
        { mapId: match.mapId, finishedAt: match.finishedAt },
        ...(match.legacyMapId ? [{ mapId: match.legacyMapId }] : []),
      ],
    },
    select: { id: true },
  });

  if (existing) {
    // Matches seeded before we used real map ids still carry the placeholder.
    await prisma.match.update({
      where: { id: existing.id },
      data: { mapId: match.mapId },
    });
    return;
  }

  await prisma.match.create({
    data: {
      status: 'FINISHED',
      gameMode: 'CLASSIC',
      maxPlayers: 2,
      mapId: match.mapId,
      createdAt: match.finishedAt,
      finishedAt: match.finishedAt,
      players: {
        create: [
          {
            userId: idByUsername.get(match.winner),
            score: match.winnerScore,
            kills: match.winnerKills,
            position: 1,
            isWinner: true,
          },
          {
            userId: idByUsername.get(match.loser),
            score: match.loserScore,
            kills: match.loserKills,
            position: 2,
            isWinner: false,
          },
        ],
      },
    },
  });
}

async function main() {
  const users = [];

  for (const demo of demoUsers) {
    users.push(await upsertUser(demo));
  }

  const idByUsername = new Map(users.map((user) => [user.username, user.id]));

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

  for (const match of demoMatches) {
    await ensureMatch(match, idByUsername);
  }

  console.log(
    `Seed OK: ${users.length} users, ${demoFriendships.length} friendships, ${achievements.length} achievements, ${demoMatches.length} matches`
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
