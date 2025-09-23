import React, { useState, useCallback, useEffect } from 'react'
import { BellIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { useToastHelpers } from '../../ui/Toast'
import {
  useUserService,
  UserStatsDashboard
} from '../../../services/userService'
import dayjs from 'dayjs'
import { User, UserRole, UserStatus } from 'types/user'
import { UserStats } from './UserStats'
import { DateSelector } from './DateSelector'
import { UserFilters, UserInvoiceStatusFilterType } from './UserFilters'
import { UserTable } from './UserTable'
import { ButtonLoader } from '../../ui/LoadingSpinner'
import { Invoice, InvoiceStatus } from 'types/invoice'
import { useInvoiceService } from 'services/invoiceService'
import {
  RejectInvoiceModal,
  useRejectInvoiceModal
} from '../../ui/RejectInvoiceModal'

const CURRENT_MONTH = dayjs().format('YYYY-MM')

interface UserListResponse {
  docs: (User & { invoice: Invoice })[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const ManagerDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] =
    useState<UserInvoiceStatusFilterType>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>(CURRENT_MONTH)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [textSearch, setTextSearch] = useState<string>('')
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10
  })
  const toast = useToastHelpers()
  const { getUserStats, getUsersWithInvoiceStatus } = useUserService()
  const { createIgnoredInvoice, downloadInvoiceFile, updateInvoiceStatus } =
    useInvoiceService()
  const {
    isOpen: isRejectModalOpen,
    openModal: openRejectModal,
    closeModal: closeRejectModal,
    handleReject,
    config
  } = useRejectInvoiceModal()

  const [usersPage, setUsersPage] = useState<any>({
    docs: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [stats, setStats] = useState<UserStatsDashboard>({
    total: 0,
    pending: 0,
    approved: 0
  })

  const users = usersPage.docs

  const handleGetUsers = useCallback(() => {
    setDataLoading(true)
    getUserStats(selectedMonth)
      .then((statsData) => {
        setStats(statsData.data as UserStatsDashboard)
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error)
      })
    getUsersWithInvoiceStatus(
      selectedMonth,
      selectedFilter as UserStatus,
      UserRole.COLLABORATOR,
      textSearch,
      pagination.page,
      pagination.limit
    )
      .then((usersData) => {
        setUsersPage((prev: any) => ({
          ...prev,
          docs: usersData.data
        }))
        setDataLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error)
        setDataLoading(false)
      })
  }, [
    selectedMonth,
    selectedFilter,
    textSearch,
    pagination.page,
    pagination.limit
  ])

  useEffect(() => {
    setSelectedFilter('all')
    handleGetUsers()
  }, [selectedMonth])

  useEffect(() => {
    setDataLoading(true)
    Promise.all([
      getUsersWithInvoiceStatus(
        selectedMonth,
        selectedFilter as UserStatus,
        UserRole.COLLABORATOR,
        textSearch,
        pagination.page,
        pagination.limit
      )
    ])
      .then(([usersData]) => {
        setUsersPage((prev: any) => ({
          ...prev,
          docs: usersData.data
        }))
        setDataLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error)
        setDataLoading(false)
      })
  }, [
    selectedMonth,
    pagination.page,
    pagination.limit,
    textSearch,
    selectedFilter
  ])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month

    if (direction === 'prev') {
      if (month === 1) {
        newMonth = 12
        newYear = year - 1
      } else {
        newMonth = month - 1
      }
    } else {
      if (month === 12) {
        newMonth = 1
        newYear = year + 1
      } else {
        newMonth = month + 1
      }
    }

    const newMonthString = `${newYear}-${String(newMonth).padStart(2, '0')}`
    setSelectedMonth(newMonthString)
  }

  const handleSendReminders = useCallback(async () => {
    setLoading(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success(
        'Lembretes enviados!',
        'Todos os colaboradores foram notificados.'
      )
    } catch (error) {
      toast.error(
        'Erro ao enviar lembretes',
        'Tente novamente em alguns instantes.'
      )
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleGenerateReport = useCallback(async () => {
    setLoading(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(
        'Relatório gerado!',
        'O arquivo foi baixado automaticamente.'
      )
    } catch (error) {
      toast.error(
        'Erro ao gerar relatório',
        'Tente novamente em alguns instantes.'
      )
    } finally {
      setLoading(false)
    }
  }, [toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Gestor</h1>
          <p className="text-gray-600">
            Visão geral do status de envio de notas fiscais
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? (
              <ButtonLoader text="Compilando Notas Fiscais..." />
            ) : (
              <>
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Compilar Notas Fiscais
              </>
            )}
          </Button>
        </div>
      </div>

      <DateSelector
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        navigateMonth={navigateMonth}
      />

      <UserStats stats={stats} />

      <UserFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <UserTable
        users={users}
        selectedMonth={selectedMonth}
        onUserAction={(user, action, fileName) => {
          setDataLoading(true)
          switch (action) {
            case 'approve':
              updateInvoiceStatus(user.invoice._id, InvoiceStatus.APPROVED)
                .then(() => {
                  toast.success('Nota fiscal aprovada com sucesso')
                  handleGetUsers()
                })
                .catch((error) => {
                  toast.error('Erro ao aprovar nota fiscal', error.message)
                })
              break
            case 'reject':
              const userName = user.name || 'Usuário'

              openRejectModal(userName, (reason) => {
                updateInvoiceStatus(
                  user.invoice._id,
                  InvoiceStatus.REJECTED,
                  reason
                )
                  .then(() => {
                    toast.success('Nota fiscal rejeitada com sucesso')
                    handleGetUsers()
                  })
                  .catch((error) => {
                    toast.error('Erro ao rejeitar nota fiscal', error.message)
                  })
              })
              break
            case 'download':
              downloadInvoiceFile(user.invoice._id)
                .then((file) => {
                  if (!(file instanceof Blob)) {
                    throw new Error(
                      `Arquivo recebido não é um Blob válido. Tipo: ${typeof file}`
                    )
                  }

                  const url = window.URL.createObjectURL(file)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = fileName || 'invoice.pdf'
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  window.URL.revokeObjectURL(url)

                  toast.success('Nota fiscal salva com sucesso')
                })
                .catch((error) => {
                  console.error('Erro ao baixar nota fiscal:', error)
                  toast.error(`Erro ao baixar nota fiscal: ${error.message}`)
                })
              break
            case 'ignore':
              createIgnoredInvoice({
                userId: user._id,
                referenceMonth: selectedMonth
              })
                .then(() => {
                  toast.success('Nota fiscal ignorada com sucesso')
                  handleGetUsers()
                })
                .catch((error) => {
                  toast.error('Erro ao ignorar nota fiscal', error.message)
                })
              break
          }
          setDataLoading(false)
        }}
        loading={dataLoading}
      />

      {/* Modal de confirmação para rejeição */}
      <RejectInvoiceModal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onReject={handleReject}
        loading={dataLoading}
        userName={config?.userName}
      />
    </div>
  )
}
