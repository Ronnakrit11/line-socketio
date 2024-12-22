
import { Socket } from 'socket.io';

export function loggingMiddleware(socket: Socket, next: (err?: Error) => void) {
  console.log('Client connecting:', {
    id: socket.id,
    time: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', {
      id: socket.id,
      time: new Date().toISOString()
    });
  });

  next();
}
