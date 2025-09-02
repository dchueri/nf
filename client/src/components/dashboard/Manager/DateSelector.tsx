import { Button } from '../../ui/Button'
import { MonthPicker } from '../../ui/MonthPicker'
import dayjs from 'dayjs'

export const DateSelector = ({
  selectedMonth,
  setSelectedMonth,
  navigateMonth
}: {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  navigateMonth: (direction: 'prev' | 'next') => void
}) => {
  const CURRENT_MONTH_SELECTOR = dayjs().format('YYYY-MM')
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Mês de Referência
          </h3>
          <p className="text-sm text-gray-600">
            Filtre os dados por mês específico
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="px-2"
              title="Mês anterior"
            >
              ←
            </Button>

            <MonthPicker
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="px-2"
              title="Próximo mês"
            >
              →
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMonth(CURRENT_MONTH_SELECTOR)}
          >
            Mês Atual
          </Button>
        </div>
      </div>
    </div>
  )
}
