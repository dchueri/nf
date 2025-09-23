import React from 'react'
import { RejectInvoiceModal, useRejectInvoiceModal } from '../ui/RejectInvoiceModal'
import { Button } from '../ui/Button'

export const RejectInvoiceModalExample: React.FC = () => {
  const { isOpen, openModal, closeModal, handleReject } = useRejectInvoiceModal()

  const handleRejectClick = () => {
    openModal('João Silva', (reason) => {
      console.log('Nota fiscal rejeitada com motivo:', reason)
      alert(`Nota fiscal rejeitada! Motivo: ${reason || 'Nenhum motivo informado'}`)
    })
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Modal de Rejeição de Nota Fiscal</h2>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Clique no botão abaixo para abrir o modal de confirmação de rejeição.
        </p>
        
        <Button
          onClick={handleRejectClick}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Rejeitar Nota Fiscal
        </Button>
      </div>

      {/* Modal */}
      <RejectInvoiceModal
        isOpen={isOpen}
        onClose={closeModal}
        onReject={handleReject}
        userName="João Silva"
      />
    </div>
  )
}
