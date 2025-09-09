import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import { cn } from '../../utils/cn'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200'
        }
      case 'warning':
        return {
          icon: 'text-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          border: 'border-yellow-200'
        }
      case 'info':
        return {
          icon: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          border: 'border-blue-200'
        }
      default:
        return {
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200'
        }
    }
  }

  const styles = getVariantStyles()

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
      onClose()
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Header */}
              <div
                className={cn(
                  'flex items-center justify-between p-6 border-b',
                  styles.border
                )}
              >
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon
                    className={cn('h-6 w-6', styles.icon)}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={cn('text-white', styles.button)}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook helper para facilitar o uso
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<{
    title: string
    message: string | React.ReactNode
    onConfirm: () => void
    variant?: 'danger' | 'warning' | 'info'
  } | null>(null)

  const confirm = React.useCallback(
    (
      title: string,
      message: string | React.ReactNode,
      onConfirm: () => void,
      variant: 'danger' | 'warning' | 'info' = 'danger'
    ) => {
      setConfig({ title, message, onConfirm, variant })
      setIsOpen(true)
    },
    []
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
    setConfig(null)
  }, [])

  const handleConfirm = React.useCallback(() => {
    if (config?.onConfirm) {
      config.onConfirm()
    }
    close()
  }, [config, close])

  return {
    isOpen,
    config,
    confirm,
    close,
    handleConfirm
  }
}
