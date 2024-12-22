import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '../types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '../features/chat/useChatState';
import { SocketConversation, SocketMessage } from '@/lib/socket/types';
import { mapSocketMessageToMessage } from './message/messageMapper';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

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

  useEffect(() => {
    const handleConversationUpdate = (socketConversation: SocketConversation) => {
      const updatedConversation: ConversationWithMessages = {
        id: socketConversation.id,
        platform: socketConversation.platform,
        channelId: socketConversation.channelId,
        userId: socketConversation.userId,
        messages: socketConversation.messages.map((msg: SocketMessage) => mapSocketMessageToMessage(msg)),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt),
        lineAccountId: socketConversation.lineAccountId
      };
      updateConversation(updatedConversation);
    };

    const handleConversationsUpdate = (socketConversations: SocketConversation[]) => {
      const formattedConversations = socketConversations.map(conv => ({
        id: conv.id,
        platform: conv.platform,
        channelId: conv.channelId,
        userId: conv.userId,
        messages: conv.messages.map((msg: SocketMessage) => mapSocketMessageToMessage(msg)),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        lineAccountId: conv.lineAccountId
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