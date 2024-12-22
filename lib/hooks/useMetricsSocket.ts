import { useCallback, useEffect } from 'react';
import useSocket from './useSocket';
import { DashboardMetrics } from '@/app/types/dashboard';

export function useMetricsSocket(onMetricsUpdated: (metrics: DashboardMetrics) => void) {
  const { on, off, events } = useSocket();

  const handleMetricsUpdate = useCallback((metrics: DashboardMetrics) => {
    onMetricsUpdated(metrics);
  }, [onMetricsUpdated]);

  useEffect(() => {
    on(events.METRICS_UPDATED, handleMetricsUpdate);

    return () => {
      off(events.METRICS_UPDATED);
    };
  }, [events, handleMetricsUpdate, on, off]);
}