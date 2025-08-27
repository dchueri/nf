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

const API_BASE_URL = 'http://localhost:3001';

// Helper function for making authenticated requests
const request = async (endpoint: string, options: RequestInit = {}) => {
  // TODO: Get token from auth context
  const token = localStorage.getItem('authToken'); // Temporary solution
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Financial Reports
export const getFinancialSummary = async (filters?: any) => {
  const params = filters ? `?${new URLSearchParams(filters)}` : '';
  return request(`/reports/financial/summary${params}`);
};

export const getMonthlyReport = async (month: number, year: number) => {
  return request(`/reports/monthly?month=${month}&year=${year}`);
};

export const getYearlyReport = async (year: number) => {
  return request(`/reports/yearly?year=${year}`);
};

export const getUserPerformanceReport = async (userId: string, period: string) => {
  return request(`/reports/users/${userId}/performance?period=${period}`);
};

export const getCompanyAnalytics = async (period: string) => {
  return request(`/reports/analytics/company?period=${period}`);
};

export const getChartData = async (chartType: string, filters?: any) => {
  const params = filters ? `?${new URLSearchParams({ type: chartType, ...filters })}` : `?type=${chartType}`;
  return request(`/reports/charts${params}`);
};

export const getKPIs = async (period: string) => {
  return request(`/reports/kpis?period=${period}`);
};

// Export Reports
export const exportReport = async (reportType: string, format: string, filters?: any) => {
  return request(`/reports/export`, {
    method: 'POST',
    body: JSON.stringify({ reportType, format, filters }),
  });
};

export const downloadReport = async (reportId: string) => {
  return request(`/reports/${reportId}/download`);
};

// Report Scheduling
export const getReportSchedules = async () => {
  return request('/reports/schedules');
};

export const createReportSchedule = async (schedule: any) => {
  return request('/reports/schedules', {
    method: 'POST',
    body: JSON.stringify(schedule),
  });
};

export const updateReportSchedule = async (scheduleId: string, updates: any) => {
  return request(`/reports/schedules/${scheduleId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteReportSchedule = async (scheduleId: string) => {
  return request(`/reports/schedules/${scheduleId}`, {
    method: 'DELETE',
  });
};

// Preset Reports
export const getPresetReports = async () => {
  return request('/reports/presets');
};

export const generatePresetReport = async (presetId: string, filters?: any) => {
  return request(`/reports/presets/${presetId}/generate`, {
    method: 'POST',
    body: JSON.stringify({ filters }),
  });
};

// Advanced Analytics
export const getTrendAnalysis = async (metric: string, period: string) => {
  return request(`/reports/trends?metric=${metric}&period=${period}`);
};

export const getRiskAnalysis = async (period: string) => {
  return request(`/reports/risk?period=${period}`);
};

// Caching
export const getCachedReport = async (reportId: string) => {
  return request(`/reports/cache/${reportId}`);
};

export const clearReportCache = async () => {
  return request('/reports/cache/clear', {
    method: 'POST',
  });
};
