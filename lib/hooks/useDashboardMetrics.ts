import { useState, useEffect } from 'react';
import { DashboardMetrics } from '@/app/types/dashboard';
import useSocket from './useSocket';
import { SOCKET_EVENTS } from '../socket/events';

export function useDashboardMetrics(initialMetrics: DashboardMetrics) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleMetricsUpdate = (updatedMetrics: DashboardMetrics) => {
      setMetrics(updatedMetrics);
    };

    on(events.METRICS_UPDATED, handleMetricsUpdate);
    on(events.QUOTATION_CREATED, (data: { metrics: DashboardMetrics }) => handleMetricsUpdate(data.metrics));
    on(events.QUOTATION_UPDATED, (data: { metrics: DashboardMetrics }) => handleMetricsUpdate(data.metrics));
    on(events.QUOTATION_DELETED, (data: { metrics: DashboardMetrics }) => handleMetricsUpdate(data.metrics));

    return () => {
      off(events.METRICS_UPDATED);
      off(events.QUOTATION_CREATED);
      off(events.QUOTATION_UPDATED);
      off(events.QUOTATION_DELETED);
    };
  }, [on, off, events]);

  return metrics;
}