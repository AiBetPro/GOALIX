import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Jane Smith',
    },
  });

  console.log(`Created users: ${user1.email}, ${user2.email}`);

  // Seed matches
  const match1 = await prisma.match.create({
    data: {
      sportId: 1,
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  console.log(`Created match: ${match1.homeTeam} vs ${match1.awayTeam}`);

  // Seed bets
  const bet1 = await prisma.bet.create({
    data: {
      userId: user1.id,
      amount: 100,
      odds: 2.5,
      sportId: 1,
    },
  });

  console.log(`Created bet: ${bet1.amount} @ ${bet1.odds}`);
  console.log('Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
