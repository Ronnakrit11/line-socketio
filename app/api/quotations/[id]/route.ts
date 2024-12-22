import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { SocketEventName } from '@/lib/socket/types/events';

const prisma = new PrismaClient();

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete all items first due to foreign key constraint
    await prisma.quotationItem.deleteMany({
      where: { quotationId: id }
    });

    // Then delete the quotation
    await prisma.quotation.delete({
      where: { id }
    });

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast updates using Socket.IO with proper typing
    await Promise.all([
      EventEmitter.emit<SocketEventName>(
        SOCKET_EVENTS.METRICS_UPDATED,
        metrics
      ),
      EventEmitter.emit<SocketEventName>(
        SOCKET_EVENTS.QUOTATION_DELETED,
        {
          quotation: null,
          metrics
        }
      )
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}