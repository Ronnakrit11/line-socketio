import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { formatConversationForSocket } from '@/lib/services/conversation/formatter';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Add basic API authentication
    const authHeader = request.headers.get('authorization');
    if (!process.env.API_SECRET_KEY || authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Format conversations for Socket.IO
    const formattedConversations = conversations.map(formatConversationForSocket);
    
    // Broadcast conversations update
    EventEmitter.emit('CONVERSATIONS_UPDATED', formattedConversations);
    
    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' }, 
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}