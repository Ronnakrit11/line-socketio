import { useEffect } from 'react';
import { Message } from '@prisma/client';
import useSocket from './useSocket';


export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        onNewMessage({
          ...message,
          timestamp: new Date(message.timestamp)
        });
      }
    };

    on(events.MESSAGE_RECEIVED, handleMessage);
    return () => off(events.MESSAGE_RECEIVED);
  }, [conversationId, onNewMessage, on, off, events]);
}