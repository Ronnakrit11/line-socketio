import { Socket } from 'socket.io';
import { AUTH_EVENTS } from '../events/auth';

export function setupAuthHandlers(socket: Socket) {
  socket.on(AUTH_EVENTS.AUTH_SUCCESS, () => {
    socket.emit('authenticated');
  });

  socket.on(AUTH_EVENTS.AUTH_ERROR, (error: string) => {
    socket.emit('auth:error', { error });
  });

  socket.on(AUTH_EVENTS.AUTH_LOGOUT, () => {
    socket.disconnect();
  });
}