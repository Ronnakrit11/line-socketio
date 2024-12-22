
import { Socket } from 'socket.io';

export function errorMiddleware(socket: Socket, next: (err?: Error) => void) {
  socket.on('error', (error: Error) => {
    console.error('Socket error:', {
      id: socket.id,
      error: error.message,
      time: new Date().toISOString()
    });
  });

  next();
}
