import { Message } from '@prisma/client';
import { emitEvent, emitToRoom } from '@/lib/socket/emitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { formatMessageForSocket } from './formatter';

export function broadcastNewMessage(message: Message) {
  const formattedMessage = formatMessageForSocket(message);
  
  // Emit to conversation room
  emitToRoom(
    `conversation-${message.conversationId}`,
    SOCKET_EVENTS.MESSAGE_RECEIVED,
    formattedMessage
  );

  // Emit to all clients for conversation list updates
  emitEvent(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage);
}

export function broadcastTypingStatus(
  conversationId: string,
  isTyping: boolean
) {
  const event = isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_END;
  emitToRoom(`conversation-${conversationId}`, event, { conversationId });
}