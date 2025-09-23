import { Invoice, InvoiceFilters, MonthlySummary } from '../types/invoice'
import { PaginatedResponse, request } from '../utils/http'

export const invoiceService = {
  async getInvoices(
    filters?: InvoiceFilters
  ): Promise<PaginatedResponse<Invoice>> {
    const queryParams = new URLSearchParams()

    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.startDate) queryParams.append('startDate', filters.startDate)
    if (filters?.endDate) queryParams.append('endDate', filters.endDate)
    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.collaborator)
      queryParams.append('collaborator', filters.collaborator)

    const queryString = queryParams.toString()
    const endpoint = `/invoices${queryString ? `?${queryString}` : ''}`

    const response = await request<PaginatedResponse<Invoice>>(endpoint)
    return response.data
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await request<Invoice>(`/invoices/${id}`)
    return response.data
  },

  async uploadInvoice(
    file: File,
    uploadData: Partial<Invoice>
  ): Promise<Invoice> {
    const formData = new FormData()

    formData.append('file', file)

    Object.entries(uploadData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await request<Invoice>('/invoices/upload', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  async updateInvoice(
    id: string,
    invoiceData: Partial<Invoice>
  ): Promise<Invoice> {
    const response = await request<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      data: invoiceData
    })
    return response.data
  },

  async deleteInvoice(id: string): Promise<void> {
    await request<void>(`/invoices/${id}`, {
      method: 'DELETE'
    })
  },

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
    const response = await request<Invoice>(`/invoices/${id}/status`, {
      method: 'PATCH',
      data: { status }
    })
    return response.data
  },

  async createIgnoredInvoice(invoiceData: {
    userId: string
    referenceMonth: string
  }): Promise<Invoice> {
    const response = await request<Invoice>(`/invoices/ignored`, {
      method: 'POST',
      data: invoiceData
    })
    return response.data
  },

  async getMonthlySummary(
    year: number,
    month: number
  ): Promise<MonthlySummary> {
    const response = await request<MonthlySummary>(
      `/invoices/summary/${year}/${month}`
    )
    return response.data
  },

  async getOverdueInvoices(): Promise<Invoice[]> {
    const response = await request<Invoice[]>('/invoices/overdue')
    return response.data
  },

  async downloadInvoiceFile(id: string): Promise<Blob> {
    const response = await request<Blob>(`/invoices/${id}/download`, {
      method: 'GET',
      responseType: 'blob'
    })
    return response.data
  }
}

export const useInvoiceService = () => {
  return invoiceService
}
