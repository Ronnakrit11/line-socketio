import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages, SerializedMessage } from '../types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from '../features/chat/useChatState';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations, updateConversation } = useChatState();
  const { on, off, events } = useSocket();

  // Initialize conversations
  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      const formattedConversations = initialConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map((msg: SerializedMessage) => ({
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
    const handleConversationUpdate = (conversation: SerializedConversation) => {
      const updatedConversation = {
        ...conversation,
        messages: conversation.messages.map((msg: SerializedMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };
      updateConversation(updatedConversation);
    };

    const handleConversationsUpdate = (conversations: SerializedConversation[]) => {
      const formattedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map((msg: SerializedMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      }));
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