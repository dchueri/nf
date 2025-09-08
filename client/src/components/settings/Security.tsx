import { useUserService } from 'services/userService'
import { Button } from '../ui/Button'
import { useToastHelpers } from 'components/ui/Toast'
import { useState } from 'react'
import { useUser } from 'contexts/UserContext'
import { z } from 'zod'

// Schema Zod para validação de senhas
const passwordSchema = z.object({
  password: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'A nova senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A nova senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A nova senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A nova senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A nova senha deve conter pelo menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

interface Props {
  password: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  password?: string
  newPassword?: string
  confirmPassword?: string
}

export const Security = () => {
  const { updateUser } = useUserService()
  const [formData, setFormData] = useState<Props>({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToastHelpers()

  const validateForm = () => {
    try {
      passwordSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof FormErrors] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: keyof Props, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSaveSecurity = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await updateUser('me', {
        password: formData.password,
        newPassword: formData.newPassword
      })
      toast.success('Senha atualizada com sucesso!')
      setFormData({
        password: '',
        newPassword: '',
        confirmPassword: ''
      })
      setErrors({})
    } catch (error) {
      toast.error('Erro ao atualizar senha', (error as Error).message)
      setErrors({
        password: (error as Error).message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Alterar Senha
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite sua senha atual"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha *
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Mínimo 8 caracteres"
                disabled={isSubmitting}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirme a nova senha"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSecurity}
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            'Salvar Configurações'
          )}
        </Button>
      </div>
    </div>
  )
}
