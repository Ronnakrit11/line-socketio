import { useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import useSocket from '@/lib/hooks/useSocket';

export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const { on, off, events } = useSocket();

  const handleNewMessage = useCallback((message: Message) => {
    if (message.conversationId === conversationId) {
      onNewMessage({
        ...message,
        timestamp: new Date(message.timestamp)
      });
    }
  }, [conversationId, onNewMessage]);

  useEffect(() => {
    on(events.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      off(events.MESSAGE_RECEIVED);
    };
  }, [events.MESSAGE_RECEIVED, handleNewMessage, on, off]);
}