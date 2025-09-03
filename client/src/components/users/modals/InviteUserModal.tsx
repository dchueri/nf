import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  CheckCircleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { FeedbackMessage } from '../../ui/FeedbackMessage'
import {
  validateInviteUserSafe,
  formatInviteUserDataForSubmission,
  type InviteUserData
} from '../../../schemas/userSchemas'
import { userService } from 'services/userService'

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  email?: string
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<InviteUserData>({
    email: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const onInviteSent = useCallback((email: string) => {
    console.log('Invite sent to:', email)
    userService.inviteUser(email)
  }, [])

  const validateForm = useCallback((): boolean => {
    const validation = validateInviteUserSafe(formData)
    if (validation.success) {
      setErrors({})
      return true
    } else {
      setErrors(validation.errors)
      return false
    }
  }, [formData])

  const handleInputChange = useCallback((value: string) => {
    setFormData({ email: value })
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
    setError(null)
  }, [errors.email])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formattedData = formatInviteUserDataForSubmission(formData)
      
      if (process.env.NODE_ENV === 'development') {
        // Simular chamada da API
        await new Promise(resolve => setTimeout(resolve, 800))
        console.log('Sending invite:', formattedData)
        
        // Simular sucesso
        setIsSuccess(true)
        onInviteSent(formattedData.email)
        
        // Fechar modal após 1.5 segundos
        setTimeout(() => {
          handleClose()
        }, 1500)
      } else {
        // TODO: Implementar chamada real da API
        // await userService.inviteUser(formattedData)
        // setIsSuccess(true)
        // onInviteSent(formattedData.email)
        // setTimeout(() => handleClose(), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar convite')
      console.error('Error sending invite:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onInviteSent])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData({ email: '' })
      setErrors({})
      setError(null)
      setIsSuccess(false)
      onClose()
    }
  }, [isSubmitting, onClose])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e as any)
    }
  }, [handleSubmit, isSubmitting])

  if (isSuccess) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Convite Enviado!"
        subtitle="O convite foi enviado com sucesso"
        size="sm"
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
        disabled={true}
      >
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center"
          >
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            Convite Enviado!
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-600"
          >
            O convite foi enviado para <strong>{formData.email}</strong>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-gray-500 mt-2"
          >
            Fechando automaticamente...
          </motion.p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Convidar Usuário"
      subtitle="Digite o email do novo usuário"
      size="sm"
      icon={<UserPlusIcon className="h-6 w-6 text-blue-600" />}
      disabled={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <FeedbackMessage
            type="error"
            title="Erro ao enviar convite"
            message={error}
          />
        )}

        {/* Email Field - Ultra prático */}
        <div className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-4 p-4 bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center"
            >
              <EnvelopeIcon className="h-10 w-10 text-blue-600" />
            </motion.div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Digite o email
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              O usuário receberá um convite por email
            </p>
          </div>

          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
              }`}
              placeholder="usuario@empresa.com"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 text-center"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !formData.email.trim()}
            className="flex items-center space-x-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="h-4 w-4" />
                <span>Enviar Convite</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            💡 Pressione <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> para enviar rapidamente
          </p>
        </div>
      </form>
    </Modal>
  )
}
