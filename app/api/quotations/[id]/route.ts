import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { SocketEventData } from '@/lib/socket/types';

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
      EventEmitter.emit<keyof SocketEventData>(
        SOCKET_EVENTS.METRICS_UPDATED, 
        metrics
      ),
      EventEmitter.emit<keyof SocketEventData>(
        SOCKET_EVENTS.QUOTATION_DELETED, 
        {
          quotation: null, // Null since quotation was deleted
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { customerName, items } = body;

    // Calculate new total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Update quotation and items in a transaction
    const quotation = await prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.quotationItem.deleteMany({
        where: { quotationId: id }
      });

      // Update quotation and create new items
      return tx.quotation.update({
        where: { id },
        data: {
          customerName,
          total,
          items: {
            create: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price
            }))
          }
        },
        include: {
          items: true
        }
      });
    });

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast updates using Socket.IO
    await Promise.all([
      EventEmitter.emit<keyof SocketEventData>(
        SOCKET_EVENTS.METRICS_UPDATED, 
        metrics
      ),
      EventEmitter.emit<keyof SocketEventData>(
        SOCKET_EVENTS.QUOTATION_UPDATED, 
        {
          quotation,
          metrics
        }
      )
    ]);

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}