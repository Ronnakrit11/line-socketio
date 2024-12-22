import React, { useState, useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleTypingStart = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(true);
      }
    };

    const handleTypingEnd = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(false);
      }
    };

    on(events.TYPING_START, handleTypingStart);
    on(events.TYPING_END, handleTypingEnd);

    return () => {
      off(events.TYPING_START);
      off(events.TYPING_END);
    };
  }, [conversationId, events, on, off]);

  if (!isTyping) return null;

  return (
    <div className="px-6 py-2">
      <div className="typing-indicator flex items-center gap-1 text-muted">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}