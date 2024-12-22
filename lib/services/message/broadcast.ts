import { Message } from '@prisma/client';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { SocketMessage } from '@/lib/socket/types/message';
import { prisma } from '../database/client';

function formatMessage(message: Message): SocketMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platformType: message.platform,
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId,
    imageBase64: message.imageBase64
  };
}

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

    // Get latest message
    const latestMessage = conversation.messages[conversation.messages.length - 1];
    if (latestMessage) {
      const formattedMessage = formatMessage(latestMessage);
      await EventEmitter.emit(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage);
    }

    return true;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    return false;
  }
}

export async function broadcastMessage(message: Message) {
  try {
    const formattedMessage = formatMessage(message);
    await EventEmitter.emit(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage);
    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}