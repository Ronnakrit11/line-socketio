import { Socket } from 'socket.io';

export function setupRoomHandlers(socket: Socket) {
  socket.on('room:join', (room: string) => {
    socket.join(room);
  });

  socket.on('room:leave', (room: string) => {
    socket.leave(room);
  });

  socket.on('room:emit', ({ room, event, data }: { room: string; event: string; data: any }) => {
    socket.to(room).emit(event, data);
  });
}