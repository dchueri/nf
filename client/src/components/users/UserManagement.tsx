import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'
import { User, UserRole, UserStatus } from '../../types/user'
import {
  TeamRole,
  TeamMemberStatus,
  UserSearchFilters,
  BulkUserOperation
} from '../../types/team'
import * as teamService from '../../services/teamService'
import { cn } from '../../utils/cn'
import { userService } from 'services/userService'
import { useDebounce } from '../../hooks/useDebounce'
import { UserHeader } from './UserHeader'
import { UserActions } from './UserActions'
import { UserFilters } from './UserFilters'
import { UserActionTable } from './UserActionTable'

interface UserManagementProps {
  companyId?: string
  className?: string
}

export const UserManagement: React.FC<UserManagementProps> = ({
  companyId,
  className
}) => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<UserSearchFilters>({})
  const { page, limit, total, totalPages } = pagination

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    loadUsers()
  }, [
    companyId,
    pagination.page,
    pagination.limit,
    debouncedSearchQuery,
    filters.status,
    filters.role
  ])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const results = await userService.getUsers(
        1,
        10,
        filters.status?.[0] || '',
        filters.role?.[0] || '',
        debouncedSearchQuery
      )
      setUsers(results.data.docs)
      setPagination({
        page: results.data.page,
        limit: results.data.limit,
        total: results.data.total,
        totalPages: results.data.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
      console.error('Error loading users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map((user) => user._id)))
    }
  }

  const handleBulkOperation = async (
    operation: BulkUserOperation['operation']
  ) => {
    if (selectedUsers.size === 0) return

    try {
      const bulkOp: BulkUserOperation = {
        operation,
        users: Array.from(selectedUsers)
      }
      console.log('bulkOp', bulkOp)

      if (process.env.NODE_ENV === 'development') {
        // Simulate bulk operation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('Bulk operation:', bulkOp)

        // Update local state
        if (operation === 'remove') {
          setUsers(users.filter((user) => !selectedUsers.has(user._id)))
        } else if (operation === 'suspend') {
          setUsers(
            users.map((user) =>
              selectedUsers.has(user._id)
                ? { ...user, role: UserRole.COLLABORATOR }
                : user
            )
          )
        }

        setSelectedUsers(new Set())
      } else {
        const result = await teamService.bulkUserOperation(
          bulkOp.operation,
          Array.from(selectedUsers),
          bulkOp.data
        )
        console.log('Bulk operation result:', result)

        // Reload users to get updated data
        await loadUsers()
        setSelectedUsers(new Set())
      }
    } catch (error) {
      console.error('Error in bulk operation:', error)
      setError('Erro ao executar operação em lote')
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erro ao Carregar Usuários
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={loadUsers}>
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn('bg-white rounded-lg border border-gray-200', className)}
    >
      <UserHeader
        users={users}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      <UserActions
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedUsers={selectedUsers}
        handleBulkOperation={handleBulkOperation}
        handleSelectAll={handleSelectAll}
        usersNumber={users.length}
      />
      <UserFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
      />
      <UserActionTable
        selectedUsers={selectedUsers}
        handleSelectAll={handleSelectAll}
        handleSelect={handleUserSelection}
        isLoading={isLoading}
        totalPages={totalPages}
        page={page}
        limit={limit}
        setPagination={setPagination}
        users={users}
      />
    </div>
  )
}
