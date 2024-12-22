```typescript
import { getIO } from '../server';
import { SOCKET_EVENTS } from '../events';
import { DashboardMetrics } from '@/app/types/dashboard';

export class MetricsService {
  static broadcastUpdate(metrics: DashboardMetrics) {
    const io = getIO();
    io.emit(SOCKET_EVENTS.METRICS_UPDATED, metrics);
  }

  static broadcastQuotationUpdate(metrics: DashboardMetrics, event: string) {
    const io = getIO();
    io.emit(event, { metrics });
  }
}
```