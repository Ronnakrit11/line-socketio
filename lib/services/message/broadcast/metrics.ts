import { broadcastEvent } from '../../../socket/emitter';
import { SOCKET_EVENTS } from '../../../socket/events';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

export async function broadcastMetricsUpdate() {
  try {
    const metrics = await getDashboardMetrics();
    broadcastEvent(SOCKET_EVENTS.METRICS_UPDATED, metrics);
    return true;
  } catch (error) {
    console.error('Error broadcasting metrics update:', error);
    return false;
  }
}