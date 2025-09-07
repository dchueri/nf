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
import { EditUserModal, InviteUserModal } from './modals'
import { ConfirmDialog, useConfirmDialog } from '../ui/ConfirmDialog'

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false)
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

  // Confirmação para ações perigosas
  const confirmDialog = useConfirmDialog()

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
        pagination.page,
        pagination.limit,
        filters.status?.[0] || '',
        filters.role?.[0] || '',
        debouncedSearchQuery,
        '', // selectedMonth
        false // toDashboard
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

    // Se for remoção, pedir confirmação
    if (operation === 'remove') {
      const userCount = selectedUsers.size
      const userText = userCount === 1 ? 'usuário' : 'usuários'

      confirmDialog.confirm(
        'Excluir Usuários',
        `Tem certeza que deseja excluir ${userCount} ${userText}? Esta ação não poderá ser desfeita.`,
        () => executeBulkOperation(operation),
        'danger'
      )
      return
    }

    // Para outras operações, executar diretamente
    await executeBulkOperation(operation)
  }

  const executeBulkOperation = async (
    operation: BulkUserOperation['operation']
  ) => {
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
          await userService.bulkUpdateStatus(
            Array.from(selectedUsers),
            'inactive'
          )
          setUsers(users.filter((user) => !selectedUsers.has(user._id)))
        } else if (operation === 'suspend') {
          await userService.bulkUpdateStatus(
            Array.from(selectedUsers),
            'suspended'
          )
          setUsers(users.filter((user) => !selectedUsers.has(user._id)))
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

  const handleUserAction = (userId: string, action: string) => {
    if (action === 'edit') {
      setSelectedUser(users.find((user) => user._id === userId) || null)
      setIsEditUserModalOpen(true)
      return
    }
    if (action === 'remove') {
      // Para remoção individual, selecionar apenas este usuário e executar bulk operation
      setSelectedUsers(new Set([userId]))
      handleBulkOperation('remove')
      return
    }
    if (action === 'cancel-invite') {
      const user = users.find((u) => u._id === userId)
      confirmDialog.confirm(
        'Cancelar Convite',
        `Tem certeza que deseja cancelar o convite para ${
          user?.name || user?.email
        }?`,
        async () => {
          try {
            await userService.cancelInvitation(userId)
            await loadUsers()
          } catch (error) {
            console.error('Error canceling invitation:', error)
            setError('Erro ao cancelar convite')
          }
        },
        'warning'
      )
      return
    }
  }

  return (
    <div
      className={cn('bg-white rounded-lg border border-gray-200', className)}
    >
      <UserHeader
        users={users}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setIsInviteUserModalOpen={setIsInviteUserModalOpen}
      />
      <UserActions
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedUsers={selectedUsers}
        handleBulkOperation={handleBulkOperation}
        handleSelectAll={handleSelectAll}
        users={users}
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
        onAction={handleUserAction}
      />
      <EditUserModal
        isOpen={isEditUserModalOpen}
        setSelectedUser={setSelectedUser}
        user={selectedUser || null}
        onUpdateUser={loadUsers}
      />
      <InviteUserModal
        isOpen={isInviteUserModalOpen}
        onClose={() => {
          setIsInviteUserModalOpen(false)
          loadUsers()
        }}
      />

      {/* Dialog de confirmação */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config?.title || ''}
        message={confirmDialog.config?.message || ''}
        variant={confirmDialog.config?.variant || 'danger'}
      />
    </div>
  )
}
