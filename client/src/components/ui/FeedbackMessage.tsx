import React from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export type FeedbackType = 'success' | 'error' | 'warning' | 'info'

interface FeedbackMessageProps {
  type: FeedbackType
  title: string
  message?: string
  onClose?: () => void
  className?: string
  showIcon?: boolean
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
  showIcon = true
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        {showIcon && (
          <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 mr-3 flex-shrink-0`} aria-hidden="true" />
        )}
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {title}
          </h3>
          {message && (
            <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${config.textColor} hover:opacity-75 transition-opacity`}
            aria-label="Fechar mensagem"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Componente para mensagens de estado vazio
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Componente para mensagens de erro
interface ErrorBoundaryFallbackProps {
  error?: Error
  resetError?: () => void
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetError
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Algo deu errado
        </h2>
        <p className="text-gray-500 mb-6">
          {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
        </p>
        {resetError && (
          <button
            onClick={resetError}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  )
}
