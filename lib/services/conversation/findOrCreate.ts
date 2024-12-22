import { Platform, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findOrCreateConversation(
  userId: string,
  platform: Platform,
  channelId: string,
  lineAccountId?: string | null
) {
  try {
    // Try to find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        platform,
        lineAccountId
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    // Create new conversation if none exists
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          platform,
          channelId,
          lineAccountId
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
    }

    return conversation;
  } catch (error) {
    console.error('Error finding/creating conversation:', error);
    throw error;
  }
}