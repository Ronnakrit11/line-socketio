
import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '@/app/features/chat/useChatState';
import { Message } from '@prisma/client';
import { ConversationWithMessages } from '../types/chat';

interface MessageWithDate extends Message {
  timestamp: Date;
}

interface ConversationUpdate extends ConversationWithMessages {
  messages: MessageWithDate[];
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

    const handleConversationUpdate = (conversation: ConversationUpdate) => {
      const formattedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };
      updateConversation(formattedConversation);
    };

    const handleConversationsUpdate = () => {
      refreshConversations();
    };

    on(events.MESSAGE_RECEIVED, handleNewMessage);
    on(events.CONVERSATION_UPDATED, handleConversationUpdate);
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(events.MESSAGE_RECEIVED);
      off(events.CONVERSATION_UPDATED);
      off(events.CONVERSATIONS_UPDATED);
    };
  }, [addMessage, updateConversation, refreshConversations, on, off, events]);
}
