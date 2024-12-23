import { DashboardMetrics } from '@/app/types/dashboard';
import { Quotation } from '@prisma/client';

export interface QuotationEventData {
  quotation: Quotation | null; // Allow null for deletion events
  metrics: DashboardMetrics;
}