import { Conversation, Message } from '@prisma/client';
import { emitToRoom, broadcastEvent } from '../../../socket/emitter';
import { SOCKET_EVENTS } from '../../../socket/events';
import { formatMessageForSocket } from '../formatter';

export async function broadcastConversationMessage(
  message: Message,
  conversation: Conversation
) {
  try {
    const formattedMessage = formatMessageForSocket(message);

    // Emit to conversation room
    emitToRoom(
      `conversation:${conversation.id}`,
      SOCKET_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast conversation update to all clients
    broadcastEvent(SOCKET_EVENTS.CONVERSATION_UPDATED, {
      id: conversation.id,
      lastMessage: formattedMessage,
      updatedAt: conversation.updatedAt
    });

    return true;
  } catch (error) {
    console.error('Error broadcasting conversation message:', error);
    return false;
  }
}