import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MonthPicker } from './MonthPicker'

describe('MonthPicker', () => {
  const mockOnMonthChange = jest.fn()

  beforeEach(() => {
    mockOnMonthChange.mockClear()
  })

  it('renders with selected month', () => {
    render(
      <MonthPicker
        selectedMonth="2024-01"
        onMonthChange={mockOnMonthChange}
      />
    )

    expect(screen.getByText('janeiro de 2024')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    render(
      <MonthPicker
        selectedMonth="2024-01"
        onMonthChange={mockOnMonthChange}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('Jan')).toBeInTheDocument()
  })

  it('calls onMonthChange when month is selected', () => {
    render(
      <MonthPicker
        selectedMonth="2024-01"
        onMonthChange={mockOnMonthChange}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const marchButton = screen.getByText('Mar')
    fireEvent.click(marchButton)

    expect(mockOnMonthChange).toHaveBeenCalledWith('2024-03')
  })

  it('navigates between years', () => {
    render(
      <MonthPicker
        selectedMonth="2024-01"
        onMonthChange={mockOnMonthChange}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const prevYearButton = screen.getByLabelText('Previous year')
    fireEvent.click(prevYearButton)

    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('goes to current month when "Ir para Mês Atual" is clicked', () => {
    const currentDate = new Date()
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

    render(
      <MonthPicker
        selectedMonth="2024-01"
        onMonthChange={mockOnMonthChange}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const currentMonthButton = screen.getByText('Ir para Mês Atual')
    fireEvent.click(currentMonthButton)

    expect(mockOnMonthChange).toHaveBeenCalledWith(currentMonth)
  })
})
