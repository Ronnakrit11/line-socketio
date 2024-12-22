
"use client";

import { useCallback } from 'react';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { useConversationEvents } from '@/app/hooks/useConversationEvents';
import { APIResponse } from '@/app/types/api';
import useSocket from '@/lib/hooks/useSocket';

export function useChat(initialConversations: SerializedConversation[]) {
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation,
    updateConversation 
  } = useChatState();
  
  useConversationEvents(initialConversations);
  const { emit, events } = useSocket();

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content,
          platform: selectedConversation.platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json() as APIResponse;
      
      if (data.conversation) {
        const updatedConversation: ConversationWithMessages = {
          ...data.conversation,
          messages: data.conversation.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            imageBase64: msg.imageBase64 || null
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt)
        };

        updateConversation(updatedConversation);
        
        // Emit message sent event
        emit(events.MESSAGE_SENT, {
          conversationId: selectedConversation.id,
          message: data.message
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [selectedConversation, updateConversation, emit, events]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
