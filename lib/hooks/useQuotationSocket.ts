import { useCallback, useEffect } from 'react';
import useSocket from './useSocket';
import { Quotation } from '@/app/types/quotation';

interface QuotationSocketHandlers {
  onCreated?: (quotation: Quotation) => void;
  onUpdated?: (quotation: Quotation) => void;
  onDeleted?: (quotationId: string) => void;
}

export function useQuotationSocket({
  onCreated,
  onUpdated,
  onDeleted
}: QuotationSocketHandlers) {
  const { on, off, events } = useSocket();

  const handleCreated = useCallback((data: { quotation: Quotation }) => {
    onCreated?.(data.quotation);
  }, [onCreated]);

  const handleUpdated = useCallback((data: { quotation: Quotation }) => {
    onUpdated?.(data.quotation);
  }, [onUpdated]);

  const handleDeleted = useCallback((data: { quotationId: string }) => {
    onDeleted?.(data.quotationId);
  }, [onDeleted]);

  useEffect(() => {
    if (onCreated) on(events.QUOTATION_CREATED, handleCreated);
    if (onUpdated) on(events.QUOTATION_UPDATED, handleUpdated);
    if (onDeleted) on(events.QUOTATION_DELETED, handleDeleted);

    return () => {
      if (onCreated) off(events.QUOTATION_CREATED);
      if (onUpdated) off(events.QUOTATION_UPDATED);
      if (onDeleted) off(events.QUOTATION_DELETED);
    };
  }, [
    events,
    handleCreated,
    handleUpdated,
    handleDeleted,
    onCreated,
    onUpdated,
    onDeleted,
    on,
    off
  ]);
}