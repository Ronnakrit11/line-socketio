import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { createQuotation } from '@/lib/services/quotation/create';
import { QuotationCreateParams } from '@/lib/services/quotation/types';
import { broadcastMetricsUpdate } from '@/lib/services/metrics/broadcast';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        lineAccountId: accountId
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineAccountId, customerName, items } = body;

    // Validate required fields
    if (!lineAccountId || !customerName || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate quotation number
    const quotationNumber = `QT${Date.now()}`;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Create quotation params
    const params: QuotationCreateParams = {
      number: quotationNumber,
      customerName,
      total,
      lineAccountId,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }))
    };

    // Create quotation
    const quotation = await createQuotation(params);

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast metrics update
    await broadcastMetricsUpdate(metrics);

    return NextResponse.json(quotation.quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}