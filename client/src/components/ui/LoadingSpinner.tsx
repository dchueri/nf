import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const borderClasses = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <motion.div
        className={`${sizeClasses[size]} ${borderClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600" aria-label={text}>
          {text}
        </p>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  )
}

// Componente para loading de página completa
export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

// Componente para loading de conteúdo
export const ContentLoader: React.FC<{ text?: string }> = ({ text = 'Carregando conteúdo...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}

// Componente para loading de botão
export const ButtonLoader: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}
