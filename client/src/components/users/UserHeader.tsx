import { Button } from '../ui/Button'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { User } from '../../types/user'

export const UserHeader = ({
  users,
  showFilters,
  setShowFilters,
  setIsInviteUserModalOpen
}: {
  users: User[]
  showFilters: boolean
  setShowFilters: (showFilters: boolean) => void
  setIsInviteUserModalOpen: (isInviteUserModalOpen: boolean) => void
}) => {
  const usersPlural = users.length === 1 ? 'usuário' : 'usuários'
  const foundPlural = users.length === 1 ? 'encontrado' : 'encontrados'
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Gerenciamento de Usuários
          </h2>
          <p className="text-sm text-gray-500">
            {users.length} {usersPlural} {foundPlural}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filtros</span>
          </Button>

          <Button variant="primary" className="flex items-center space-x-2" onClick={() => setIsInviteUserModalOpen(true)}>
            <UserPlusIcon className="h-4 w-4" />
            <span>Convidar Usuário</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
