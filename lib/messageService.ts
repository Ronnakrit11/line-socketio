import { PrismaClient, Message } from '@prisma/client';
import { EventEmitter } from './socket/utils/eventEmitter';

import { formatConversationForSocket } from './services/conversation/formatter';

const prisma = new PrismaClient();

export async function createMessage(
  conversationId: string,
  content: string,
  sender: 'USER' | 'BOT',
  platform: 'LINE' | 'FACEBOOK',
  externalId?: string,
  timestamp?: Date
): Promise<Message> {
  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
      platform,
      externalId,
      timestamp: timestamp || new Date()
    }
  });
}

export async function broadcastConversationUpdate(conversationId: string) {
  try {
    // Get conversation with messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Format and broadcast conversation update
    const formattedConversation = formatConversationForSocket(conversation);
    EventEmitter.emit('CONVERSATION_UPDATED', formattedConversation);

    // Get and broadcast all conversations
    const allConversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Format and broadcast all conversations
    const formattedConversations = allConversations.map(formatConversationForSocket);
    EventEmitter.emit('CONVERSATIONS_UPDATED', formattedConversations);

    console.log('Successfully broadcast updates for conversation:', conversationId);
  } catch (error) {
    console.error('Error broadcasting conversation update:', error);
    throw error;
  }
}