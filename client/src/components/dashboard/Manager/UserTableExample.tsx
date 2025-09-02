import React, { useState } from 'react'
import { UserTable } from './UserTable'
import { UserFilters, UserFilterType } from './UserFilters'
import { User } from '../../../types/user'
import { InvoiceStatus } from '../../../types/invoice'

// Exemplo de como usar a tabela de usuários em outro contexto
export const UserTableExample: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<UserFilterType>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01')

  // Mock data para exemplo
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      department: 'TI',
      monthsWithInvoices: [
        {
          month: '2024-01',
          status: InvoiceStatus.APPROVED,
          amount: 5000,
          submittedAt: '2024-01-15'
        }
      ],
      submittedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      department: 'Marketing',
      monthsWithInvoices: [
        {
          month: '2024-01',
          status: InvoiceStatus.PENDING,
          amount: 4500,
          submittedAt: '2024-01-10'
        }
      ],
      submittedAt: '2024-01-10'
    }
  ]

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Ação ${action} para usuário ${userId}`)
    // Implementar lógica específica aqui
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exemplo de Uso da Tabela de Usuários</h1>
      
      <UserFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <UserTable
        users={mockUsers}
        selectedMonth={selectedMonth}
        selectedFilter={selectedFilter}
        onUserAction={handleUserAction}
      />
    </div>
  )
}
