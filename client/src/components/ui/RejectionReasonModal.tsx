import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Invoice } from '../../types/invoice'
import dayjs from 'dayjs'

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  if (!invoice) return null
  console.log('invoice', invoice)

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY [às] HH:mm')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Motivo da Rejeição">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nota Fiscal #{invoice.invoiceNumber}
              </h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Colaborador:</strong> {invoice.userId.name}</p>
                <p><strong>Mês de Competência:</strong> {dayjs(invoice.referenceMonth).format('MM/YYYY')}</p>
                <p><strong>Data de Envio:</strong> {formatDate(invoice.createdAt)}</p>
                {invoice.reviewedAt && (
                  <p><strong>Data de Rejeição:</strong> {formatDate(invoice.reviewedAt)}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                Motivo da Rejeição
              </h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                {invoice.rejectionReason ? (
                  <p className="text-sm text-red-800 leading-relaxed">
                    {invoice.rejectionReason}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 italic">
                    Nenhum motivo específico foi informado para esta rejeição.
                  </p>
                )}
              </div>
            </div>

            {invoice.notes && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Observações Adicionais
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  )
}

export const useRejectionReasonModal = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [invoice, setInvoice] = React.useState<Invoice | null>(null)

  const openModal = React.useCallback((invoiceData: Invoice) => {
    setInvoice(invoiceData)
    setIsOpen(true)
  }, [])

  const closeModal = React.useCallback(() => {
    setIsOpen(false)
    setInvoice(null)
  }, [])

  return {
    isOpen,
    invoice,
    openModal,
    closeModal
  }
}
