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
import { BigTextField } from '../../ui/BigTextField'
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
  onClose
}) => {
  const [formData, setFormData] = useState<InviteUserData>({
    email: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  console.log('isSuccess', isSuccess)
  const onInviteSent = useCallback((email: string) => {
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

  const handleInputChange = useCallback(
    (value: string) => {
      setFormData({ email: value })

      // Limpar erro do campo quando usuário começar a digitar
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }))
      }

      // Limpar erro geral
      setError(null)

      // Validação em tempo real (opcional - apenas para feedback visual)
      if (value.trim().length > 0) {
        const validation = validateInviteUserSafe({ email: value })
        if (!validation.success) {
          // Não definir erro imediatamente, apenas quando o usuário parar de digitar
          // ou tentar submeter o formulário
        }
      }
    },
    [errors.email]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validateForm()) return

      setIsSubmitting(true)
      setError(null)

      try {
        const formattedData = formatInviteUserDataForSubmission(formData)

        onInviteSent(formattedData.email)
        setIsSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao enviar convite')
        console.error('Error sending invite:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, onInviteSent]
  )

  const handleClose = useCallback(() => {
      console.log('handleClose', isSubmitting)
      setFormData({ email: '' })
      setErrors({})
      setError(null)
      setIsSuccess(false)
      onClose()
  }, [onClose]) 

  if (isSuccess) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Convite Enviado!"
        subtitle="O convite foi enviado com sucesso"
        size="sm"
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
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

          <BigTextField
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => {
              // Validar quando o usuário sair do campo
              if (formData.email.trim().length > 0) {
                const validation = validateInviteUserSafe({
                  email: formData.email
                })
                if (!validation.success) {
                  setErrors(validation.errors)
                }
              }
            }}
            placeholder="usuario@empresa.com"
            disabled={isSubmitting}
            autoFocus
            autoComplete="email"
            spellCheck={false}
            icon={<EnvelopeIcon className="h-5 w-5" />}
            error={errors.email}
            onEnter={handleSubmit}
          />
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
            disabled={isSubmitting || !formData.email.trim() || !!errors.email}
            className={`flex items-center space-x-2 min-w-[120px] transition-all ${
              formData.email.trim() && !errors.email
                ? 'bg-green-600 hover:bg-green-700'
                : ''
            }`}
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
      </form>
    </Modal>
  )
}
