import React from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { User } from '../../../types/user'
import { InvoiceStatus } from '../../../types/invoice'
import dayjs from 'dayjs'

interface UserTableProps {
  users: User[]
  selectedMonth: string
  onUserAction?: (userId: string, action: string) => void
  className?: string
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
  switch (status) {
    case 'approved':
      return 'Aprovada'
    case 'rejected':
      return 'Rejeitada'
    case 'submitted':
      return 'Enviada'
    case 'pending':
      return 'Pendente'
    default:
      return status
  }
}

const getDelayStatus = (status: InvoiceStatus) => {
  if (status === InvoiceStatus.SUBMITTED) return null

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

const getUserActualMonth = (user: User, selectedMonth: string) => {
  return user.monthsWithInvoices.find((month) => month.month === selectedMonth)
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedMonth,
  onUserAction,
  className = ''
}) => {
  const handleUserAction = (userId: string, action: string) => {
    if (onUserAction) {
      onUserAction(userId, action)
    }
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Status dos Usuários - {formatMonthDisplay(selectedMonth)} (
          {users.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prazo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Envio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => {
              const userActualMonth = getUserActualMonth(
                user,
                selectedMonth
              ) || {
                status: InvoiceStatus.PENDING,
                submittedAt: ''
              }
              const actualMonthStatus = userActualMonth.status

              return (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
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
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        actualMonthStatus
                      )}`}
                    >
                      {getStatusLabel(actualMonthStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(() => {
                      const delayStatus = getDelayStatus(actualMonthStatus)
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
                            ⏰ {delayStatus.daysUntilDeadline} dia(s)
                            restante(s)
                          </span>
                        )
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userActualMonth.submittedAt
                      ? formatDate(userActualMonth.submittedAt)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {actualMonthStatus === InvoiceStatus.SUBMITTED && (
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
                      {actualMonthStatus === InvoiceStatus.PENDING && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUserAction(user._id, 'remind')}
                        >
                          Lembrar
                        </Button>
                      )}
                      {actualMonthStatus !== InvoiceStatus.APPROVED && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleUserAction(user._id, 'ignore')
                          }
                        >
                          Ignorar
                        </Button>
                      )}
                      {actualMonthStatus !== InvoiceStatus.PENDING && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUserAction(user._id, 'details')}
                        >
                          Ver Detalhes
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum usuário encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros de busca.
          </p>
        </div>
      )}
    </div>
  )
}
