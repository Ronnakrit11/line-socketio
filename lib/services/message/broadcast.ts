import { DashboardMetrics } from '@/app/types/dashboard';
import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';

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
  event: keyof typeof SOCKET_EVENTS
) {
  try {
    EventEmitter.emit(event, { metrics });
    return true;
  } catch (error) {
    console.error('Error broadcasting quotation metrics:', error);
    return false;
  }
}