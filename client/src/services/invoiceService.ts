import { Invoice, InvoiceFilters, MonthlySummary } from '../types/invoice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class InvoiceService {
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

  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.collaborator) queryParams.append('collaborator', filters.collaborator);

    const queryString = queryParams.toString();
    const endpoint = `/invoices${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Invoice[]>(endpoint);
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.request<void>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    return this.request<MonthlySummary>(`/invoices/summary/${year}/${month}`);
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    return this.request<Invoice[]>('/invoices/overdue');
  }

  async uploadInvoiceFile(
    file: File,
    uploadData: Partial<Invoice>
  ): Promise<Invoice> {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    
    formData.append('file', file);
    
    // Adicionar dados do formulário
    Object.entries(uploadData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/invoices/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async downloadInvoiceFile(id: string): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/invoices/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
}

export const invoiceService = new InvoiceService();
