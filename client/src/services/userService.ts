import { User, UserRole } from '../types/user'
import { request } from '../utils/http'

// Interfaces para as operações

interface Response<T> {
  data: T
  message: string
}

export interface CreateUserData {
  name: string
  email: string
  role: UserRole
  companyId: string
  position?: string
  department?: string
  avatar?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: UserRole
  position?: string
  phone?: string
  department?: string
  avatar?: string
  password?: string
  newPassword?: string
  status?: 'active' | 'inactive' | 'suspended'
}


export interface UserFilters {
  search?: string
  role?: UserRole
  department?: string
  status?: 'active' | 'inactive'
  hasSubmittedInvoice?: boolean
  referenceMonth?: string
}

export interface UserListResponse {
  docs: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: Record<UserRole, number>
  byDepartment: Record<string, number>
  invoiceSubmissionRate: number
}

export interface UserStatsDashboard {
  total: number
  pending: number
  approved: number
}

// Service principal de usuários
export const userService = {
  async bulkUpdateStatus(
    userIds: string[],
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<Response<User>> {
    return request<User>(`/users/bulk/status`, {
      method: 'PATCH',
      data: { userIds, status }
    })
  },

  async updateUser(
    userId: string,
    data: UpdateUserData
  ): Promise<Response<User>> {
    return request<User>(`/users/${userId}`, {
      method: 'PATCH',
      data
    })
  },

  async cancelInvitation(userId: string): Promise<Response<User>> {
    return request<User>(`/users/invite/${userId}`, {
      method: 'DELETE'
    })
  },

  async inviteUser(email: string): Promise<Response<User>> {
    return request<User>(`/users/invite`, {
      method: 'POST',
      data: { email }
    })
  },

  async getUserStats(
    referenceMonth: string
  ): Promise<Response<UserStatsDashboard>> {
    return request<UserStatsDashboard>(`/users/stats/${referenceMonth}`)
  },

  // Buscar usuários para dashboard do gestor
  async getUsers(
    page: number,
    limit: number,
    status: string,
    role: string,
    search: string,
    selectedMonth: string,
    toDashboard: boolean
  ): Promise<Response<UserListResponse>> {
    return request<UserListResponse>(`/users`, {
      method: 'GET',
      params: {
        page,
        limit,
        status,
        role,
        search,
        toDashboard,
        selectedMonth
      }
    })
  },

  // Buscar usuários para dashboard do colaborador
  async getCollaboratorDashboardUsers(
    companyId: string,
    userId: string,
    referenceMonth: string
  ): Promise<Response<UserListResponse>> {
    const params = new URLSearchParams({
      companyId,
      userId,
      referenceMonth
    })

    return request<UserListResponse>(`/users/collaborator-dashboard?${params}`)
  },

  // Ativar/desativar usuário
  async toggleUserStatus(
    userId: string,
    active: boolean
  ): Promise<Response<User>> {
    return request<User>(`/users/${userId}/status`, {
      method: 'PATCH',
      data: { active }
    })
  },

  // Alterar papel/role do usuário
  async changeUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<Response<User>> {
    return request<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      data: { role: newRole }
    })
  },

  // Buscar usuários para autocomplete
  async searchUsers(
    query: string,
    companyId: string
  ): Promise<Response<User[]>> {
    const params = new URLSearchParams({
      q: query,
      companyId,
      limit: '10'
    })

    return request<User[]>(`/users/search?${params}`)
  },

  // Enviar lembretes para usuários
  async sendReminders(
    companyId: string,
    userIds: string[],
    message?: string
  ): Promise<Response<{ success: boolean; sentCount: number }>> {
    return request<{ success: boolean; sentCount: number }>(
      '/users/reminders',
      {
        method: 'POST',
        data: {
          companyId,
          userIds,
          message
        }
      }
    )
  },

  // Exportar lista de usuários
  async exportUsers(
    companyId: string,
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters: UserFilters = {}
  ): Promise<Response<Blob>> {
    const params = new URLSearchParams()
    params.append('companyId', companyId)
    params.append('format', format)

    if (filters.search) params.append('search', filters.search)
    if (filters.role) params.append('role', filters.role)
    if (filters.department) params.append('department', filters.department)
    if (filters.status) params.append('status', filters.status)
    if (filters.hasSubmittedInvoice !== undefined)
      params.append(
        'hasSubmittedInvoice',
        filters.hasSubmittedInvoice.toString()
      )
    if (filters.referenceMonth)
      params.append('referenceMonth', filters.referenceMonth)

    const response = await request<Blob>(`/users/export?${params}`, {
      responseType: 'blob'
    })

    return response
  },

  // Importar usuários em lote
  async importUsers(
    companyId: string,
    file: File
  ): Promise<
    Response<{ success: boolean; importedCount: number; errors: string[] }>
  > {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('companyId', companyId)

    const response = await request<{
      success: boolean
      importedCount: number
      errors: string[]
    }>('/users/import', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response
  },

  // Verificar se email já existe
  // async checkEmailExists(email: string, companyId: string): Promise<boolean> {
  //   try {
  //     await this.getUserByEmail(email);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // },

  // Buscar usuários para equipes
  async getUsersForTeams(
    companyId: string,
    excludeUserIds: string[] = []
  ): Promise<Response<User[]>> {
    const params = new URLSearchParams({
      companyId,
      excludeUserIds: excludeUserIds.join(',')
    })

    return request<User[]>(`/users/teams?${params}`)
  },

  // Buscar usuários com permissões específicas
  async getUsersWithPermissions(
    companyId: string,
    permissions: string[]
  ): Promise<Response<User[]>> {
    const params = new URLSearchParams({
      companyId,
      permissions: permissions.join(',')
    })

    return request<User[]>(`/users/permissions?${params}`)
  }
}

// Hooks personalizados para facilitar o uso
export const useUserService = () => {
  return userService
}

// Funções utilitárias
export const userUtils = {
  // Formatar nome do usuário
  formatUserName: (user: User): string => {
    return user.name || 'Usuário sem nome'
  },

  // Obter inicial do usuário
  getUserInitial: (user: User): string => {
    return user.name ? user.name.charAt(0).toUpperCase() : 'U'
  },

  // Verificar se usuário é gestor
  isManager: (user: User): boolean => {
    return user.role === UserRole.MANAGER
  },

  // Verificar se usuário é colaborador
  isCollaborator: (user: User): boolean => {
    return user.role === UserRole.COLLABORATOR
  },

  // Obter cor baseada no departamento
  getDepartmentColor: (department: string): string => {
    const colors = {
      TI: 'bg-blue-100 text-blue-800',
      Marketing: 'bg-green-100 text-green-800',
      Vendas: 'bg-purple-100 text-purple-800',
      RH: 'bg-yellow-100 text-yellow-800',
      Financeiro: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }

    return colors[department as keyof typeof colors] || colors.default
  },

  // Filtrar usuários por critérios
  filterUsers: (users: User[], filters: UserFilters): User[] => {
    return users.filter((user) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !user.name.toLowerCase().includes(searchLower) &&
          !user.email.toLowerCase().includes(searchLower) &&
          !user.department?.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (filters.role && user.role !== filters.role) {
        return false
      }

      if (filters.department && user.department !== filters.department) {
        return false
      }

      return true
    })
  }
}
