import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useUserService } from 'services/userService'

// Schema Zod para validação de email
const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email deve ser válido')
  .min(5, 'Email deve ter pelo menos 5 caracteres')
  .max(254, 'Email deve ter no máximo 254 caracteres')
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Formato de email inválido'
  )
  .refine((email) => !email.includes(' '), 'Email não pode conter espaços')
  .refine(
    (email) => !email.startsWith('.') && !email.endsWith('.'),
    'Email não pode começar ou terminar com ponto'
  )
  .refine(
    (email) => !email.includes('..'),
    'Email não pode ter pontos consecutivos'
  )
  .toLowerCase()
  .trim()

type EmailData = z.infer<typeof emailSchema>

export const InviteValidation: React.FC<{
  handleNextStep: () => void
  setEmail: (email: string) => void
}> = ({ handleNextStep, setEmail }) => {
  const navigate = useNavigate()
  const [emailInput, setEmailInput] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const { validateInvite } = useUserService()

  const validateEmail = () => {
    try {
      emailSchema.parse(emailInput)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string } = {}
        error.issues.forEach((issue) => {
          // Como estamos validando diretamente o email, o path pode estar vazio
          // ou conter apenas o índice 0
          if (
            issue.path.length === 0 ||
            issue.path[0] === 0 ||
            issue.path[0] === 'email'
          ) {
            fieldErrors.email = issue.message
          }
        })
        console.log('Email inválido', error.issues)
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleEmailChange = (value: string) => {
    setEmailInput(value)
    if (errors.email) {
      setErrors({})
    }
  }

  const handleValidateEmail = async () => {
    if (!validateEmail()) {
      console.log('Email inválido')
      return
    }

    setIsValidating(true)
    try {
      await validateInvite(emailInput)
      setEmail(emailInput)
      handleNextStep()
    } catch (error: any) {
      setErrors({
        email: error.message
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleBack = () => {
    navigate('/login')
  }

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao Login
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Primeiro Acesso
          </h2>
          <p className="text-gray-600">Configure sua conta de colaborador</p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <span className="text-blue-600 font-semibold text-lg">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Valide seu Email
              </h3>
              <p className="text-sm text-gray-600">
                Digite o email que recebeu o convite para continuar
              </p>
            </div>

            <div>
              <TextField
                type="email"
                value={emailInput}
                onChange={handleEmailChange}
                onEnter={handleValidateEmail}
                placeholder="seu@email.com"
                error={errors.email}
                disabled={isValidating}
                label="Email do Convite"
                autoFocus
              />
            </div>

            <Button
              onClick={handleValidateEmail}
              disabled={!emailInput.trim() || isValidating}
              className="w-full"
            >
              {isValidating ? 'Validando...' : 'Validar Convite'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
