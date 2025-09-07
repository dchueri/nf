import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { FeedbackMessage } from '../../ui/FeedbackMessage'
import { ConfirmDialog, useConfirmDialog } from '../../ui/ConfirmDialog'
import { UserAvatar } from '../UserAvatar'
import { User, UserRole, UserStatus } from '../../../types/user'
import {
  validateEditUserSafe,
  formatEditUserDataForSubmission,
  type EditUserData
} from '../../../schemas/userSchemas'
import { userService } from 'services/userService'

interface EditUserModalProps {
  isOpen: boolean
  setSelectedUser: (user: User | null) => void
  user: User | null
  onUpdateUser: () => void
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
  onUpdateUser
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  
  // Hook para confirmação de ações
  const confirmDialog = useConfirmDialog()

  // Função para converter UserStatus para string
  const convertStatusToString = (status: UserStatus): 'active' | 'inactive' | 'suspended' => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'active'
      case UserStatus.INACTIVE:
        return 'inactive'
      case UserStatus.SUSPENDED:
        return 'suspended'
      default:
        return 'inactive'
    }
  }

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

  const handleInputChange = useCallback(
    (field: keyof EditUserData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!user || !validateForm()) return

      setIsSubmitting(true)
      setError(null)

      try {
        const formattedData = formatEditUserDataForSubmission(formData)
        
        // Converter status para string se necessário
        const updateData = {
          ...formattedData,
          status: formattedData.status ? convertStatusToString(formattedData.status) : undefined
        }

        await userService.updateUser(user._id, updateData)
        setSelectedUser(null)
        onUpdateUser()
        handleClose()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao atualizar usuário'
        )
        console.error('Error updating user:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, user, validateForm, setSelectedUser]
  )

  const handleClose = useCallback(() => {
    if (!isSubmitting && !isUpdatingStatus) {
      setSelectedUser(null)
    }
  }, [isSubmitting, isUpdatingStatus, setSelectedUser])

  // Função para suspender usuário
  const handleSuspendUser = useCallback(() => {
    if (!user) return
    
    confirmDialog.confirm(
      'Suspender Usuário',
      `Tem certeza que deseja suspender ${user.name}? O usuário perderá acesso temporário ao sistema.`,
      async () => {
        setIsUpdatingStatus(true)
        setError(null)
        
        try {
          await userService.updateUser(user._id, { status: convertStatusToString(UserStatus.SUSPENDED) })
          setFormData(prev => ({ ...prev, status: UserStatus.SUSPENDED }))
          onUpdateUser()
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Erro ao suspender usuário'
          )
          console.error('Error suspending user:', err)
        } finally {
          setIsUpdatingStatus(false)
        }
      },
      'warning'
    )
  }, [user, confirmDialog, onUpdateUser])

  // Função para reativar usuário
  const handleReactivateUser = useCallback(() => {
    if (!user) return
    
    confirmDialog.confirm(
      'Reativar Usuário',
      `Tem certeza que deseja reativar ${user.name}? O usuário terá acesso completo ao sistema novamente.`,
      async () => {
        setIsUpdatingStatus(true)
        setError(null)
        
        try {
          await userService.updateUser(user._id, { status: convertStatusToString(UserStatus.ACTIVE) })
          setFormData(prev => ({ ...prev, status: UserStatus.ACTIVE }))
          onUpdateUser()
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Erro ao reativar usuário'
          )
          console.error('Error reactivating user:', err)
        } finally {
          setIsUpdatingStatus(false)
        }
      },
      'info'
    )
  }, [user, confirmDialog, onUpdateUser])

  // Função para remover usuário
  const handleRemoveUser = useCallback(() => {
    if (!user) return
    
    confirmDialog.confirm(
      'Remover Usuário',
      `Tem certeza que deseja remover ${user.name}? Esta ação é irreversível e o usuário perderá acesso permanente ao sistema.`,
      async () => {
        setIsUpdatingStatus(true)
        setError(null)
        
        try {
          await userService.updateUser(user._id, { status: convertStatusToString(UserStatus.INACTIVE) })
          setFormData(prev => ({ ...prev, status: UserStatus.INACTIVE }))
          onUpdateUser()
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Erro ao remover usuário'
          )
          console.error('Error removing user:', err)
        } finally {
          setIsUpdatingStatus(false)
        }
      },
      'danger'
    )
  }, [user, confirmDialog, onUpdateUser])

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
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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

        {/* Status Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ações de Status
          </label>
          
          {/* Status Display */}
          <div className="flex items-center space-x-2 mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(formData.status)}
              <span className="text-sm font-medium text-gray-700">
                Status atual: {formData.status === UserStatus.ACTIVE ? 'Ativo' : 
                              formData.status === UserStatus.SUSPENDED ? 'Suspenso' : 'Inativo'}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            {formData.status === UserStatus.ACTIVE ? (
              <div className="flex items-center space-x-2">
                {/* Suspend Button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSuspendUser}
                  disabled={isSubmitting || isUpdatingStatus}
                  className="w-full flex items-center justify-center space-x-2 text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                >
                  {isUpdatingStatus ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span>Suspender</span>
                    </>
                  )}
                </Button>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRemoveUser}
                  disabled={isSubmitting || isUpdatingStatus}
                  className="w-full flex items-center justify-center space-x-2 text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
                >
                  {isUpdatingStatus ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4" />
                      <span>Remover</span>
                    </>
                  )}
                </Button>
              </div>
            ) : formData.status === UserStatus.SUSPENDED ? (
              <div className="flex items-center space-x-2">
                {/* Reactivate Button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReactivateUser}
                  disabled={isSubmitting || isUpdatingStatus}
                  className="w-full flex items-center justify-center space-x-2 text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                >
                  {isUpdatingStatus ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>Reativar</span>
                    </>
                  )}
                </Button>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRemoveUser}
                  disabled={isSubmitting || isUpdatingStatus}
                  className="w-full flex items-center justify-center space-x-2 text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
                >
                  {isUpdatingStatus ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4" />
                      <span>Remover</span>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Reactivate Button for Inactive Users */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReactivateUser}
                  disabled={isSubmitting || isUpdatingStatus}
                  className="w-full flex items-center justify-center space-x-2 text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                >
                  {isUpdatingStatus ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>Reativar</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            {getStatusDescription(formData.status)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting || isUpdatingStatus}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isUpdatingStatus}
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
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config?.title || ''}
        message={confirmDialog.config?.message || ''}
        variant={confirmDialog.config?.variant || 'danger'}
        loading={isUpdatingStatus}
      />
    </Modal>
  )
}
