import { useState, useEffect } from 'react';
import useSocket from './useSocket';
import { SOCKET_EVENTS } from '../socket/events';

export function useTypingIndicator(conversationId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleTypingStart = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(true);
      }
    };

    const handleTypingEnd = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(false);
      }
    };

    on(events.TYPING_START, handleTypingStart);
    on(events.TYPING_END, handleTypingEnd);

    return () => {
      off(events.TYPING_START);
      off(events.TYPING_END);
    };
  }, [conversationId, on, off, events]);

  return isTyping;
}