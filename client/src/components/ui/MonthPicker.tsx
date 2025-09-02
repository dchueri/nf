import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Button } from './Button'

interface MonthPickerProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  className?: string
  placeholder?: string
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  selectedMonth,
  onMonthChange,
  className = '',
  placeholder = 'Selecione o mês e ano de referência'
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [currentViewYear, setCurrentViewYear] = useState(() => {
    const [year] = selectedMonth.split('-')
    return parseInt(year)
  })
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Fechar datepicker quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Atualizar ano da visualização quando selectedMonth mudar
  useEffect(() => {
    const [year] = selectedMonth.split('-')
    setCurrentViewYear(parseInt(year))
  }, [selectedMonth])

  const openDatePicker = () => {
    setIsDatePickerOpen(true)
  }

  const selectMonth = (month: number, year: number) => {
    const newMonthString = `${year}-${String(month).padStart(2, '0')}`
    onMonthChange(newMonthString)
    setIsDatePickerOpen(false)
  }

  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const formatMonthDisplay = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ]

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <button
        type="button"
        onClick={openDatePicker}
        className="flex items-center justify-between w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors"
        title={placeholder}
      >
        <span className="text-sm text-gray-900">
          {formatMonthDisplay(selectedMonth)}
        </span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </button>

      {/* Datepicker Dropdown */}
      {isDatePickerOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {/* Header com navegação de ano */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentViewYear(currentViewYear - 1)
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              {currentViewYear}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentViewYear(currentViewYear + 1)
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Grid de meses */}
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const monthNumber = index + 1
                const monthString = `${currentViewYear}-${String(
                  monthNumber
                ).padStart(2, '0')}`
                const isSelected = monthString === selectedMonth
                const isCurrentMonth = monthString === getCurrentMonth()

                return (
                  <button
                    key={month}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectMonth(monthNumber, currentViewYear)
                    }}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-colors
                      ${
                        isSelected
                          ? 'bg-blue-600 text-white font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }
                      ${isCurrentMonth ? 'ring-2 ring-blue-300' : ''}
                    `}
                  >
                    {month}
                    {isCurrentMonth && !isSelected && (
                      <span className="ml-1 text-xs text-blue-600">•</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer com botão para mês atual */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMonthChange(getCurrentMonth())
                setIsDatePickerOpen(false)
              }}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Ir para Mês Atual
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
