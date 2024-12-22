import { Message } from '@prisma/client';
import { emitEvent } from '../../socket/client';
import { SOCKET_EVENTS } from '../../socket/events';
import { formatMessageForSocket } from './formatter';

export async function broadcastMessageUpdate(message: Message) {
  try {
    const formattedMessage = formatMessageForSocket(message);

    // Broadcast message to all clients
    emitEvent(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage);
    
    // Broadcast conversation update
    emitEvent(SOCKET_EVENTS.CONVERSATION_UPDATED, {
      id: message.conversationId,
      lastMessage: formattedMessage
    });

    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}