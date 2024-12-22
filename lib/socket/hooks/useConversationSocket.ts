```typescript
import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { SOCKET_EVENTS } from '../events';
import { Message } from '@prisma/client';

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
    // Join conversation room
    emit('room:join', `conversation:${conversationId}`);

    const handleMessage = (message: Message) => {
      if (message.conversationId === conversationId && onMessage) {
        onMessage(message);
      }
    };

    const handleTyping = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId && onTyping) {
        onTyping(data.isTyping);
      }
    };

    on(events.MESSAGE_RECEIVED, handleMessage);
    on(events.TYPING_START, () => onTyping?.(true));
    on(events.TYPING_END, () => onTyping?.(false));

    return () => {
      emit('room:leave', `conversation:${conversationId}`);
      off(events.MESSAGE_RECEIVED);
      off(events.TYPING_START);
      off(events.TYPING_END);
    };
  }, [conversationId, onMessage, onTyping, on, off, emit, events]);
}
```