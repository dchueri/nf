import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { User, UserRole } from '../types/user'
import { authService, authUtils, LoginCredentials } from '../services/authService'



export const useAuth = () => {
  const { setUser } = useUser()
  const navigate = useNavigate()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const login = useCallback(async (
    email: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<void> => {
    setIsAuthenticating(true)

    try {
      // Fazer login usando o AuthService
      console.log('email', email)
      const response = await authService.login({ email, password, rememberMe })
      
      // Converter dados do usuário para o formato do contexto
       console.log('response', response)
      const user = authUtils.formatUserForContext(response.data.user)
      console.log('user', user)
      // Update user context
      setUser(user)

      // Navigate to dashboard
      navigate('/')
    } catch (error) {
      // Handle authentication errors
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('Erro interno do servidor')
      }
    } finally {
      setIsAuthenticating(false)
    }
  }, [setUser, navigate])

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Fazer logout usando o AuthService
      await authService.logout()

      // Clear user context
      setUser(null)

      // Navigate to login
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state
      setUser(null)
      navigate('/login')
    }
  }, [setUser, navigate])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Verificar autenticação usando o AuthService
      return await authService.isAuthenticated()
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }, [])

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      // Renovar token usando o AuthService
      const response = await authService.refreshToken()
      return response.data.data.access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      return null
    }
  }, [])

  return {
    login,
    logout,
    checkAuth,
    refreshToken,
    isAuthenticating
  }
}
