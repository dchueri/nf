import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { UserRole, UserStatus } from '../../types/user'
import { UserSearchFilters } from '../../types/team'

interface UserFiltersProps {
  showFilters: boolean
  setShowFilters: (showFilters: boolean) => void
  filters: UserSearchFilters
  setFilters: (filters: any) => void
}

export const UserFilters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters
}: UserFiltersProps) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{
            height: 'auto',
            opacity: 1,
            y: 0,
            transition: {
              height: { duration: 0.3, ease: 'easeOut' },
              opacity: { duration: 0.2, delay: 0.1 },
              y: { duration: 0.3, ease: 'easeOut' }
            }
          }}
          exit={{
            height: 0,
            opacity: 0,
            y: -20,
            transition: {
              height: { duration: 0.2, ease: 'easeIn' },
              opacity: { duration: 0.1 },
              y: { duration: 0.2, ease: 'easeIn' }
            }
          }}
          className="px-6 py-4 border-b border-gray-200 bg-gray-50 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    status: e.target.value ? [e.target.value] : undefined
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value={UserStatus.ACTIVE}>Ativo</option>
                <option value={UserStatus.SUSPENDED}>Suspenso</option>
                <option value={UserStatus.PENDING}>Pendente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função
              </label>
              <select
                value={filters.role?.[0] || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    role: e.target.value ? [e.target.value] : undefined
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value={UserRole.MANAGER}>Gestor</option>
                <option value={UserRole.COLLABORATOR}>Colaborador</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({})}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
