import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'
import { BulkUserOperation } from 'types/team'
import { User, UserStatus } from 'types/user'
export const UserActions = ({
  searchQuery,
  setSearchQuery,
  selectedUsers,
  handleBulkOperation,
  handleSelectAll,
  users
}: {
  searchQuery: string
  setSearchQuery: (searchQuery: string) => void
  selectedUsers: Set<string>
  handleBulkOperation: (operation: BulkUserOperation['operation'], usersSet?: Set<string>) => void
  handleSelectAll: () => void
  users: User[]
}) => {
  const usersNumber = users.length

  let canSuspendAllSelectedUsers = true
  selectedUsers.forEach((userId) => {
    if (
      users.find((user) => user._id === userId)?.status !== UserStatus.ACTIVE
    ) {
      canSuspendAllSelectedUsers = false
    }
  })

  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {selectedUsers.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.size} selecionado
                {selectedUsers.size !== 1 ? 's' : ''}
              </span>
              {canSuspendAllSelectedUsers && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkOperation('suspend')}
                >
                  Suspender
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleBulkOperation('remove')}
              >
                Remover
              </Button>
            </div>
          )}
        </div>

        <Button variant="secondary" size="sm" onClick={() => handleSelectAll()}>
          {selectedUsers.size === usersNumber
            ? 'Desmarcar Todos'
            : 'Selecionar Todos'}
        </Button>
      </div>
    </div>
  )
}
