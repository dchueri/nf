import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserTable } from './UserTable'
import { User } from '../../../types/user'
import { InvoiceStatus } from '../../../types/invoice'

const mockUser: User = {
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
}

describe('UserTable', () => {
  const mockOnUserAction = jest.fn()

  beforeEach(() => {
    mockOnUserAction.mockClear()
  })

  it('renders user table with headers', () => {
    render(
      <UserTable
        users={[mockUser]}
        selectedMonth="2024-01"
        selectedFilter="all"
        onUserAction={mockOnUserAction}
      />
    )

    expect(screen.getByText('Usuário')).toBeInTheDocument()
    expect(screen.getByText('Departamento')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Prazo')).toBeInTheDocument()
    expect(screen.getByText('Data Envio')).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    render(
      <UserTable
        users={[mockUser]}
        selectedMonth="2024-01"
        selectedFilter="all"
        onUserAction={mockOnUserAction}
      />
    )

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
    expect(screen.getByText('TI')).toBeInTheDocument()
  })

  it('calls onUserAction when action button is clicked', () => {
    render(
      <UserTable
        users={[mockUser]}
        selectedMonth="2024-01"
        selectedFilter="all"
        onUserAction={mockOnUserAction}
      />
    )

    const detailsButton = screen.getByText('Ver Detalhes')
    fireEvent.click(detailsButton)

    expect(mockOnUserAction).toHaveBeenCalledWith('1', 'details')
  })

  it('shows empty state when no users', () => {
    render(
      <UserTable
        users={[]}
        selectedMonth="2024-01"
        selectedFilter="all"
        onUserAction={mockOnUserAction}
      />
    )

    expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument()
    expect(screen.getByText('Tente ajustar os filtros de busca.')).toBeInTheDocument()
  })

  it('displays correct month in title', () => {
    render(
      <UserTable
        users={[mockUser]}
        selectedMonth="2024-01"
        selectedFilter="all"
        onUserAction={mockOnUserAction}
      />
    )

    expect(screen.getByText(/janeiro de 2024/)).toBeInTheDocument()
  })
})
