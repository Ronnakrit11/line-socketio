
import { getSocket } from '../client';

export class RoomManager {
  private static activeRooms = new Set<string>();

  static joinRoom(room: string): void {
    if (!this.activeRooms.has(room)) {
      const socket = getSocket();
      socket.emit('room:join', room);
      this.activeRooms.add(room);
    }
  }

  static leaveRoom(room: string): void {
    if (this.activeRooms.has(room)) {
      const socket = getSocket();
      socket.emit('room:leave', room);
      this.activeRooms.delete(room);
    }
  }

  static leaveAllRooms(): void {
    const socket = getSocket();
    this.activeRooms.forEach(room => {
      socket.emit('room:leave', room);
    });
    this.activeRooms.clear();
  }

  static isInRoom(room: string): boolean {
    return this.activeRooms.has(room);
  }
}
