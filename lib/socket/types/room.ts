// Room event types
export interface RoomEvent {
    room: string;
  }
  
  export interface RoomEmitEvent<T = unknown> extends RoomEvent {
    event: string;
    data: T;
  }
  
  // Room event data types
  export interface RoomJoinEvent extends RoomEvent {}
  export interface RoomLeaveEvent extends RoomEvent {}