import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserFilters } from './UserFilters'

describe('UserFilters', () => {
  const mockOnFilterChange = jest.fn()

  beforeEach(() => {
    mockOnFilterChange.mockClear()
  })

  it('renders all filter options', () => {
    render(
      <UserFilters
        selectedFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    )

    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Não Enviadas')).toBeInTheDocument()
    expect(screen.getByText('Em Análise')).toBeInTheDocument()
    expect(screen.getByText('Aprovadas')).toBeInTheDocument()
    expect(screen.getByText('Rejeitadas')).toBeInTheDocument()
  })

  it('calls onFilterChange when filter is clicked', () => {
    render(
      <UserFilters
        selectedFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    )

    const approvedButton = screen.getByText('Aprovadas')
    fireEvent.click(approvedButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith('approved')
  })

  it('highlights selected filter', () => {
    render(
      <UserFilters
        selectedFilter="approved"
        onFilterChange={mockOnFilterChange}
      />
    )

    const approvedButton = screen.getByText('Aprovadas')
    expect(approvedButton).toHaveClass('bg-blue-600')
  })
})
