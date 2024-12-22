import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from './useChatState';

export function useChatEvents(initialConversations: SerializedConversation[]) {
  const {
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useChatState();

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
    const handleMessage = (message: any) => {
      const updatedMessage = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      addMessage(updatedMessage);
    };

    const handleConversationUpdate = (conversation: any) => {
      const updatedConversation = {
        ...conversation,
        messages: conversation.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };

      updateConversation(updatedConversation);

      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation(updatedConversation);
      }
    };

    const handleConversationsUpdate = (conversations: any[]) => {
      const formattedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      }));

      setConversations(formattedConversations);
    };

    on(events.MESSAGE_RECEIVED, handleMessage);
    on(events.CONVERSATION_UPDATED, handleConversationUpdate);
    on(events.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(events.MESSAGE_RECEIVED);
      off(events.CONVERSATION_UPDATED);
      off(events.CONVERSATIONS_UPDATED);
    };
  }, [selectedConversation, addMessage, updateConversation, setSelectedConversation, setConversations, on, off, events]);
}