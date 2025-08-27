import { 
  ReportFilters, 
  FinancialSummary, 
  MonthlyReport, 
  UserPerformanceReport,
  CompanyAnalytics,
  ExportOptions,
  ReportSchedule,
  ChartData,
  KPI
} from '../types/reports';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ReportsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Relatórios Financeiros
  async getFinancialSummary(filters: ReportFilters): Promise<FinancialSummary> {
    return this.request<FinancialSummary>('/reports/financial/summary', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getMonthlyReport(filters: ReportFilters): Promise<MonthlyReport[]> {
    return this.request<MonthlyReport[]>('/reports/financial/monthly', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getYearlyReport(year: number, companyId?: string): Promise<MonthlyReport[]> {
    const params = new URLSearchParams({ year: year.toString() });
    if (companyId) params.append('companyId', companyId);
    
    return this.request<MonthlyReport[]>(`/reports/financial/yearly?${params}`);
  }

  // Relatórios de Performance
  async getUserPerformanceReport(filters: ReportFilters): Promise<UserPerformanceReport[]> {
    return this.request<UserPerformanceReport[]>('/reports/performance/users', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getCompanyAnalytics(filters: ReportFilters): Promise<CompanyAnalytics> {
    return this.request<CompanyAnalytics>('/reports/analytics/company', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Dados para Gráficos
  async getChartData(chartType: string, filters: ReportFilters): Promise<ChartData> {
    return this.request<ChartData>(`/reports/charts/${chartType}`, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getKPIs(filters: ReportFilters): Promise<KPI[]> {
    return this.request<KPI[]>('/reports/kpis', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Exportação de Relatórios
  async exportReport(reportType: string, options: ExportOptions): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/reports/export/${reportType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/reports/download/${reportId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Agendamento de Relatórios
  async getReportSchedules(): Promise<ReportSchedule[]> {
    return this.request<ReportSchedule[]>('/reports/schedules');
  }

  async createReportSchedule(schedule: Partial<ReportSchedule>): Promise<ReportSchedule> {
    return this.request<ReportSchedule>('/reports/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  async updateReportSchedule(scheduleId: string, updates: Partial<ReportSchedule>): Promise<ReportSchedule> {
    return this.request<ReportSchedule>(`/reports/schedules/${scheduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteReportSchedule(scheduleId: string): Promise<void> {
    return this.request<void>(`/reports/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  // Relatórios Pré-configurados
  async getPresetReports(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    defaultFilters: ReportFilters;
  }>> {
    return this.request('/reports/presets');
  }

  async generatePresetReport(presetId: string, customFilters?: Partial<ReportFilters>): Promise<{
    reportId: string;
    downloadUrl: string;
    estimatedTime: number;
  }> {
    return this.request(`/reports/presets/${presetId}/generate`, {
      method: 'POST',
      body: JSON.stringify(customFilters || {}),
    });
  }

  // Análises Avançadas
  async getTrendAnalysis(filters: ReportFilters): Promise<{
    invoiceTrends: Array<{ date: string; count: number; amount: number }>;
    statusTrends: Array<{ date: string; status: string; count: number }>;
    userTrends: Array<{ date: string; userId: string; performance: number }>;
  }> {
    return this.request('/reports/analytics/trends', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getRiskAnalysis(filters: ReportFilters): Promise<{
    overdueRisk: 'low' | 'medium' | 'high';
    complianceScore: number;
    recommendations: string[];
    riskFactors: Array<{
      factor: string;
      impact: 'low' | 'medium' | 'high';
      description: string;
    }>;
  }> {
    return this.request('/reports/analytics/risk', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Cache e Performance
  async getCachedReport(reportId: string): Promise<any> {
    return this.request(`/reports/cache/${reportId}`);
  }

  async clearReportCache(): Promise<void> {
    return this.request('/reports/cache/clear', {
      method: 'DELETE',
    });
  }
}

export const reportsService = new ReportsService();
