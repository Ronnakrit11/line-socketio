import { Platform } from '@prisma/client';

// Webhook event types
export interface LineMessageContent {
  type: string;
  text?: string;
  id: string;
  quoteToken?: string;
}

export interface LineSource {
  type: string;
  userId: string;
  roomId?: string;
  groupId?: string;
}

export interface LineMessageEvent {
  type: string;
  message: LineMessageContent;
  source: LineSource;
  replyToken: string;
  timestamp: number;
  webhookEventId: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
  mode: string;
}

export interface LineWebhookBody {
  destination: string;
  events: LineMessageEvent[];
}

// Webhook processing types
export interface WebhookEventResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WebhookProcessingResult {
  processed: number;
  total: number;
  results: WebhookEventResult[];
}

// Account types
export interface LineAccount {
  id: string;
  name: string;
  channelSecret: string;
  channelAccessToken: string;
  active: boolean;
}

// Profile types
export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  platform: Platform;
}