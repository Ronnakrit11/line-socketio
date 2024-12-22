import { Message } from '@prisma/client';
import { getIO } from '../server';
import { SOCKET_EVENTS } from '../events';
import { formatMessageForSocket } from '../../services/message/formatter';

export class MessageService {
  static broadcastMessage(message: Message) {
    const io = getIO();
    const formattedMessage = formatMessageForSocket(message);

    // Emit to conversation room
    io.to(`conversation:${message.conversationId}`).emit(
      SOCKET_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast to all clients for updates
    io.emit(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage);
  }

  static broadcastTyping(conversationId: string, isTyping: boolean) {
    const io = getIO();
    const event = isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_END;
    
    io.to(`conversation:${conversationId}`).emit(event, {
      conversationId,
      isTyping
    });
  }
}