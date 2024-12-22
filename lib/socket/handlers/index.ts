import { Socket } from 'socket.io';
import { setupChatHandlers } from './chat';
import { setupRoomHandlers } from './room';
import { setupAuthHandlers } from './auth';

export function setupSocketHandlers(socket: Socket) {
  setupChatHandlers(socket);
  setupRoomHandlers(socket);
  setupAuthHandlers(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
}