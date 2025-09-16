import React, { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'
import {
  UserStatsDashboardCollaborator,
  useUserService
} from 'services/userService'
import { InvoiceSubmissionForm } from '../invoices/InvoiceSubmissionForm'
import dayjs from 'dayjs'
import { cn } from 'utils/cn'
import { InvoiceStatus } from 'types/invoice'
import { Skeleton } from 'components/ui/Skeleton'

interface Invoice {
  id: string
  month: string
  year: number
  status: 'approved' | 'rejected' | 'pending' | 'submitted'
  amount: number
  submittedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

const CURRENT_MONTH = dayjs().format('YYYY-MM')

export const CollaboratorDashboard: React.FC = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { getUserStats } = useUserService()
  const [monthInvoices, setMonthInvoices] = useState<any>(null)
  const [limitDate, setLimitDate] = useState<any>(null)
  const currentInvoice = monthInvoices?.[0]
  const isPending = !currentInvoice
  const isRejected = currentInvoice?.status === InvoiceStatus.REJECTED
  const isApproved =
    currentInvoice?.status === InvoiceStatus.APPROVED ||
    currentInvoice?.status === InvoiceStatus.IGNORED

  const waitingForApproval = currentInvoice?.status === InvoiceStatus.SUBMITTED

  useEffect(() => {
    getUserStats(CURRENT_MONTH)
      .then((statsData) => {
        const data = statsData.data as UserStatsDashboardCollaborator
        setMonthInvoices(data.invoices)
        setLimitDate(data.limitDate)
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'ignored':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />
      case 'submitted':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
      case 'ignored':
        return 'Aprovada'
      case 'rejected':
        return 'Rejeitada'
      case 'submitted':
        return 'Em Análise'
      default:
        return 'Não Enviada'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getDaysUntilDeadline = (limitDateString: string) => {
    const limitDate = dayjs(limitDateString)
    const today = dayjs()
    const diffDays = limitDate.diff(today, 'day')
    return Math.max(0, diffDays)
  }

  const getDaysPassedSinceDeadline = (limitDateString: string) => {
    const limitDate = dayjs(limitDateString).month(dayjs().month())
    const today = dayjs()
    const diffDays = today.diff(limitDate, 'day')
    return Math.max(0, diffDays)
  }

  const daysUntilDeadline = getDaysUntilDeadline(limitDate)
  const daysPassedSinceDeadline = getDaysPassedSinceDeadline(limitDate)

  const StatsCard = ({
    icon,
    label,
    value
  }: {
    icon: React.ReactNode
    label: string
    value: string
  }) => {
    return (
      <div className="text-center flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Colaborador
          </h1>
          <p className="text-gray-600">Gerencie suas notas fiscais mensais</p>
        </div>
      </div>

      {/* Current Month Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          📝 Nota Fiscal de {monthNames[currentMonth]} de {currentYear}
        </h2>

        {loading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-3 gap-6',
              !isPending && 'md:grid-cols-2'
            )}
          >
            <StatsCard
              icon={getStatusIcon(currentInvoice?.status)}
              label="Status"
              value={getStatusLabel(currentInvoice?.status)}
            />
            {waitingForApproval && (
              <StatsCard
                icon={<ClockIcon className="h-6 w-6 text-blue-500" />}
                label="NF Enviada em"
                value={
                  currentInvoice?.createdAt
                    ? dayjs(currentInvoice.createdAt).format('DD/MM')
                    : '-'
                }
              />
            )}

            {isApproved && (
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {daysUntilDeadline}
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  Dias restantes
                </p>
                <p className="text-sm font-medium text-gray-600">
                  para o próximo envio
                </p>
              </div>
            )}

            {(isPending || isRejected) && (
              <>
                {daysPassedSinceDeadline > 0 ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {daysPassedSinceDeadline}
                    </div>
                    <p className="text-sm font-medium text-gray-600">Dias</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {daysPassedSinceDeadline === 0
                        ? 'Ultimo dia para envio!'
                        : 'Atrasado'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {daysUntilDeadline}
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Dias Restantes
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      para envio
                    </p>
                  </div>
                )}
              </>
            )}
            {isPending && (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentInvoice?.amount
                    ? formatCurrency(currentInvoice.amount)
                    : '-'}
                </div>
                <p className="text-sm font-medium text-gray-600">Valor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentInvoice?.amount ? 'Enviado' : 'Não definido'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && isPending && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Você ainda não enviou a nota fiscal deste mês.
            </p>
            <Button onClick={() => setShowInvoiceForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Enviar Nota Fiscal
            </Button>
          </div>
        )}

        {currentInvoice?.status === 'rejected' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Motivo da Rejeição:
            </h4>
            <p className="text-sm text-red-700">
              {currentInvoice.rejectionReason}
            </p>
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => setShowInvoiceForm(true)}
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Reenviar Corrigida
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Submission Form */}
      <InvoiceSubmissionForm
        isOpen={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        onSuccess={() => {
          // Recarregar dados após envio bem-sucedido
          getUserStats(CURRENT_MONTH)
            .then((statsData) => {
              const data = statsData.data as UserStatsDashboardCollaborator
              setMonthInvoices(data.invoices)
              setLimitDate(data.limitDate)
            })
            .catch((error) => {
              console.error('Erro ao recarregar dados:', error)
            })
        }}
      />
    </div>
  )
}
