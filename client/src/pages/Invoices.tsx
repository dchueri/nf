import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Button } from '../components/ui/Button'
import { useInvoiceService } from 'services/invoiceService'
import { Invoice, InvoiceStatus } from 'types/invoice'
import { InvoiceTable } from 'components/dashboard/InvoiceTable'
import { useDebounce } from 'hooks/useDebounce'

export const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { page, limit, total, totalPages } = pagination
  const { getInvoices } = useInvoiceService()

  useEffect(() => {
    getInvoices({
      page,
      limit,
      search: debouncedSearchTerm,
      status:
        statusFilter === 'all' ? undefined : (statusFilter as InvoiceStatus)
    }).then((invoices) => {
      setInvoices(invoices.docs)
      setPagination({
        page,
        limit,
        total: invoices.docs.length,
        totalPages: Math.ceil(invoices.docs.length / limit)
      })
    })
  }, [debouncedSearchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="text-gray-600">
            Gerencie todas as notas fiscais da empresa
          </p>
        </div>
        {/* <div className="flex space-x-3">
          <Button variant="secondary">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Nota Fiscal
          </Button>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Número, descrição ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as InvoiceStatus | 'all')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="approved">Aprovada</option>
                <option value="rejected">Rejeitada</option>
                <option value="ignored">Ignorada</option>
                <option value="submitted">Aprovação Pendente</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invoices Table */}
      <InvoiceTable invoices={invoices} />
    </div>
  )
}
