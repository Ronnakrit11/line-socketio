import { PrismaClient } from '@prisma/client';
import { emitEvent } from '@/lib/socket';
import { SOCKET_EVENTS } from '../../socket/events';

const prisma = new PrismaClient();

export async function broadcastAllConversations() {
  try {
    // Get all conversations with latest messages
    const conversations = await prisma.conversation.findMany({
      select: {
        id: true,
        platform: true,
        userId: true,
        updatedAt: true,
        lineAccountId: true,
        lineAccount: {
          select: {
            id: true,
            name: true
          }
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            sender: true,
            timestamp: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Format data for broadcast
    const formattedData = conversations.map(conv => ({
      id: conv.id,
      platform: conv.platform,
      userId: conv.userId,
      updatedAt: conv.updatedAt.toISOString(),
      lineAccountId: conv.lineAccountId,
      lineAccount: conv.lineAccount,
      lastMessage: conv.messages[0] ? {
        ...conv.messages[0],
        timestamp: conv.messages[0].timestamp.toISOString()
      } : null
    }));

    // Broadcast to all clients
    emitEvent(SOCKET_EVENTS.CONVERSATIONS_UPDATED, formattedData);

    return true;
  } catch (error) {
    console.error('Error broadcasting conversations:', error);
    return false;
  }
}