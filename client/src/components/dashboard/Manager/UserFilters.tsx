import React from 'react'
import { Button } from '../../ui/Button'

export type UserFilterType = 'all' | 'pending' | 'approved' | 'rejected' | 'not_submitted'

interface UserFiltersProps {
  selectedFilter: UserFilterType
  onFilterChange: (filter: UserFilterType) => void
  className?: string
}

const filterOptions = [
  { key: 'all', label: 'Todos' },
  { key: 'not_submitted', label: 'Não Enviadas' },
  { key: 'pending', label: 'Em Análise' },
  { key: 'approved', label: 'Aprovadas' },
  { key: 'rejected', label: 'Rejeitadas' }
] as const

export const UserFilters: React.FC<UserFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          Filtrar por status:
        </span>
        <div className="flex space-x-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.key}
              variant={
                selectedFilter === filter.key ? 'default' : 'secondary'
              }
              size="sm"
              onClick={() => onFilterChange(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
