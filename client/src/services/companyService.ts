import { request, Response } from '../utils/http'

// Interfaces para as operações de empresa
export interface CreateCompanyData {
  name: string
  cnpj: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website?: string
}

export interface Company {
  _id: string
  name: string
  cnpj: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website?: string
  ownerId: string
  collaborators: string[]
  settings: {
    reminderSchedule: {
      firstReminder: number
      secondReminder: number
      finalReminder: number
      escalationReminder: number
    }
    invoiceDeadline: number
    autoReminders: boolean
    emailNotifications: boolean
    whatsappNotifications: boolean
  }
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
}

export interface CompanyResponse {
  data: Company
  message: string
}

// Service principal de empresas
export const companyService = {
  // Criar nova empresa
  async createCompany(
    companyData: CreateCompanyData
  ): Promise<CompanyResponse> {
    const response = await request<CompanyResponse>('/companies', {
      method: 'POST',
      data: companyData
    })
    return response.data
  },

  // Buscar empresa por ID
  async getCompanyById(companyId: string): Promise<Company> {
    const response = await request<Company>(`/companies/${companyId}`, {
      method: 'GET'
    })
    return response.data
  },

  // Buscar empresa do usuário logado
  async getMyCompany(): Promise<Company> {
    const response = await request<Company>('/companies/my-company', {
      method: 'GET'
    })
    return response.data
  },

  // Atualizar empresa
  async updateCompany(
    companyId: string,
    updateData: Partial<CreateCompanyData>
  ): Promise<Company> {
    const response = await request<Company>(`/companies/${companyId}`, {
      method: 'PATCH',
      data: updateData
    })
    return response.data
  },

  // Verificar se CNPJ já existe
  async checkCNPJExists(cnpj: string): Promise<boolean> {
    try {
      await request(`/companies/check-cnpj/${cnpj}`, {
        method: 'GET'
      })
      return true // CNPJ existe
    } catch (error) {
      return false // CNPJ não existe
    }
  },

  // Validar CNPJ
  async validateCNPJ(
    cnpj: string
  ): Promise<Response<{ isValid: boolean; message?: string }>> {
    try {
      const response = await request<{ isValid: boolean; message?: string }>(
        '/companies/validate-cnpj',
        {
          method: 'POST',
          data: { cnpj }
        }
      )
      return response
    } catch (error) {
      return {
        data: { isValid: false, message: 'Erro ao validar CNPJ' },
        message: 'Erro ao validar CNPJ'
      }
    }
  },

  // Buscar empresas (para admin)
  async getCompanies(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Response<{
    docs: Company[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)

    return request(`/companies?${params}`, {
      method: 'GET'
    })
  },

  // Ativar/desativar empresa
  async toggleCompanyStatus(
    companyId: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<Response<Company>> {
    return request<Company>(`/companies/${companyId}/status`, {
      method: 'PATCH',
      data: { status }
    })
  },

  // Obter estatísticas da empresa
  async getCompanyStats(companyId: string): Promise<
    Response<{
      totalUsers: number
      totalInvoices: number
      pendingInvoices: number
      approvedInvoices: number
      totalAmount: number
    }>
  > {
    return request(`/companies/${companyId}/stats`, {
      method: 'GET'
    })
  }
}

// Hooks personalizados para facilitar o uso
export const useCompanyService = () => {
  return companyService
}

// Funções utilitárias
export const companyUtils = {
  // Formatar CNPJ para exibição
  formatCNPJ: (cnpj: string): string => {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    )
  },

  // Limpar CNPJ (remover formatação)
  cleanCNPJ: (cnpj: string): string => {
    return cnpj.replace(/\D/g, '')
  },

  // Validar formato de CNPJ
  isValidCNPJFormat: (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.length === 14
  },

  // Formatar telefone
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }
    return phone
  },

  // Limpar telefone
  cleanPhone: (phone: string): string => {
    return phone.replace(/\D/g, '')
  },

  // Formatar CEP
  formatCEP: (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '')
    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  },

  // Limpar CEP
  cleanCEP: (cep: string): string => {
    return cep.replace(/\D/g, '')
  },

  // Obter estados brasileiros
  getBrazilianStates: (): Array<{ value: string; label: string }> => {
    return [
      { value: 'AC', label: 'Acre' },
      { value: 'AL', label: 'Alagoas' },
      { value: 'AP', label: 'Amapá' },
      { value: 'AM', label: 'Amazonas' },
      { value: 'BA', label: 'Bahia' },
      { value: 'CE', label: 'Ceará' },
      { value: 'DF', label: 'Distrito Federal' },
      { value: 'ES', label: 'Espírito Santo' },
      { value: 'GO', label: 'Goiás' },
      { value: 'MA', label: 'Maranhão' },
      { value: 'MT', label: 'Mato Grosso' },
      { value: 'MS', label: 'Mato Grosso do Sul' },
      { value: 'MG', label: 'Minas Gerais' },
      { value: 'PA', label: 'Pará' },
      { value: 'PB', label: 'Paraíba' },
      { value: 'PR', label: 'Paraná' },
      { value: 'PE', label: 'Pernambuco' },
      { value: 'PI', label: 'Piauí' },
      { value: 'RJ', label: 'Rio de Janeiro' },
      { value: 'RN', label: 'Rio Grande do Norte' },
      { value: 'RS', label: 'Rio Grande do Sul' },
      { value: 'RO', label: 'Rondônia' },
      { value: 'RR', label: 'Roraima' },
      { value: 'SC', label: 'Santa Catarina' },
      { value: 'SP', label: 'São Paulo' },
      { value: 'SE', label: 'Sergipe' },
      { value: 'TO', label: 'Tocantins' }
    ]
  }
}
