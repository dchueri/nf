import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { useNavigate } from 'react-router-dom'

export const Confirmation: React.FC<{ email: string }> = ({ email }) => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown para redirecionamento automático
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      handleGoToDashboard()
    }
  }, [countdown])

  const handleGoToDashboard = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Conta Ativada com Sucesso!
          </h2>

          <p className="text-lg text-gray-600 mb-2">
            Bem-vindo à Central de Notas PJ
          </p>

          <p className="text-sm text-gray-500">
            Sua conta <strong>{email}</strong> foi ativada e está pronta para
            uso
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100"
        >
          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Ativação Concluída
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Sua conta foi ativada com sucesso e você já pode acessar todas
                  as funcionalidades da plataforma.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">
                Próximos Passos
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        1
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Acesse seu Dashboard
                    </p>
                    <p className="text-sm text-gray-600">
                      Visualize suas notas fiscais e atividades
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        2
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Configure seu Perfil
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete suas informações pessoais
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        3
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Comece a Usar
                    </p>
                    <p className="text-sm text-gray-600">
                      Envie suas notas fiscais e gerencie documentos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Button onClick={handleGoToDashboard} className="w-full">
              <span className="flex items-center justify-center">
                Ir para Dashboard
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </span>
            </Button>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Redirecionando automaticamente em {countdown} segundos...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
