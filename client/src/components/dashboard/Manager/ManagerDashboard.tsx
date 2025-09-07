import React, { useState, useCallback, useEffect } from 'react'
import { BellIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Button } from '../../ui/Button'
import { useToastHelpers } from '../../ui/Toast'
import {
  useUserService,
  UserStatsDashboard
} from '../../../services/userService'
import dayjs from 'dayjs'
import { User } from 'types/user'
import { UserStats } from './UserStats'
import { DateSelector } from './DateSelector'
import { UserFilters, UserInvoiceStatusFilterType } from './UserFilters'
import { UserTable } from './UserTable'
import { StatsSkeleton, TableSkeleton } from '../../ui/SkeletonLoader'
import { ButtonLoader } from '../../ui/LoadingSpinner'

const CURRENT_MONTH = dayjs().format('YYYY-MM')

interface UserListResponse {
  docs: User[]
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
  const { getUserStats, getUsers } = useUserService()

  const [usersPage, setUsersPage] = useState<UserListResponse>({
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

  useEffect(() => {
    setSelectedFilter('all')
    getUserStats(selectedMonth)
      .then((statsData) => {
        setStats(statsData.data)
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error)
      })
  }, [selectedMonth])

  useEffect(() => {
    setDataLoading(true)
    Promise.all([
      getUsers(
        pagination.page,
        pagination.limit,
        selectedFilter,
        'collaborator',
        textSearch,
        selectedMonth,
        true
      )
    ])
      .then(([usersData]) => {
        setUsersPage(usersData.data)
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
          <Button
            variant="secondary"
            onClick={handleSendReminders}
            disabled={loading}
          >
            {loading ? (
              <ButtonLoader text="Enviando..." />
            ) : (
              <>
                <BellIcon className="h-4 w-4 mr-2" />
                Enviar Lembretes
              </>
            )}
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? (
              <ButtonLoader text="Gerando..." />
            ) : (
              <>
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Gerar Relatório
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

      {dataLoading ? <StatsSkeleton /> : <UserStats stats={stats} />}

      <UserFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {dataLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <UserTable
          users={users}
          selectedMonth={selectedMonth}
          onUserAction={(userId, action) => {
            console.log('User action:', userId, action)
            // Implementar ações específicas aqui
          }}
        />
      )}
    </div>
  )
}
