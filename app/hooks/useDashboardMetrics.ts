import { useState, useEffect } from 'react';
import { DashboardMetrics } from '../types/dashboard';
import useSocket from '@/lib/hooks/useSocket';

export function useDashboardMetrics(initialMetrics: DashboardMetrics) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleMetricsUpdate = (updatedMetrics: DashboardMetrics) => {
      console.log('Received metrics update:', updatedMetrics);
      setMetrics(updatedMetrics);
    };

    // Handle metrics updates from different events
    const handleQuotationEvent = (data: { metrics: DashboardMetrics }) => {
      handleMetricsUpdate(data.metrics);
    };

    // Subscribe to metrics events
    on(events.METRICS_UPDATED, handleMetricsUpdate);
    on(events.QUOTATION_CREATED, handleQuotationEvent);
    on(events.QUOTATION_UPDATED, handleQuotationEvent);
    on(events.QUOTATION_DELETED, handleQuotationEvent);

    // Cleanup subscriptions
    return () => {
      off(events.METRICS_UPDATED);
      off(events.QUOTATION_CREATED);
      off(events.QUOTATION_UPDATED);
      off(events.QUOTATION_DELETED);
    };
  }, [on, off, events]);

  return metrics;
}