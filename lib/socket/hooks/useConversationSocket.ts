import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { SOCKET_EVENTS } from '../events';
import { Message } from '@prisma/client';
import { RoomJoinEvent, RoomLeaveEvent } from '../types/room';

interface UseConversationSocketProps {
  conversationId: string;
  onMessage?: (message: Message) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function useConversationSocket({
  conversationId,
  onMessage,
  onTyping
}: UseConversationSocketProps) {
  const { on, off, emit, events } = useSocket();

  useEffect(() => {
    // Create room events with proper typing
    const joinEvent: RoomJoinEvent = { room: `conversation:${conversationId}` };
    const leaveEvent: RoomLeaveEvent = { room: `conversation:${conversationId}` };

    // Join conversation room with proper event type
    emit(events.ROOM_JOIN, joinEvent);

    const handleMessage = (message: Message) => {
      if (message.conversationId === conversationId && onMessage) {
        onMessage(message);
      }
    };

    // Subscribe to events
    on(events.MESSAGE_RECEIVED, handleMessage);
    
    // Handle typing events
    if (onTyping) {
      on(events.TYPING_START, () => onTyping(true));
      on(events.TYPING_END, () => onTyping(false));
    }

    return () => {
      // Leave room with proper event type
      emit(events.ROOM_LEAVE, leaveEvent);
      
      // Cleanup event listeners
      off(events.MESSAGE_RECEIVED);
      if (onTyping) {
        off(events.TYPING_START);
        off(events.TYPING_END);
      }
    };
  }, [conversationId, onMessage, onTyping, on, off, emit, events]);
}