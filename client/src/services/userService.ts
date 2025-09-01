import { User, UserRole } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper para fazer requisições autenticadas
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('access_token');
  
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
      if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        throw new Error('Não autorizado');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Interfaces para as operações
export interface CreateUserData {
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  position?: string;
  department?: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  position?: string;
  department?: string;
  avatar?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  department?: string;
  status?: 'active' | 'inactive';
  hasSubmittedInvoice?: boolean;
  referenceMonth?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<UserRole, number>;
  byDepartment: Record<string, number>;
  invoiceSubmissionRate: number;
}

// Service principal de usuários
export const userService = {
  // Buscar todos os usuários com paginação e filtros
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters: UserFilters = {}
  ): Promise<UserListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.hasSubmittedInvoice !== undefined) params.append('hasSubmittedInvoice', filters.hasSubmittedInvoice.toString());
    if (filters.referenceMonth) params.append('referenceMonth', filters.referenceMonth);

    return request<UserListResponse>(`/users?${params}`);
  },

  // Buscar usuário por ID
  async getUserById(userId: string): Promise<User> {
    return request<User>(`/users/${userId}`);
  },

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User> {
    return request<User>(`/users/email/${email}`);
  },

  // Criar novo usuário
  async createUser(userData: CreateUserData): Promise<User> {
    return request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Atualizar usuário
  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    return request<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  // Deletar usuário
  async deleteUser(userId: string): Promise<void> {
    return request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Buscar usuários da empresa
  async getCompanyUsers(
    companyId: string,
    page: number = 1,
    limit: number = 20,
    filters: UserFilters = {}
  ): Promise<UserListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('companyId', companyId);
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.hasSubmittedInvoice !== undefined) params.append('hasSubmittedInvoice', filters.hasSubmittedInvoice.toString());
    if (filters.referenceMonth) params.append('referenceMonth', filters.referenceMonth);

    return request<UserListResponse>(`/users/company?${params}`);
  },

  // Buscar usuários por departamento
  async getUsersByDepartment(
    companyId: string,
    department: string,
    page: number = 1,
    limit: number = 20
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      companyId,
      department,
    });

    return request<UserListResponse>(`/users/department?${params}`);
  },

  // Buscar usuários por papel/role
  async getUsersByRole(
    companyId: string,
    role: UserRole,
    page: number = 1,
    limit: number = 20
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      companyId,
      role,
    });

    return request<UserListResponse>(`/users/role?${params}`);
  },

  // Buscar usuários com status de nota fiscal por mês
  async getUsersWithInvoiceStatus(
    companyId: string,
    referenceMonth: string,
    page: number = 1,
    limit: number = 20
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      companyId,
      referenceMonth,
    });

    return request<UserListResponse>(`/users/invoice-status?${params}`);
  },

  // Buscar usuários atrasados com notas fiscais
  async getUsersWithOverdueInvoices(
    companyId: string,
    referenceMonth: string,
    page: number = 1,
    limit: number = 20
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      companyId,
      referenceMonth,
    });

    return request<UserListResponse>(`/users/overdue-invoices?${params}`);
  },

  // Buscar usuários que não enviaram notas fiscais
  async getUsersWithoutInvoices(
    companyId: string,
    referenceMonth: string,
    page: number = 1,
    limit: number = 20
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      companyId,
      referenceMonth,
    });

    return request<UserListResponse>(`/users/without-invoices?${params}`);
  },

  // Buscar estatísticas dos usuários
  async getUserStats(companyId: string): Promise<UserStats> {
    return request<UserStats>(`/users/stats?companyId=${companyId}`);
  },

  // Buscar estatísticas por mês de referência
  async getUserStatsByMonth(
    companyId: string,
    referenceMonth: string
  ): Promise<UserStats> {
    const params = new URLSearchParams({
      companyId,
      referenceMonth,
    });

    return request<UserStats>(`/users/stats/month?${params}`);
  },

  // Buscar usuários para dashboard do gestor
  async getManagerDashboardUsers(
    companyId: string,
    referenceMonth: string,
    filters: UserFilters = {}
  ): Promise<UserListResponse> {
    const params = new URLSearchParams();
    params.append('companyId', companyId);
    params.append('referenceMonth', referenceMonth);
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.hasSubmittedInvoice !== undefined) params.append('hasSubmittedInvoice', filters.hasSubmittedInvoice.toString());

    return request<UserListResponse>(`/users/dashboard?${params}`);
  },

  // Buscar usuários para dashboard do colaborador
  async getCollaboratorDashboardUsers(
    companyId: string,
    userId: string,
    referenceMonth: string
  ): Promise<UserListResponse> {
    const params = new URLSearchParams({
      companyId,
      userId,
      referenceMonth,
    });

    return request<UserListResponse>(`/users/collaborator-dashboard?${params}`);
  },

  // Ativar/desativar usuário
  async toggleUserStatus(userId: string, active: boolean): Promise<User> {
    return request<User>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  },

  // Alterar papel/role do usuário
  async changeUserRole(userId: string, newRole: UserRole): Promise<User> {
    return request<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });
  },

  // Buscar usuários para autocomplete
  async searchUsers(query: string, companyId: string): Promise<User[]> {
    const params = new URLSearchParams({
      q: query,
      companyId,
      limit: '10',
    });

    return request<User[]>(`/users/search?${params}`);
  },

  // Enviar lembretes para usuários
  async sendReminders(
    companyId: string,
    userIds: string[],
    message?: string
  ): Promise<{ success: boolean; sentCount: number }> {
    return request<{ success: boolean; sentCount: number }>('/users/reminders', {
      method: 'POST',
      body: JSON.stringify({
        companyId,
        userIds,
        message,
      }),
    });
  },

  // Exportar lista de usuários
  async exportUsers(
    companyId: string,
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters: UserFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('companyId', companyId);
    params.append('format', format);
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.hasSubmittedInvoice !== undefined) params.append('hasSubmittedInvoice', filters.hasSubmittedInvoice.toString());
    if (filters.referenceMonth) params.append('referenceMonth', filters.referenceMonth);

    const response = await fetch(`${API_BASE_URL}/users/export?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao exportar usuários');
    }

    return response.blob();
  },

  // Importar usuários em lote
  async importUsers(
    companyId: string,
    file: File
  ): Promise<{ success: boolean; importedCount: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);

    const response = await fetch(`${API_BASE_URL}/users/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao importar usuários');
    }

    return response.json();
  },

  // Verificar se email já existe
  async checkEmailExists(email: string, companyId: string): Promise<boolean> {
    try {
      await this.getUserByEmail(email);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Buscar usuários para equipes
  async getUsersForTeams(
    companyId: string,
    excludeUserIds: string[] = []
  ): Promise<User[]> {
    const params = new URLSearchParams({
      companyId,
      excludeUserIds: excludeUserIds.join(','),
    });

    return request<User[]>(`/users/teams?${params}`);
  },

  // Buscar usuários com permissões específicas
  async getUsersWithPermissions(
    companyId: string,
    permissions: string[]
  ): Promise<User[]> {
    const params = new URLSearchParams({
      companyId,
      permissions: permissions.join(','),
    });

    return request<User[]>(`/users/permissions?${params}`);
  },
};

// Hooks personalizados para facilitar o uso
export const useUserService = () => {
  return userService;
};

// Funções utilitárias
export const userUtils = {
  // Formatar nome do usuário
  formatUserName: (user: User): string => {
    return user.name || 'Usuário sem nome';
  },

  // Obter inicial do usuário
  getUserInitial: (user: User): string => {
    return user.name ? user.name.charAt(0).toUpperCase() : 'U';
  },

  // Verificar se usuário é gestor
  isManager: (user: User): boolean => {
    return user.role === UserRole.MANAGER;
  },

  // Verificar se usuário é colaborador
  isCollaborator: (user: User): boolean => {
    return user.role === UserRole.COLLABORATOR;
  },

  // Obter cor baseada no departamento
  getDepartmentColor: (department: string): string => {
    const colors = {
      'TI': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Vendas': 'bg-purple-100 text-purple-800',
      'RH': 'bg-yellow-100 text-yellow-800',
      'Financeiro': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800',
    };

    return colors[department as keyof typeof colors] || colors.default;
  },

  // Filtrar usuários por critérios
  filterUsers: (users: User[], filters: UserFilters): User[] => {
    return users.filter(user => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!user.name.toLowerCase().includes(searchLower) &&
            !user.email.toLowerCase().includes(searchLower) &&
            !user.department?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.role && user.role !== filters.role) {
        return false;
      }

      if (filters.department && user.department !== filters.department) {
        return false;
      }

      return true;
    });
  },
};
