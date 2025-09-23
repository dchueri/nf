import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import { BigTextField } from './BigTextField'
import { cn } from '../../utils/cn'

interface RejectInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (reason?: string) => void
  userName?: string
  loading?: boolean
}

export const RejectInvoiceModal: React.FC<RejectInvoiceModalProps> = ({
  isOpen,
  onClose,
  onReject,
  userName,
  loading = false
}) => {
  const [reason, setReason] = useState('')

  const handleReject = useCallback(() => {
    if (!loading) {
      onReject(reason.trim() || undefined)
      setReason('') // Limpar o campo após rejeitar
    }
  }, [onReject, reason, loading])

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose()
      setReason('') // Limpar o campo ao fechar
    }
  }, [onClose, loading])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      handleClose()
    }
  }, [handleClose, loading])

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
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-200">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rejeitar Nota Fiscal de {userName}
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
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-600">
                    {userName
                      ? `Tem certeza que deseja rejeitar a nota fiscal de ${userName}?`
                      : 'Tem certeza que deseja rejeitar esta nota fiscal?'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Esta ação não poderá ser desfeita.
                  </p>
                </div>

                <div>
                  <BigTextField
                    value={reason}
                    onChange={setReason}
                    placeholder="Motivo da rejeição (opcional)"
                    disabled={loading}
                    autoFocus
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Informe o motivo da rejeição para ajudar o colaborador a entender o problema.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Rejeitando...</span>
                    </div>
                  ) : (
                    'Rejeitar'
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
export const useRejectInvoiceModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<{
    userName?: string
    onReject: (reason?: string) => void
  } | null>(null)
  console.log('config2', config)

  const openModal = useCallback(
    (userName: string, onReject: (reason?: string) => void) => {
      setConfig({ userName, onReject })
      setIsOpen(true)
    },
    []
  )

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setConfig(null)
  }, [])

  const handleReject = useCallback((reason?: string) => {
    if (config?.onReject) {
      config.onReject(reason)
    }
    closeModal()
  }, [config, closeModal])

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    handleReject
  }
}
