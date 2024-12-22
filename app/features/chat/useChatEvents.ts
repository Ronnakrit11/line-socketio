import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from './useChatState';
import { SocketConversation } from '@/lib/socket/types/conversation';

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

  // Setup Socket.IO event handlers
  useEffect(() => {
    const handleConversationUpdate = (socketConversation: SocketConversation) => {
      const updatedConversation: ConversationWithMessages = {
        ...socketConversation,
        messages: socketConversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          platform: msg.platformType // Map platformType to platform
        })),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt)
      };
      updateConversation(updatedConversation);
    };

    const handleConversationsUpdate = (socketConversations: SocketConversation[]) => {
      const formattedConversations = socketConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          platform: msg.platformType // Map platformType to platform
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      })) as ConversationWithMessages[];
      setConversations(formattedConversations);
    };

    on(events.CONVERSATION_UPDATED, handleConversationUpdate);
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(events.CONVERSATION_UPDATED);
      off(events.CONVERSATIONS_UPDATED);
    };
  }, [updateConversation, setConversations, on, off, events]);
}