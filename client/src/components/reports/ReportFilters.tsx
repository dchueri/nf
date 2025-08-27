import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { ReportFilters as ReportFiltersType } from '../../types/reports';
import { cn } from '../../utils/cn';

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFiltersType) => void;
  onGenerateReport: () => void;
  className?: string;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ 
  onFiltersChange, 
  onGenerateReport,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: [],
    type: [],
    tags: [],
  });

  const handleFilterChange = (key: keyof ReportFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    handleFilterChange('status', newStatuses);
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('type', newTypes);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters: ReportFiltersType = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: [],
      type: [],
      tags: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = (filters.status && filters.status.length > 0) ||
    (filters.type && filters.type.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    filters.minAmount ||
    filters.maxAmount;

  const presetRanges = [
    { label: 'Últimos 7 dias', start: 7, end: 0 },
    { label: 'Últimos 30 dias', start: 30, end: 0 },
    { label: 'Este mês', start: 0, end: 0, currentMonth: true },
    { label: 'Mês passado', start: 30, end: 30, previousMonth: true },
    { label: 'Este ano', start: 0, end: 0, currentYear: true },
  ];

  const applyPresetRange = (preset: typeof presetRanges[0]) => {
    const end = new Date();
    let start = new Date();

    if (preset.currentMonth) {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (preset.previousMonth) {
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end.setDate(0);
    } else if (preset.currentYear) {
      start = new Date(end.getFullYear(), 0, 1);
    } else {
      start.setDate(end.getDate() - preset.start);
    }

    const newFilters = {
      ...filters,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FunnelIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtros do Relatório</h3>
            <p className="text-sm text-gray-500">Configure os parâmetros para gerar relatórios personalizados</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Limpar Filtros
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onGenerateReport}
            className="px-6"
          >
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Data Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Data Inicial
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="h-4 w-4 inline mr-2" />
            Data Final
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Valor Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CurrencyDollarIcon className="h-4 w-4 inline mr-2" />
            Valor Mínimo
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={filters.minAmount || ''}
            onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Valor Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CurrencyDollarIcon className="h-4 w-4 inline mr-2" />
            Valor Máximo
          </label>
          <input
            type="number"
            placeholder="999999.99"
            value={filters.maxAmount || ''}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Ranges Pré-definidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ranges de Data Rápidos
        </label>
        <div className="flex flex-wrap gap-2">
          {presetRanges.map((preset, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              onClick={() => applyPresetRange(preset)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Filtros Avançados</span>
          {isExpanded ? (
            <XMarkIcon className="h-4 w-4" />
          ) : (
            <FunnelIcon className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status das Invoices
                  </label>
                  <div className="space-y-2">
                    {['pending', 'submitted', 'approved', 'rejected', 'paid'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes(status) || false}
                          onChange={() => handleStatusToggle(status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status === 'pending' && 'Pendente'}
                          {status === 'submitted' && 'Enviada'}
                          {status === 'approved' && 'Aprovada'}
                          {status === 'rejected' && 'Rejeitada'}
                          {status === 'paid' && 'Paga'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Documento
                  </label>
                  <div className="space-y-2">
                    {['invoice', 'receipt', 'other'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type?.includes(type) || false}
                          onChange={() => handleTypeToggle(type)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {type === 'invoice' && 'Nota Fiscal'}
                          {type === 'receipt' && 'Recibo'}
                          {type === 'other' && 'Outro'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <TagIcon className="h-4 w-4 inline mr-2" />
                    Tags
                  </label>
                  <div className="space-y-2">
                    {['consultoria', 'desenvolvimento', 'manutenção', 'marketing', 'vendas'].map((tag) => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.tags?.includes(tag) || false}
                          onChange={() => handleTagToggle(tag)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
