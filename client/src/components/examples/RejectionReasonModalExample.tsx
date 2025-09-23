import React from 'react'
import { RejectionReasonModal, useRejectionReasonModal } from '../ui/RejectionReasonModal'
import { Button } from '../ui/Button'
import { Invoice, InvoiceStatus } from '../../types/invoice'

export const RejectionReasonModalExample: React.FC = () => {
  const { isOpen, invoice, openModal, closeModal } = useRejectionReasonModal()

  // Mock data para teste
  const mockInvoice: Invoice = {
    _id: '1',
    companyId: 'company1',
    userId: {
      _id: 'user1',
      name: 'João Silva',
      email: 'joao@empresa.com'
    },
    invoiceNumber: 'NF-001/2024',
    referenceMonth: '2024-01',
    amount: 2500.00,
    description: 'Serviços de consultoria técnica',
    type: 'invoice' as any,
    status: InvoiceStatus.REJECTED,
    fileName: 'nf-001-2024.pdf',
    filePath: '/uploads/nf-001-2024.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    notes: 'Nota fiscal com valor incorreto',
    reviewedBy: {
      _id: 'manager1',
      name: 'Maria Santos',
      email: 'maria@empresa.com'
    },
    reviewedAt: '2024-01-20T10:30:00Z',
    rejectionReason: 'O valor informado na nota fiscal não confere com o valor acordado no contrato. Por favor, verifique os cálculos e envie uma nova nota fiscal com o valor correto.',
    reminderCount: 0,
    tags: ['consultoria', 'técnica'],
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  }

  const handleOpenModal = () => {
    openModal(mockInvoice)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Exemplo de Modal de Motivo de Rejeição</h1>
      <Button onClick={handleOpenModal}>
        Abrir Modal de Motivo de Rejeição
      </Button>

      <RejectionReasonModal
        isOpen={isOpen}
        onClose={closeModal}
        invoice={invoice}
      />
    </div>
  )
}
