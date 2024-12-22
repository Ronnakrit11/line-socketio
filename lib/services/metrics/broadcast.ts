import { DashboardMetrics } from '@/app/types/dashboard';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';

export async function broadcastMetricsUpdate(metrics: DashboardMetrics) {
  try {
    EventEmitter.emit('METRICS_UPDATED', metrics);
    return true;
  } catch (error) {
    console.error('Error broadcasting metrics update:', error);
    return false;
  }
}

export async function broadcastQuotationMetrics(
  metrics: DashboardMetrics,
  event: 'QUOTATION_CREATED' | 'QUOTATION_UPDATED' | 'QUOTATION_DELETED'
) {
  try {
    EventEmitter.emit(event, { metrics });
    return true;
  } catch (error) {
    console.error('Error broadcasting quotation metrics:', error);
    return false;
  }
}