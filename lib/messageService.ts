import { PrismaClient } from '@prisma/client';
import { EventEmitter } from './socket/utils/eventEmitter';
import { SOCKET_EVENTS } from './socket/events';
import { formatConversationForSocket } from './services/conversation/formatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(conversationId: string) {
  try {
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
    EventEmitter.emit(SOCKET_EVENTS.CONVERSATION_UPDATED, formattedConversation);

    return true;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    return false;
  }
}