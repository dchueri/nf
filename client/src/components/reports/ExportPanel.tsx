import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { ExportOptions, ReportFilters } from '../../types/reports';
import { cn } from '../../utils/cn';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  currentFilters: ReportFilters;
  className?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ 
  isOpen, 
  onClose, 
  onExport,
  currentFilters,
  className 
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    includeCharts: true,
    includeDetails: true,
    dateRange: 'custom',
    filters: currentFilters
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [exportMessage, setExportMessage] = useState('');

  const formatOptions = [
    { id: 'excel', label: 'Excel (.xlsx)', icon: TableCellsIcon, description: 'Planilha com formatação e gráficos' },
    { id: 'csv', label: 'CSV (.csv)', icon: DocumentTextIcon, description: 'Dados em formato de texto simples' },
    { id: 'pdf', label: 'PDF (.pdf)', icon: DocumentChartBarIcon, description: 'Relatório formatado para impressão' }
  ];

  const dateRangeOptions = [
    { id: 'last7days', label: 'Últimos 7 dias' },
    { id: 'last30days', label: 'Últimos 30 dias' },
    { id: 'thisMonth', label: 'Este mês' },
    { id: 'lastMonth', label: 'Mês passado' },
    { id: 'thisYear', label: 'Este ano' },
    { id: 'custom', label: 'Período personalizado' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('exporting');
    setExportMessage('Preparando relatório...');

    try {
      await onExport(exportOptions);
      setExportStatus('success');
      setExportMessage('Relatório exportado com sucesso!');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setExportStatus('idle');
        setExportMessage('');
      }, 2000);
    } catch (error) {
      setExportStatus('error');
      setExportMessage(error instanceof Error ? error.message : 'Erro ao exportar relatório');
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'exporting':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentArrowDownIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (exportStatus) {
      case 'exporting':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <DocumentArrowDownIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Exportar Relatório</h3>
                <p className="text-sm text-gray-500">Configure as opções de exportação</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Formato de Exportação
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formatOptions.map((format) => (
                  <label
                    key={format.id}
                    className={cn(
                      'relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50',
                      exportOptions.format === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={exportOptions.format === format.id}
                      onChange={(e) => updateExportOptions('format', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center text-center">
                      <format.icon className={cn(
                        'h-8 w-8 mb-2',
                        exportOptions.format === format.id ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <span className={cn(
                        'text-sm font-medium',
                        exportOptions.format === format.id ? 'text-blue-900' : 'text-gray-900'
                      )}>
                        {format.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {format.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Período do Relatório
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dateRangeOptions.map((range) => (
                  <label
                    key={range.id}
                    className={cn(
                      'relative flex cursor-pointer rounded-lg border p-3 hover:bg-gray-50',
                      exportOptions.dateRange === range.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="dateRange"
                      value={range.id}
                      checked={exportOptions.dateRange === range.id}
                      onChange={(e) => updateExportOptions('dateRange', e.target.value)}
                      className="sr-only"
                    />
                    <span className={cn(
                      'text-sm font-medium text-center w-full',
                      exportOptions.dateRange === range.id ? 'text-blue-900' : 'text-gray-900'
                    )}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Opções de Conteúdo
              </label>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => updateExportOptions('includeCharts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Incluir gráficos e visualizações
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeDetails}
                    onChange={(e) => updateExportOptions('includeDetails', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Incluir detalhes das invoices
                  </span>
                </label>
              </div>
            </div>

            {/* Current Filters Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Filtros Aplicados</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Período: {exportOptions.filters.startDate} a {exportOptions.filters.endDate}</div>
                {exportOptions.filters.status && exportOptions.filters.status.length > 0 && (
                  <div>Status: {exportOptions.filters.status.join(', ')}</div>
                )}
                {exportOptions.filters.type && exportOptions.filters.type.length > 0 && (
                  <div>Tipo: {exportOptions.filters.type.join(', ')}</div>
                )}
                {exportOptions.filters.minAmount && (
                  <div>Valor mínimo: R$ {exportOptions.filters.minAmount}</div>
                )}
                {exportOptions.filters.maxAmount && (
                  <div>Valor máximo: R$ {exportOptions.filters.maxAmount}</div>
                )}
              </div>
            </div>

            {/* Export Status */}
            {exportStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
              >
                {getStatusIcon()}
                <span className={cn('text-sm font-medium', getStatusColor())}>
                  {exportMessage}
                </span>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
