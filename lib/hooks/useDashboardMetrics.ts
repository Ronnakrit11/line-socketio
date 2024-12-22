import { useState, useEffect } from 'react';
import { DashboardMetrics } from '@/app/types/dashboard';
import useSocket from '../socket/hooks/useSocket';
import { QuotationEventData } from '@/lib/socket/types/quotation';


export function useDashboardMetrics(initialMetrics: DashboardMetrics) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const { on, off, events } = useSocket();

  useEffect(() => {
    const handleMetricsUpdate = (updatedMetrics: DashboardMetrics) => {
      setMetrics(updatedMetrics);
    };

    // Handle quotation events with proper typing
    const handleQuotationEvent = (data: QuotationEventData) => {
      handleMetricsUpdate(data.metrics);
    };

    // Subscribe to events with proper types
    on(events.METRICS_UPDATED, handleMetricsUpdate);
    on(events.QUOTATION_CREATED, handleQuotationEvent);
    on(events.QUOTATION_UPDATED, handleQuotationEvent);
    on(events.QUOTATION_DELETED, handleQuotationEvent);

    return () => {
      off(events.METRICS_UPDATED);
      off(events.QUOTATION_CREATED);
      off(events.QUOTATION_UPDATED);
      off(events.QUOTATION_DELETED);
    };
  }, [on, off, events]);

  return metrics;
}