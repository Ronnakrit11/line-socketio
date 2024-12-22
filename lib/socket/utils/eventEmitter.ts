import { getSocket } from '../client';
import { SOCKET_EVENTS } from '../events';

export class EventEmitter {
  static emit<T>(event: keyof typeof SOCKET_EVENTS, data: T): void {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS[event], data);
  }

  static emitToRoom<T>(room: string, event: keyof typeof SOCKET_EVENTS, data: T): void {
    const socket = getSocket();
    socket.emit('room:emit', { 
      room, 
      event: SOCKET_EVENTS[event], 
      data 
    });
  }

  static broadcast<T>(event: keyof typeof SOCKET_EVENTS, data: T): void {
    const socket = getSocket();
    socket.emit('broadcast', { 
      event: SOCKET_EVENTS[event], 
      data 
    });
  }
}