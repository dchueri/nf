import { User, UserRole, UserStatus } from '../types/user'
import { request } from '../utils/http'

// Interfaces para as operações de autenticação
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  companyId?: string
  position?: string
  department?: string
}

export interface AuthResponse {
  user: {
    sub: string
    email: string
    name: string
    role: UserRole
    companyId?: string
    status: string
    phone?: string
  }
  access_token: string
}

export interface RefreshTokenResponse {
  data: {
    access_token: string
  }
}

export interface UserProfile {
  sub: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  phone?: string
  status: string
}

// Service principal de autenticação
export const authService = {
  // Login do usuário
  async login(
    credentials: LoginCredentials
  ): Promise<{ data: AuthResponse; message: string }> {
    const response = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      data: {
        email: credentials.email,
        password: credentials.password
      }
    })

    // Armazenar token baseado na opção "remember me"
    if (credentials.rememberMe) {
      localStorage.setItem('access_token', response.data.access_token)
    } else {
      sessionStorage.setItem('access_token', response.data.access_token)
    }

    return response
  },

  // Registro de novo usuário
  async register(
    userData: RegisterData
  ): Promise<{ data: AuthResponse; message: string }> {
    const response = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      data: userData
    })

    // Armazenar token após registro bem-sucedido
    localStorage.setItem('access_token', response.data.access_token)

    return response
  },

  // Renovar token JWT
  async refreshToken(): Promise<{
    data: RefreshTokenResponse
    message: string
  }> {
    const response = await request<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST'
    })

    // Atualizar token armazenado
    const currentToken =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    if (currentToken) {
      if (localStorage.getItem('access_token')) {
        localStorage.setItem('access_token', response.data.data.access_token)
      } else {
        sessionStorage.setItem('access_token', response.data.data.access_token)
      }
    }

    return response
  },

  // Obter perfil do usuário autenticado
  async getProfile(): Promise<{ data: UserProfile; message: string }> {
    return request<UserProfile>('/auth/profile', {
      method: 'GET'
    })
  },

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      // TODO: Implementar logout no backend se necessário
      // await request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      // Limpar tokens locais
      localStorage.removeItem('access_token')
      sessionStorage.removeItem('access_token')
    }
  },

  // Verificar se o usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        return false
      }

      // Tentar obter o perfil para verificar se o token é válido
      await this.getProfile()
      return true
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      return false
    }
  },

  // Obter token atual
  getCurrentToken(): string | null {
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    )
  },

  // Verificar se o token está expirado
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error)
      return true
    }
  },

  // Renovar token se estiver expirado
  async refreshTokenIfNeeded(): Promise<string | null> {
    const token = this.getCurrentToken()
    if (!token) {
      return null
    }

    if (this.isTokenExpired(token)) {
      try {
        const response = await this.refreshToken()
        return response.data.data.access_token
      } catch (error) {
        console.error('Erro ao renovar token:', error)
        await this.logout()
        return null
      }
    }

    return token
  },

  // Validar credenciais sem fazer login
  async validateCredentials(email: string, password: string): Promise<boolean> {
    try {
      await request('/auth/login', {
        method: 'POST',
        data: { email, password }
      })
      return true
    } catch (error) {
      return false
    }
  },

  // Esqueci minha senha
  async forgotPassword(
    email: string
  ): Promise<{ data: { success: boolean; message: string }; message: string }> {
    return request<{ success: boolean; message: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        data: { email }
      }
    )
  },

  // Redefinir senha
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ data: { success: boolean; message: string }; message: string }> {
    return request<{ success: boolean; message: string }>(
      '/auth/reset-password',
      {
        method: 'POST',
        data: { token, newPassword }
      }
    )
  },

  // Verificar se email está disponível
  async checkEmailAvailability(
    email: string
  ): Promise<{ data: boolean; message: string }> {
    try {
      await request(`/auth/check-email/${email}`, {
        method: 'GET'
      })
      return { data: true, message: 'Email disponível' } // Email disponível
    } catch (error) {
      return { data: false, message: 'Email já existe' } // Email já existe
    }
  }
}

// Hooks personalizados para facilitar o uso
export const useAuthService = () => {
  return authService
}

// Funções utilitárias
export const authUtils = {
  // Formatar dados do usuário para o contexto
  formatUserForContext: (authUser: AuthResponse['user']): User => {
    return {
      _id: authUser.sub,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      phone: authUser.phone,
      status: authUser.status as UserStatus,
      companyId: authUser.companyId || '',
      monthsWithInvoices: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Verificar se o usuário tem permissão específica
  hasPermission: (user: User, permission: string): boolean => {
    // TODO: Implementar lógica de permissões baseada no role
    return user.role === UserRole.MANAGER
  },

  // Verificar se o usuário pode acessar recurso específico
  canAccess: (user: User, resource: string): boolean => {
    const permissions = {
      dashboard: [UserRole.MANAGER, UserRole.COLLABORATOR],
      users: [UserRole.MANAGER],
      reports: [UserRole.MANAGER],
      settings: [UserRole.MANAGER],
      invoices: [UserRole.MANAGER, UserRole.COLLABORATOR]
    }

    const allowedRoles = permissions[resource as keyof typeof permissions] || []
    return allowedRoles.includes(user.role)
  },

  // Obter token de autenticação para requisições
  getAuthHeaders: (): Record<string, string> => {
    const token = authService.getCurrentToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  // Limpar dados de autenticação
  clearAuthData: (): void => {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
  },

  // Verificar se deve usar localStorage ou sessionStorage
  shouldUseLocalStorage: (): boolean => {
    return localStorage.getItem('access_token') !== null
  }
}
