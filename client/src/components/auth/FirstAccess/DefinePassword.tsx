import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { z } from 'zod'
import { useAuthService } from 'services/authService'

// Schema Zod para validação de senha
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter pelo menos um caractere especial'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

type PasswordData = z.infer<typeof passwordSchema>

export const DefinePassword: React.FC<{
  handleNextStep: () => void
  email: string
}> = ({ handleNextStep, email }) => {
  const [formData, setFormData] = useState<PasswordData>({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Partial<PasswordData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { firstAccess } = useAuthService()

  const validateForm = () => {
    try {
      passwordSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<PasswordData> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof PasswordData] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await firstAccess({ email, password: formData.password })
      handleNextStep()
    } catch (error) {
      setErrors({ password: 'Erro ao ativar conta. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    return {
      score: strength,
      label: strength < 2 ? 'Fraca' : strength < 4 ? 'Média' : 'Forte',
      color: strength < 2 ? 'red' : strength < 4 ? 'yellow' : 'green'
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Configurar Senha
          </h2>
          <p className="text-gray-600">Crie uma senha segura para sua conta</p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 2: Password Setup */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <span className="text-blue-600 font-semibold text-lg">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Configure sua Senha
              </h3>
              <p className="text-sm text-gray-600">
                Para <strong>{email}</strong>
              </p>
            </div>

            <div>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value: string) =>
                  handleInputChange('password', value)
                }
                placeholder="Digite sua senha"
                error={errors.password}
                disabled={isSubmitting}
                label="Nova Senha"
                autoFocus
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Força da senha:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.color === 'red'
                          ? 'text-red-600'
                          : passwordStrength.color === 'yellow'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.color === 'red'
                          ? 'bg-red-500'
                          : passwordStrength.color === 'yellow'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 text-xs text-gray-600">
                <p className="font-medium mb-1">Requisitos da senha:</p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center ${
                      formData.password.length >= 8
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Pelo menos 8 caracteres
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Uma letra maiúscula
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Uma letra minúscula
                  </li>
                  <li
                    className={`flex items-center ${
                      /[0-9]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Um número
                  </li>
                  <li
                    className={`flex items-center ${
                      /[^A-Za-z0-9]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Um caractere especial
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <TextField
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(value: string) =>
                  handleInputChange('confirmPassword', value)
                }
                placeholder="Confirme sua senha"
                error={errors.confirmPassword}
                disabled={isSubmitting}
                label="Confirmar Senha"
              />
            </div>

            <Button
              type="submit"
              disabled={
                !formData.password || !formData.confirmPassword || isSubmitting
              }
              className="w-full"
            >
              {isSubmitting ? 'Ativando Conta...' : 'Ativar Conta'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
