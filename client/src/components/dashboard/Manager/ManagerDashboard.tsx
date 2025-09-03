import React, { useState, useCallback, useEffect } from 'react'
import {
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
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
import { UserFilters, UserFilterType } from './UserFilters'
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
interface UserStatus {
  id: string
  name: string
  email: string
  department: string
  hasSubmitted: boolean
  status: 'approved' | 'rejected' | 'pending' | 'not_submitted'
  amount?: number
  submittedAt?: string
  referenceMonth: string // Mês de referência (YYYY-MM)
  deadlineDate: string // Data limite para o mês
}

export const ManagerDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<UserFilterType>('all')
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
    setDataLoading(true)
    Promise.all([
      getUserStats(selectedMonth),
      getUsers(pagination.page, pagination.limit, '', '', textSearch)
    ]).then(([statsData, usersData]) => {
      console.log('statsData', statsData)
      console.log('usersData', usersData)
      setStats(statsData.data)
      setUsersPage(usersData.data)
      setDataLoading(false)
    }).catch((error) => {
      console.error('Erro ao carregar dados:', error)
      setDataLoading(false)
    })
  }, [selectedMonth, pagination.page, pagination.limit, textSearch])



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

  // Mock data
  // const users: UserStatus[] = [
  //   {
  //     id: '1',
  //     name: 'João Silva',
  //     email: 'joao.silva@empresa.com',
  //     department: 'TI',
  //     hasSubmitted: true,
  //     status: 'approved',
  //     amount: 5000,
  //     submittedAt: '2024-01-15',
  //     referenceMonth: '2024-01',
  //     deadlineDate: '2024-01-15'
  //   },
  //   {
  //     id: '2',
  //     name: 'Maria Santos',
  //     email: 'maria.santos@empresa.com',
  //     department: 'Marketing',
  //     hasSubmitted: false,
  //     status: 'not_submitted',
  //     referenceMonth: '2024-01',
  //     deadlineDate: '2024-01-15'
  //   },
  //   {
  //     id: '3',
  //     name: 'Pedro Costa',
  //     email: 'pedro.costa@empresa.com',
  //     department: 'Vendas',
  //     hasSubmitted: true,
  //     status: 'pending',
  //     amount: 4800,
  //     submittedAt: '2024-01-14',
  //     referenceMonth: '2024-01',
  //     deadlineDate: '2024-01-15'
  //   },
  //   {
  //     id: '4',
  //     name: 'Ana Oliveira',
  //     email: 'ana.oliveira@empresa.com',
  //     department: 'RH',
  //     hasSubmitted: true,
  //     status: 'rejected',
  //     amount: 5200,
  //     submittedAt: '2024-01-13',
  //     referenceMonth: '2024-01',
  //     deadlineDate: '2024-01-15'
  //   },
  //   {
  //     id: '5',
  //     name: 'Carlos Lima',
  //     email: 'carlos.lima@empresa.com',
  //     department: 'Financeiro',
  //     hasSubmitted: false,
  //     status: 'not_submitted',
  //     referenceMonth: '2024-02',
  //     deadlineDate: '2024-02-15'
  //   },
  //   {
  //     id: '6',
  //     name: 'Fernanda Costa',
  //     email: 'fernanda.costa@empresa.com',
  //     department: 'Vendas',
  //     hasSubmitted: true,
  //     status: 'approved',
  //     amount: 4500,
  //     submittedAt: '2024-02-10',
  //     referenceMonth: '2024-02',
  //     deadlineDate: '2024-02-15'
  //   }
  // ]



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

      <DateSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} navigateMonth={navigateMonth} />
      
      {dataLoading ? (
        <StatsSkeleton />
      ) : (
        <UserStats stats={stats} />
      )}

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
          selectedFilter={selectedFilter}
          onUserAction={(userId, action) => {
            console.log('User action:', userId, action)
            // Implementar ações específicas aqui
          }}
        />
      )}
    </div>
  )
}
