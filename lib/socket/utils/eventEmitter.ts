import { getSocket } from '../client';
import { SOCKET_EVENTS } from '../events';
import { SocketEventData } from '../types';

export class EventEmitter {
  static emit<K extends keyof SocketEventData>(
    event: K, 
    data: SocketEventData[K]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  }

  static emitToRoom<K extends keyof SocketEventData>(
    room: string,
    event: K,
    data: SocketEventData[K]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit('room:emit', { room, event, data });
    }
  }

  static broadcast<K extends keyof SocketEventData>(
    event: K,
    data: SocketEventData[K]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit('broadcast', { event, data });
    }
  }
}