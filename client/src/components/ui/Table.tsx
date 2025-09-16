import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  className?: string
  headerClassName?: string
}

export interface TableProps<T = any> {
  title?: string
  subtitle?: string
  data: T[]
  columns: TableColumn<T>[]
  renderCell: (
    item: T,
    column: TableColumn<T>,
    index: number
  ) => React.ReactNode
  onRowClick?: (item: T, index: number) => void
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description: string
  }
  className?: string
  rowClassName?: string | ((item: T, index: number) => string)
  sortable?: boolean
  defaultSortField?: string
  defaultSortDirection?: 'asc' | 'desc'
  // Pagination props
  pagination?: {
    enabled: boolean
    pageSize?: number
    showSizeSelector?: boolean
    pageSizeOptions?: number[]
    showPageInfo?: boolean
    showNavigation?: boolean
  }
}

type SortDirection = 'asc' | 'desc'

export const Table = <T extends Record<string, any>>({
  title,
  subtitle,
  data,
  columns,
  renderCell,
  onRowClick,
  emptyState,
  className = '',
  rowClassName = '',
  sortable = false,
  defaultSortField,
  defaultSortDirection = 'desc',
  pagination = { enabled: false }
}: TableProps<T>) => {
  const [sortField, setSortField] = useState<string>(
    defaultSortField || columns[0]?.key || ''
  )
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10)

  const handleSort = (field: string) => {
    if (!sortable) return

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortable) return 0

    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    }

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    }

    // Fallback
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = pagination.enabled
    ? sortedData.slice(startIndex, endIndex)
    : sortedData

  // Reset to first page when page size changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [pageSize])

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  const getSortIcon = (field: string) => {
    if (!sortable || sortField !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-blue-600" />
    )
  }

  const getRowClassName = (item: T, index: number) => {
    const baseClass = 'hover:bg-gray-50'
    const customClass =
      typeof rowClassName === 'function'
        ? rowClassName(item, index)
        : rowClassName

    return `${baseClass} ${customClass}`
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            )}
            {subtitle && (
              <div className="text-sm text-gray-500">{subtitle}</div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.headerClassName || ''
                  } ${
                    column.sortable !== false && sortable
                      ? 'cursor-pointer hover:bg-gray-100'
                      : ''
                  }`}
                  onClick={() =>
                    column.sortable !== false &&
                    sortable &&
                    handleSort(column.key)
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable !== false && sortable && (
                      <span className="flex-shrink-0">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={getRowClassName(item, index)}
                onClick={() => onRowClick?.(item, startIndex + index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap ${
                      column.className || ''
                    }`}
                  >
                    {renderCell(item, column, startIndex + index)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && emptyState && (
        <div className="text-center py-12">
          {emptyState.icon && (
            <div className="mx-auto h-12 w-12 text-gray-400">
              {emptyState.icon}
            </div>
          )}
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {emptyState.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{emptyState.description}</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.enabled && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Page size selector */}
            {pagination.showSizeSelector !== false && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Mostrar:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(pagination.pageSizeOptions || [5, 10, 20, 50]).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    )
                  )}
                </select>
                <span className="text-sm text-gray-700">por página</span>
              </div>
            )}

            {/* Page info */}
            {pagination.showPageInfo !== false && (
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a{' '}
                {Math.min(endIndex, sortedData.length)} de {sortedData.length}{' '}
                resultados
              </div>
            )}

            {/* Navigation */}
            {pagination.showNavigation !== false && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
