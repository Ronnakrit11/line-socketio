import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });
}

export async function findConversationByUserId(userId: string, platform: 'LINE' | 'FACEBOOK') {
  return prisma.conversation.findFirst({
    where: {
      userId,
      platform
    },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });
}