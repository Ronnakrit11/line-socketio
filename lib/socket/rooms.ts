import { getSocket } from './client';

export class SocketRoomManager {
  private static rooms = new Set<string>();

  static joinRoom(room: string): void {
    if (!this.rooms.has(room)) {
      const socket = getSocket();
      socket.emit('room:join', room);
      this.rooms.add(room);
    }
  }

  static leaveRoom(room: string): void {
    if (this.rooms.has(room)) {
      const socket = getSocket();
      socket.emit('room:leave', room);
      this.rooms.delete(room);
    }
  }

  static leaveAllRooms(): void {
    const socket = getSocket();
    this.rooms.forEach(room => {
      socket.emit('room:leave', room);
    });
    this.rooms.clear();
  }

  static getRooms(): string[] {
    return Array.from(this.rooms);
  }
}