import React, { useState } from 'react'
import { UserTable } from './UserTable'
import { UserFilters, UserFilterType } from './UserFilters'
import { User, UserRole, UserStatus } from '../../../types/user'
import { InvoiceStatus } from '../../../types/invoice'

// Exemplo de como usar a tabela de usuários em outro contexto
export const UserTableExample: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<UserFilterType>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01')

  // Mock data para exemplo
  const mockUsers: User[] = [
    {
      _id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      companyId: 'company-1',
      department: 'TI',
      monthsWithInvoices: [
        {
          month: '2024-01',
          status: InvoiceStatus.APPROVED,
          amount: 5000,
          invoices: 1,
          submittedAt: '2024-01-15'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      companyId: 'company-1',
      department: 'Marketing',
      monthsWithInvoices: [
        {
          month: '2024-01',
          status: InvoiceStatus.PENDING,
          amount: 4500,
          invoices: 1,
          submittedAt: '2024-01-10'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
