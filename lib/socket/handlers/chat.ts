import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';
import { SocketMessage } from '../types';

export function setupChatHandlers(socket: Socket) {
  // Handle typing events
  socket.on(SOCKET_EVENTS.CLIENT_TYPING, (data: { conversationId: string; isTyping: boolean }) => {
    const event = data.isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_END;
    socket.to(`conversation:${data.conversationId}`).emit(event, data);
  });

  // Handle message events
  socket.on(SOCKET_EVENTS.MESSAGE_SENT, (message: SocketMessage) => {
    socket.to(`conversation:${message.conversationId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, message);
  });
}