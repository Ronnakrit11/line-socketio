import { getSocket } from '../client';
import { SOCKET_EVENTS } from '../events';

export class EventEmitter {
  static emit(event: keyof typeof SOCKET_EVENTS, data: any): void {
    const socket = getSocket();
    const eventName = SOCKET_EVENTS[event];
    socket.emit(eventName, data);
  }

  static emitToRoom(room: string, event: keyof typeof SOCKET_EVENTS, data: any): void {
    const socket = getSocket();
    const eventName = SOCKET_EVENTS[event];
    socket.emit('room:emit', { room, event: eventName, data });
  }

  static broadcast(event: keyof typeof SOCKET_EVENTS, data: any): void {
    const socket = getSocket();
    const eventName = SOCKET_EVENTS[event];
    socket.emit('broadcast', { event: eventName, data });
  }
}