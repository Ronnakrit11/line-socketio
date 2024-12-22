
import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '@/app/features/chat/useChatState';
import { Message } from '@prisma/client';

interface MessageWithDate extends Message {
  timestamp: Date;
}


export function useConversationUpdates() {
  const { refreshConversations, addMessage, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      const messageWithDate: MessageWithDate = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      addMessage(messageWithDate);
    };


    const handleConversationsUpdate = () => {
      refreshConversations();
    };

    on(events.MESSAGE_RECEIVED, handleNewMessage);
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);
  
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(events.MESSAGE_RECEIVED);
      off(events.CONVERSATIONS_UPDATED);
      
      off(events.CONVERSATIONS_UPDATED);
    };
  }, [addMessage, updateConversation, refreshConversations, on, off, events]);
}
