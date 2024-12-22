import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '../types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '../features/chat/useChatState';
import { SocketConversation } from '@/lib/socket/types/conversation';
import { SocketEventCallback } from '@/lib/socket/types';

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
    const handleConversationUpdate: SocketEventCallback<SocketConversation> = (socketConversation) => {
      const updatedConversation: ConversationWithMessages = {
        id: socketConversation.id,
        platform: socketConversation.platform,
        channelId: socketConversation.channelId,
        userId: socketConversation.userId,
        messages: socketConversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          platform: socketConversation.platform,
          externalId: msg.externalId || null,
          chatType: msg.chatType || null,
          chatId: msg.chatId || null,
          imageBase64: msg.imageBase64 || null
        })),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt),
        lineAccountId: socketConversation.lineAccountId
      };
      updateConversation(updatedConversation);
    };

    // Subscribe to conversation update events
    on(events.CONVERSATION_UPDATED, handleConversationUpdate);

    return () => {
      off(events.CONVERSATION_UPDATED);
    };
  }, [updateConversation, on, off, events]);
}