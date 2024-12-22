```typescript
import { Conversation } from '@prisma/client';
import { getIO } from '../server';
import { SOCKET_EVENTS } from '../events';

export class ConversationService {
  static broadcastUpdate(conversation: Conversation) {
    const io = getIO();
    io.emit(SOCKET_EVENTS.CONVERSATION_UPDATED, {
      id: conversation.id,
      updatedAt: conversation.updatedAt
    });
  }

  static broadcastUpdates(conversations: Conversation[]) {
    const io = getIO();
    io.emit(SOCKET_EVENTS.CONVERSATIONS_UPDATED, conversations);
  }

  static joinRoom(socketId: string, conversationId: string) {
    const io = getIO();
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`conversation:${conversationId}`);
    }
  }

  static leaveRoom(socketId: string, conversationId: string) {
    const io = getIO();
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(`conversation:${conversationId}`);
    }
  }
}
```