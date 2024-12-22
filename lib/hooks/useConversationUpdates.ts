import { useEffect } from 'react';
import useSocket from './useSocket';
import { SOCKET_EVENTS } from '../socket/events';
import { useChatState } from '@/app/features/chat/useChatState';

export function useConversationUpdates() {
  const { refreshConversations, addMessage, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const messageWithDate = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      addMessage(messageWithDate);
    };

    const handleConversationUpdate = (conversation: any) => {
      const formattedConversation = {
        ...conversation,
        messages: conversation.messages.map((msg: any) => ({
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