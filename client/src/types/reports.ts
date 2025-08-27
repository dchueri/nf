export interface ReportFilters {
  startDate: string;
  endDate: string;
  companyId?: string;
  userId?: string;
  status?: string[];
  type?: string[];
  tags?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface FinancialSummary {
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  averageInvoiceAmount: number;
  paymentRate: number;
  overdueRate: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  invoices: {
    total: number;
    submitted: number;
    approved: number;
    rejected: number;
    paid: number;
    overdue: number;
  };
  amounts: {
    total: number;
    submitted: number;
    approved: number;
    rejected: number;
    paid: number;
    overdue: number;
  };
  trends: {
    invoiceGrowth: number;
    amountGrowth: number;
    paymentEfficiency: number;
  };
}

export interface UserPerformanceReport {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  metrics: {
    invoicesSubmitted: number;
    invoicesApproved: number;
    invoicesRejected: number;
    totalAmount: number;
    averageProcessingTime: number;
    approvalRate: number;
  };
  monthlyData: Array<{
    month: string;
    invoices: number;
    amount: number;
    approvalRate: number;
  }>;
}

export interface CompanyAnalytics {
  companyId: string;
  companyName: string;
  period: {
    start: string;
    end: string;
  };
  overview: FinancialSummary;
  monthlyTrends: MonthlyReport[];
  topCollaborators: UserPerformanceReport[];
  statusDistribution: {
    pending: number;
    submitted: number;
    approved: number;
    rejected: number;
    paid: number;
  };
  typeDistribution: {
    invoice: number;
    receipt: number;
    other: number;
  };
  overdueAnalysis: {
    count: number;
    amount: number;
    averageDaysOverdue: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeCharts: boolean;
  includeDetails: boolean;
  dateRange: string;
  filters: ReportFilters;
}

export interface ReportSchedule {
  id: string;
  name: string;
  type: 'financial' | 'performance' | 'compliance' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  filters: ReportFilters;
  lastGenerated?: string;
  nextGeneration?: string;
  status: 'active' | 'paused' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }>;
}

export interface KPI {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  period: string;
  icon?: string;
}
