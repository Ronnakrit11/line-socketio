import { getSocket } from '../client';

import { SocketEventMap, SocketEventName } from '../types/events';

export class EventEmitter {
  static emit<E extends SocketEventName>(
    event: E,
    data: SocketEventMap[E]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  }

  static emitToRoom<E extends SocketEventName>(
    room: string,
    event: E,
    data: SocketEventMap[E]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit('room:emit', { room, event, data });
    }
  }

  static broadcast<E extends SocketEventName>(
    event: E,
    data: SocketEventMap[E]
  ): void {
    const socket = getSocket();
    if (socket) {
      socket.emit('broadcast', { event, data });
    }
  }
}