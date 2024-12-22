import { Socket } from 'socket.io';
import { SocketEventData } from '../types';

interface RoomEmitData<K extends keyof SocketEventData> {
  room: string;
  event: K;
  data: SocketEventData[K];
}

export function setupRoomHandlers(socket: Socket) {
  socket.on('room:join', (room: string) => {
    socket.join(room);
  });

  socket.on('room:leave', (room: string) => {
    socket.leave(room);
  });

  socket.on('room:emit', <K extends keyof SocketEventData>({ room, event, data }: RoomEmitData<K>) => {
    socket.to(room).emit(event, data);
  });
}