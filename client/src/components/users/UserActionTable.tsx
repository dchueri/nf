import { StatusBadge } from 'components/ui/StatusBadge'
import { User, UserRole, UserStatus } from '../../types/user'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Badge } from '../ui/Badge'
import { SkeletonTableLine } from 'components/ui/Skeleton/SkeletonTableLine'

export const UserActionTable = ({
  users,
  selectedUsers,
  handleSelectAll,
  handleSelect,
  isLoading,
  totalPages,
  page,
  limit,
  setPagination,
  onAction
}: {
  users: User[]
  selectedUsers: Set<string>
  handleSelectAll: () => void
  handleSelect: (userId: string) => void
  isLoading: boolean
  totalPages: number
  page: number
  limit: number
  setPagination: (pagination: any) => void
  onAction: (userId: string, action: string) => void
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'Gestor'
      case UserRole.COLLABORATOR:
        return 'Colaborador'
      default:
        return role
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'text-purple-700 bg-purple-100'
      case UserRole.COLLABORATOR:
        return 'text-blue-700 bg-blue-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={handleSelectAll}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.size === users.length && users.length > 0
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonTableLine className="h-16" columns={6} key={index} />
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 cursor-pointer">
                  <td
                    onClick={() => handleSelect(user._id)}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td
                    onClick={() => handleSelect(user._id)}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
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
                  <td
                    onClick={() => handleSelect(user._id)}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <Badge
                      label={getRoleLabel(user.role)}
                      className={getRoleColor(user.role)}
                    />
                  </td>
                  <td
                    onClick={() => handleSelect(user._id)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <StatusBadge
                      type="user"
                      status={user.status as UserStatus}
                    />
                  </td>
                  <td
                    onClick={() => handleSelect(user._id)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    -
                  </td>
                  {user.status !== UserStatus.PENDING ? (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          title="Editar"
                          onClick={() => onAction(user._id, 'edit')}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          title="Remover"
                          variant="danger"
                          onClick={() => onAction(user._id, 'remove')}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onAction(user._id, 'cancel-invite')}
                      >
                        Cancelar Convite
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {page * limit + 1} a{' '}
              {Math.min(page * limit + limit, users.length)} de {users.length}{' '}
              resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPagination((prev: any) => ({
                    ...prev,
                    page: prev.page - 1
                  }))
                }
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPagination((prev: any) => ({
                    ...prev,
                    page: prev.page + 1
                  }))
                }
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
