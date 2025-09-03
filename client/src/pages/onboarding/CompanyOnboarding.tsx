import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { CompanyForm } from '../../components/onboarding/CompanyForm'
import { useOnboarding } from '../../hooks/useOnboarding'
import { useUser } from '../../contexts/UserContext'
import { type CompanyFormData } from '../../schemas/companySchemas'
import { FeedbackMessage } from '../../components/ui/FeedbackMessage'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'

export const CompanyOnboarding: React.FC = () => {
  const { user } = useUser()
  const { completeOnboarding, exitOnboarding, isLoading } = useOnboarding()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (companyData: CompanyFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      await completeOnboarding(companyData)
          } catch (error) {
        console.error('Erro ao completar onboarding:', error)
        setError(error instanceof Error ? error.message : 'Erro ao criar empresa. Tente novamente.')
      } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = async () => {
    try {
      await exitOnboarding()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Central de Notas PJ
              </h1>
            </div>
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo à Central de Notas PJ!
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Para começar a usar a plataforma, precisamos de algumas informações sobre sua empresa. 
              Isso nos ajudará a configurar tudo corretamente para você.
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Informações da Empresa</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Configuração</span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <FeedbackMessage
                type="error"
                title="Erro ao criar empresa"
                message={error}
              />
            </motion.div>
          )}

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-900">Seguro</h3>
              </div>
              <p className="text-sm text-gray-600">
                Suas informações são protegidas e utilizadas apenas para configurar sua conta.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-900">Rápido</h3>
              </div>
              <p className="text-sm text-gray-600">
                Processo simples que leva apenas alguns minutos para completar.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-900">Obrigatório</h3>
              </div>
              <p className="text-sm text-gray-600">
                Essas informações são necessárias para começar a usar a plataforma.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CompanyForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500">
              Ao continuar, você concorda com nossos{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                Política de Privacidade
              </a>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
