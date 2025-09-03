import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useAuth } from './useAuth'
import { companyService } from '../services/companyService'
import { type CompanyFormData, formatCompanyDataForSubmission } from '../schemas/companySchemas'
import { UserRole } from '../types/user'

export const useOnboarding = () => {
  const { user, setUser } = useUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [isOnboardingRequired, setIsOnboardingRequired] = useState<boolean>(false)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Verificar se o onboarding é necessário
  const checkOnboardingRequired = useCallback(() => {
    if (!user) {
      setIsOnboardingRequired(false)
      setIsLoading(false)
      return
    }

    // Se o usuário é MANAGER e não tem companyId, precisa fazer onboarding
    console.log('user', user)
    const needsOnboarding = user.role === UserRole.MANAGER && !user.companyId
    
    setIsOnboardingRequired(needsOnboarding)
    setIsLoading(false)
  }, [user])

  // Criar empresa e completar onboarding
  const completeOnboarding = useCallback(async (companyData: CompanyFormData) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    setIsLoading(true)

    try {
      // Formatar dados para envio
      const formattedData = formatCompanyDataForSubmission(companyData)
      
      // Criar a empresa
      const response = await companyService.createCompany(formattedData)
      console.log(response)
      
      // Atualizar o usuário com o companyId
      const updatedUser = {
        ...user,
        companyId: response.data._id
      }
      
      setUser(updatedUser)
      setIsOnboardingComplete(true)
      setIsOnboardingRequired(false)
      
      // Redirecionar para o dashboard
      navigate('/')
      
      return response
    } catch (error) {
      console.error('Erro ao completar onboarding:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user, setUser, navigate])

  // Verificar se deve redirecionar para onboarding
  const shouldRedirectToOnboarding = useCallback(() => {
    if (isLoading) return false
    
    if (isOnboardingRequired && !isOnboardingComplete) {
      navigate('/onboarding')
      return true
    }
    
    return false
  }, [isOnboardingRequired, isOnboardingComplete, isLoading, navigate])

  // Verificar se está na página de onboarding
  const isOnboardingPage = useCallback(() => {
    return window.location.pathname === '/onboarding'
  }, [])

  // Sair do onboarding (logout)
  const exitOnboarding = useCallback(async () => {
    await logout()
  }, [logout])

  // Efeito para verificar onboarding ao carregar
  useEffect(() => {
    checkOnboardingRequired()
  }, [checkOnboardingRequired])

  // Efeito para redirecionar se necessário
  useEffect(() => {
    if (!isLoading && isOnboardingRequired && !isOnboardingPage()) {
      navigate('/onboarding')
    }
  }, [isLoading, isOnboardingRequired, isOnboardingPage, navigate])

  return {
    // Estados
    isOnboardingRequired,
    isOnboardingComplete,
    isLoading,
    
    // Ações
    completeOnboarding,
    exitOnboarding,
    shouldRedirectToOnboarding,
    isOnboardingPage,
    
    // Verificações
    checkOnboardingRequired
  }
}
