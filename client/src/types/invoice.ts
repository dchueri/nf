export enum InvoiceStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IGNORED = 'ignored',
  PENDING = 'pending',
  PAID = 'paid',
}

export enum InvoiceType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  OTHER = 'other',
}

export interface Invoice {
  _id: string;
  companyId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  invoiceNumber: string;
  referenceMonth: string;
  amount: number;
  description: string;
  type: InvoiceType;
  status: InvoiceStatus;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  notes?: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  paymentDate?: string;
  reminderSentAt?: string;
  reminderCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  type?: InvoiceType;
  startDate?: string;
  endDate?: string;
  search?: string;
  collaborator?: string;
}

export interface MonthlySummary {
  period: {
    year: number;
    month: number;
  };
  totalInvoices: number;
  totalAmount: number;
  statusCounts: {
    pending: number;
    submitted: number;
    approved: number;
    rejected: number;
    paid: number;
  };
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
  }>;
}
