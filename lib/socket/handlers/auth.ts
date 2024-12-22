import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';

export function setupAuthHandlers(socket: Socket) {
  socket.on(SOCKET_EVENTS.AUTH_SUCCESS, () => {
    socket.emit('authenticated');
  });

  socket.on(SOCKET_EVENTS.AUTH_ERROR, (error: string) => {
    socket.emit('auth:error', { error });
  });

  socket.on(SOCKET_EVENTS.AUTH_LOGOUT, () => {
    socket.disconnect();
  });
}