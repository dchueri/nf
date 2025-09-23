import React from 'react'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { User } from '../../../types/user'
import { Invoice, InvoiceStatus } from '../../../types/invoice'
import { RenderCell, Table, TableColumn } from '../../ui/Table'
import dayjs from 'dayjs'

interface UserTableProps {
  users: (User & { invoice: Invoice })[]
  selectedMonth: string
  onUserAction?: (userId: string, action: string) => void
  className?: string
  loading?: boolean
}

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.APPROVED:
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    case InvoiceStatus.REJECTED:
      return <XCircleIcon className="h-5 w-5 text-red-500" />
    case InvoiceStatus.SUBMITTED:
      return <ClockIcon className="h-5 w-5 text-gray-500" />
    default:
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
    case 'ignored':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'not_submitted':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  console.log('status', status)
  switch (status) {
    case 'approved':
    case 'ignored':
      return 'Aprovada'
    case 'rejected':
      return 'Rejeitada'
    case 'pending':
      return 'Enviada'
    default:
      return 'Pendente'
  }
}

const getDelayStatus = (status: InvoiceStatus) => {
  if (
    status === InvoiceStatus.SUBMITTED ||
    status === InvoiceStatus.APPROVED ||
    status === InvoiceStatus.IGNORED
  )
    return null

  // TODO: pegar a data limite da empresa
  const deadlineDay = 1
  const deadlineMonth = dayjs().month()
  const deadlineYear = dayjs().year()
  const deadline = new Date(deadlineYear, deadlineMonth, deadlineDay)
  const now = new Date()

  if (now > deadline) {
    const daysLate = Math.ceil(
      (now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { isLate: true, daysLate }
  }

  const daysUntilDeadline = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  return { isLate: false, daysUntilDeadline }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatMonthDisplay = (monthString: string) => {
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedMonth,
  onUserAction,
  className = '',
  loading
}) => {
  console.log('users', users)

  const handleUserAction = (userId: string, action: string) => {
    if (onUserAction) {
      onUserAction(userId, action)
    }
  }

  const formatMonthDisplay = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getDelayStatus = (status: InvoiceStatus) => {
    console.log('status', status)
    if (
      status === InvoiceStatus.SUBMITTED ||
      status === InvoiceStatus.APPROVED ||
      status === InvoiceStatus.IGNORED
    )
      return null

    // TODO: pegar a data limite da empresa
    const deadlineDay = 1
    const deadlineMonth = dayjs().month()
    const deadlineYear = dayjs().year()
    const deadline = new Date(deadlineYear, deadlineMonth, deadlineDay)
    const now = new Date()

    if (now > deadline) {
      const daysLate = Math.ceil(
        (now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
      )
      return { isLate: true, daysLate }
    }

    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { isLate: false, daysUntilDeadline }
  }

  const columns: TableColumn<User & { invoice: Invoice }>[] = [
    {
      key: 'user',
      label: 'Usuário',
      sortable: false
    },
    {
      key: 'department',
      label: 'Departamento',
      sortable: false
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false
    },
    {
      key: 'deadline',
      label: 'Prazo',
      sortable: false
    },
    {
      key: 'submissionDate',
      label: 'Data de Envio',
      sortable: false
    },
    {
      key: 'actions',
      label: 'Ações',
      sortable: false
    }
  ]

  const renderCell: RenderCell<User & { invoice: Invoice }> = (
    user: User & { invoice: Invoice },
    column: TableColumn<User & { invoice: Invoice }>
  ) => {
    console.log('user', user)
    const invoice = user.invoice
    const isPending = !invoice
    const isApproved =
      invoice?.status === InvoiceStatus.APPROVED ||
      invoice?.status === InvoiceStatus.IGNORED

    switch (column.key) {
      case 'user':
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        )

      case 'department':
        return (
          <div className="text-sm text-gray-900">{user.department || '-'}</div>
        )

      case 'status':
        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              invoice?.status
            )}`}
          >
            {getStatusLabel(invoice?.status)}
          </span>
        )

      case 'deadline':
        if (!invoice) return '-'
        return (
          <div className="text-sm text-gray-900">
            {(() => {
              const delayStatus = getDelayStatus(invoice.status)
              if (!delayStatus) return '-'

              if (delayStatus.isLate) {
                return (
                  <span className="text-red-600 font-medium">
                    ⚠️ {delayStatus.daysLate} dia(s) atrasado
                  </span>
                )
              } else {
                return (
                  <span className="text-green-600 font-medium">
                    ⏰ {delayStatus.daysUntilDeadline} dia(s) restante(s)
                  </span>
                )
              }
            })()}
          </div>
        )

      case 'submissionDate':
        if (!invoice) return '-'
        return (
          <div className="text-sm text-gray-900">
            {user.invoice.createdAt ? formatDate(user.invoice.createdAt) : '-'}
          </div>
        )

      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            {invoice?.status === InvoiceStatus.SUBMITTED && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUserAction(user._id, 'approve')}
                >
                  Aprovar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUserAction(user._id, 'reject')}
                >
                  Rejeitar
                </Button>
              </>
            )}
            {isPending && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUserAction(user._id, 'remind')}
              >
                Lembrar
              </Button>
            )}
            {invoice?.status !== InvoiceStatus.APPROVED && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUserAction(user._id, 'ignore')}
              >
                Ignorar
              </Button>
            )}
            {!isPending && !isApproved && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUserAction(user._id, 'details')}
              >
                Ver Detalhes
              </Button>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Status dos Usuários - {formatMonthDisplay(selectedMonth)}
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Table
      title={`Status dos Usuários - ${formatMonthDisplay(selectedMonth)} (${
        users.length
      })`}
      data={users}
      columns={columns}
      renderCell={renderCell}
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
        title: 'Nenhum usuário encontrado',
        description: 'Não há usuários cadastrados para este mês.'
      }}
    />
  )
}
