import { Quotation, QuotationItem } from '@prisma/client';

export interface QuotationCreateParams {
  number: string;
  customerName: string;
  total: number;
  lineAccountId: string;
  items: Omit<QuotationItem, 'id' | 'quotationId'>[];
}

export interface QuotationResult {
  success: boolean;
  quotation?: Quotation & { items: QuotationItem[] };
  error?: string;
}