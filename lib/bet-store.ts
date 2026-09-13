import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBets(userId: number) {
  return prisma.bet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBet(userId: number, amount: number, odds: number, sportId: number) {
  return prisma.bet.create({
    data: {
      userId,
      amount,
      odds,
      sportId,
    },
  });
}

export async function updateBetStatus(betId: number, status: string) {
  return prisma.bet.update({
    where: { id: betId },
    data: { status },
  });
}
