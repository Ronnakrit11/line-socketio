import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '../types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '../features/chat/useChatState';
import { SocketEventData } from '@/lib/socket/types';
import { mapSocketToConversation } from '@/lib/socket/mappers/conversation';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

  // Initialize conversations
  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      const formattedConversations = initialConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      })) as ConversationWithMessages[];

      setConversations(formattedConversations);
    }
  }, [initialConversations, setConversations]);

  // Handle real-time updates
  useEffect(() => {
    const handleConversationUpdate = (socketConversation: SocketEventData[typeof events.CONVERSATION_UPDATED]) => {
      try {
        const updatedConversation = mapSocketToConversation(socketConversation);
        updateConversation(updatedConversation);
      } catch (error) {
        console.error('Error handling conversation update:', error);
      }
    };

    on(events.CONVERSATION_UPDATED, handleConversationUpdate);

    return () => {
      off(events.CONVERSATION_UPDATED);
    };
  }, [updateConversation, on, off, events]);
}