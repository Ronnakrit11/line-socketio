export * from './conversation';
export * from './metrics';

import { Message } from '@prisma/client';
import { broadcastConversationMessage } from './conversation';
import { broadcastMetricsUpdate } from './metrics';
import { findConversationById } from '../../conversation';

export async function broadcastMessage(message: Message) {
  try {
    const conversation = await findConversationById(message.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await Promise.all([
      broadcastConversationMessage(message, conversation),
      broadcastMetricsUpdate()
    ]);

    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}