import React from 'react'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Invoice, InvoiceStatus } from '../../types/invoice'
import { StatusBadge } from '../ui/StatusBadge'
import { Button } from '../ui/Button'
import { Table, TableColumn } from '../ui/Table'
import dayjs from 'dayjs'
import { formatToBRL } from 'brazilian-values'
import { useInvoiceService } from 'services/invoiceService'
import { downloadFile } from 'utils'
import { useToastHelpers } from 'components/ui/Toast'
import { RejectionReasonModal, useRejectionReasonModal } from '../ui/RejectionReasonModal'

interface InvoiceTableProps {
  invoices: Invoice[]
  onView?: (invoice: Invoice) => void
  onEdit?: (invoice: Invoice) => void
  onDelete?: (invoice: Invoice) => void
  className?: string
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  className
}) => {
  const { downloadInvoiceFile } = useInvoiceService()
  const toast = useToastHelpers()
  const { isOpen, invoice, openModal, closeModal } = useRejectionReasonModal()

  const onDownload = (invoice: Invoice) => {
    downloadInvoiceFile(invoice._id).then((file) => {
      downloadFile(file, invoice.fileName)
      toast.success('Nota fiscal salva com sucesso')
    }).catch((error) => {
      toast.error('Erro ao baixar nota fiscal')
    })
  }

  const handleViewRejectionReason = (invoice: Invoice) => {
    openModal(invoice)
  }

  const columns: TableColumn<Invoice>[] = [
    {
      key: 'invoiceNumber',
      label: 'Nota Fiscal',
      sortable: false
    },
    {
      key: 'amount',
      label: 'Valor'
    },
    {
      key: 'status',
      label: 'Status'
    },
    {
      key: 'referenceMonth',
      label: 'Mês de Competência'
    },
    {
      key: 'actions',
      label: 'Ações'
    }
  ]

  const renderCell = (
    invoice: Invoice,
    column: TableColumn<Invoice>,
    index: number
  ) => {
    const isApproved =
      invoice.status === InvoiceStatus.APPROVED ||
      invoice.status === InvoiceStatus.IGNORED
    switch (column.key) {
      case 'invoiceNumber':
        return (
          <div className="flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {invoice.invoiceNumber}
              </div>
              <div className="text-sm text-gray-500">
                Enviada em: {dayjs(invoice.referenceMonth).format('MM/YYYY')}
              </div>
            </div>
          </div>
        )

      case 'amount':
        return (
          <div className="text-sm font-medium text-gray-900">
            {invoice.amount ? formatToBRL(invoice.amount) : '-'}
          </div>
        )

      case 'status':
        return (
          <div className="flex items-center">
            <StatusBadge status={invoice.status} />
          </div>
        )

      case 'referenceMonth':
        return (
          <div className="text-sm text-gray-900">
            {dayjs(invoice.referenceMonth).format('MM/YYYY')}
          </div>
        )

      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            {invoice.status !== InvoiceStatus.IGNORED && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload?.(invoice)
                }}
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            {invoice.status === InvoiceStatus.REJECTED && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewRejectionReason(invoice)
                }}
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Ver motivo
              </Button>
            )}
            {invoice.status === InvoiceStatus.SUBMITTED && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(invoice)
                }}
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            {invoice.status === InvoiceStatus.SUBMITTED && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(invoice)
                }}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        )

      default:
        return null
    }
  }

  console.log('invoices', invoices)
  return (
    <>
      <Table
        data={invoices}
        columns={columns}
        renderCell={renderCell}
        defaultSortField="issueDate"
        defaultSortDirection="desc"
        className={className}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeSelector: true,
          pageSizeOptions: [5, 10, 20, 50],
          showPageInfo: true,
          showNavigation: true
        }}
        emptyState={{
          icon: <DocumentTextIcon className="h-12 w-12" />,
          title: 'Nenhuma nota fiscal encontrada',
          description: 'Tente ajustar os filtros de busca.'
        }}
      />

      {/* Modal para exibir motivo da rejeição */}
      <RejectionReasonModal
        isOpen={isOpen}
        onClose={closeModal}
        invoice={invoice}
      />
    </>
  )
}
