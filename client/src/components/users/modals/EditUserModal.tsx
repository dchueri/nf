import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { FeedbackMessage } from '../../ui/FeedbackMessage'
import { UserAvatar } from '../UserAvatar'
import { User, UserRole, UserStatus } from '../../../types/user'
import {
  validateEditUserSafe,
  formatEditUserDataForSubmission,
  type EditUserData
} from '../../../schemas/userSchemas'

interface EditUserModalProps {
  isOpen: boolean
  setSelectedUser: (user: User | null) => void
  user: User | null
}

interface FormErrors {
  name?: string
  role?: string
  department?: string
  status?: string
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  setSelectedUser,
  user,
}) => {
  const [formData, setFormData] = useState<EditUserData>({
    name: '',
    role: UserRole.COLLABORATOR,
    department: '',
    status: UserStatus.ACTIVE
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar formulário quando usuário for carregado
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
        department: user.department || '',
        status: user.status as any
      })
      setErrors({})
      setError(null)
    }
  }, [user])

  const validateForm = useCallback((): boolean => {
    const validation = validateEditUserSafe(formData)
    if (validation.success) {
      setErrors({})
      return true
    } else {
      setErrors(validation.errors)
      return false
    }
  }, [formData])

  const handleInputChange = useCallback((field: keyof EditUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formattedData = formatEditUserDataForSubmission(formData)
      
      if (process.env.NODE_ENV === 'development') {
        // Simular chamada da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Updating user:', { userId: user._id, data: formattedData })
        
        // Simular resposta atualizada
        const updatedUser: User = {
          ...user,
          ...formattedData
        }
        
        setSelectedUser(null)
      } else {
        // TODO: Implementar chamada real da API
        // const response = await userService.updateUser(user._id, formattedData)
        // onUserUpdated(response.data)
        // onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário')
      console.error('Error updating user:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, user, validateForm, setSelectedUser])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setSelectedUser(null)
    }
  }, [isSubmitting, setSelectedUser])

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case UserStatus.INACTIVE:
        return <XCircleIcon className="h-5 w-5 text-gray-500" />
      case UserStatus.SUSPENDED:
        return <ClockIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusDescription = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'Usuário ativo e com acesso ao sistema'
      case UserStatus.INACTIVE:
        return 'Usuário inativo, sem acesso ao sistema'
      case UserStatus.SUSPENDED:
        return 'Usuário suspenso temporariamente'
      default:
        return ''
    }
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Usuário"
      subtitle="Atualize as informações do usuário"
      size="md"
      icon={<UserIcon className="h-6 w-6 text-blue-600" />}
      disabled={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <FeedbackMessage
            type="error"
            title="Erro ao atualizar usuário"
            message={error}
          />
        )}

        {/* User Avatar Section */}
        <div className="flex items-center justify-center py-2">
          <UserAvatar user={user} size="md" showName />
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full pl-10 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome completo"
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Função *
          </label>
          <div className="relative">
            <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={`w-full pl-10 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.role ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value={UserRole.COLLABORATOR}>Colaborador</option>
              <option value={UserRole.MANAGER}>Gestor</option>
            </select>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Department Field */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Departamento
          </label>
          <div className="relative">
            <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="department"
              value={formData.department || ''}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={`w-full pl-10 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.department ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: TI, Marketing, Vendas"
              disabled={isSubmitting}
            />
          </div>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getStatusIcon(formData.status)}
            </div>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={`w-full pl-10 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.status ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value={UserStatus.ACTIVE}>Ativo</option>
              <option value={UserStatus.INACTIVE}>Inativo</option>
              <option value={UserStatus.SUSPENDED}>Suspenso</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {getStatusDescription(formData.status)}
          </p>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
