import { getSocket } from './client';
import { SocketEvent } from './events';

export function emitToRoom<T>(room: string, event: SocketEvent, data: T): void {
  const socket = getSocket();
  socket.emit('room:emit', { room, event, data });
}

export function joinRoom(room: string): void {
  const socket = getSocket();
  socket.emit('room:join', room);
}

export function leaveRoom(room: string): void {
  const socket = getSocket();
  socket.emit('room:leave', room);
}

export function broadcastEvent<T>(event: SocketEvent, data: T): void {
  const socket = getSocket();
  socket.emit('broadcast', { event, data });
}