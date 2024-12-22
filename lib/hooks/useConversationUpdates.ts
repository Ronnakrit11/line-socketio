import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '@/app/features/chat/useChatState';
import { Message } from '@prisma/client';
import { SocketConversation } from '@/lib/socket/types';
import { ConversationWithMessages } from '@/app/types/chat';

export function useConversationUpdates() {
  const { refreshConversations, addMessage, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      const messageWithDate = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      addMessage(messageWithDate);
    };

    const handleConversationUpdate = (socketConversation: SocketConversation) => {
      // Convert socket conversation to app conversation format
      const formattedConversation: ConversationWithMessages = {
        id: socketConversation.id,
        platform: socketConversation.platform,
        channelId: socketConversation.channelId,
        userId: socketConversation.userId,
        messages: socketConversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt),
        lineAccountId: socketConversation.lineAccountId
      };
      
      updateConversation(formattedConversation);
    };

    const handleConversationsUpdate = () => {
      refreshConversations();
    };

    // Subscribe to events
    on(events.MESSAGE_RECEIVED, handleNewMessage);
    on(events.CONVERSATION_UPDATED, handleConversationUpdate);
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    // Cleanup subscriptions
    return () => {
      off(events.MESSAGE_RECEIVED);
      off(events.CONVERSATION_UPDATED);
      off(events.CONVERSATIONS_UPDATED);
    };
  }, [addMessage, updateConversation, refreshConversations, on, off, events]);
}