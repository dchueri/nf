import { Invoice, InvoiceFilters, MonthlySummary } from '../types/invoice'
import { PaginatedResponse, request } from '../utils/http'
import axios from 'axios'

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

  async updateInvoiceStatus(id: string, status: string, reason?: string): Promise<Invoice> {
    const response = await request<Invoice>(`/invoices/${id}/status`, {
      method: 'PATCH',
      data: { status, rejectionReason: reason }
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
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    
    const response = await axios.get(`${API_BASE_URL}/invoices/${id}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
    
    return response.data
  },

  async compileInvoicesByMonth(referenceMonth: string): Promise<void> {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    
    const response = await axios.post(
      `${API_BASE_URL}/invoices/compile`,
      { referenceMonth },
      {
        responseType: 'blob',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
    
    // Criar blob e fazer download automático
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    
    // Extrair nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers['content-disposition']
    let fileName = `notas-fiscais-${referenceMonth}.zip`
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
      if (fileNameMatch) {
        fileName = fileNameMatch[1]
      }
    }
    
    // Criar link temporário para download
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Limpar URL
    window.URL.revokeObjectURL(url)
  }
}

export const useInvoiceService = () => {
  return invoiceService
}
