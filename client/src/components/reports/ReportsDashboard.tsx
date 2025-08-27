import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentChartBarIcon, DocumentArrowDownIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ReportFilters } from './ReportFilters';
import { FinancialSummary } from './FinancialSummary';
import { AdvancedCharts } from './AdvancedCharts';
import { ExportPanel } from './ExportPanel';
import { ReportFilters as ReportFiltersType, FinancialSummary as FinancialSummaryType, MonthlyReport } from '../../types/reports';
import * as reportsService from '../../services/reportsService';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export const ReportsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: [],
    type: [],
    tags: [],
  });

  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryType | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);

  // Mock data for development
  const mockFinancialSummary: FinancialSummaryType = {
    totalInvoices: 156,
    totalAmount: 125000.50,
    totalPaid: 98000.00,
    totalPending: 27000.50,
    totalOverdue: 5000.00,
    averageInvoiceAmount: 801.28,
    paymentRate: 0.784,
    overdueRate: 0.032
  };

  const mockMonthlyData: MonthlyReport[] = [
    {
      month: '01',
      year: 2024,
      invoices: { total: 45, submitted: 12, approved: 28, rejected: 3, paid: 25, overdue: 2 },
      amounts: { total: 36000, submitted: 9500, approved: 28000, rejected: 3000, paid: 25000, overdue: 2000 },
      trends: { invoiceGrowth: 0.12, amountGrowth: 0.08, paymentEfficiency: 0.89 }
    },
    {
      month: '02',
      year: 2024,
      invoices: { total: 52, submitted: 15, approved: 32, rejected: 2, paid: 30, overdue: 1 },
      amounts: { total: 42000, submitted: 12000, approved: 35000, rejected: 2000, paid: 32000, overdue: 1000 },
      trends: { invoiceGrowth: 0.16, amountGrowth: 0.17, paymentEfficiency: 0.91 }
    },
    {
      month: '03',
      year: 2024,
      invoices: { total: 59, submitted: 18, approved: 35, rejected: 4, paid: 33, overdue: 2 },
      amounts: { total: 47000, submitted: 14000, approved: 40000, rejected: 4000, paid: 36000, overdue: 2000 },
      trends: { invoiceGrowth: 0.13, amountGrowth: 0.12, paymentEfficiency: 0.88 }
    }
  ];

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In development, use mock data
      // In production, this would call the actual API
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFinancialSummary(mockFinancialSummary);
        setMonthlyData(mockMonthlyData);
      } else {
        // Real API calls
        const [summary, monthly] = await Promise.all([
          reportsService.getFinancialSummary(filters),
          reportsService.getMonthlyReport(new Date().getMonth() + 1, new Date().getFullYear())
        ]);
        
        setFinancialSummary(summary);
        setMonthlyData(monthly);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do relatório');
      console.error('Error loading report data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ReportFiltersType) => {
    setFilters(newFilters);
  };

  const handleGenerateReport = () => {
    // This would trigger a new report generation
    loadReportData();
  };

  const handleExport = async (exportOptions: any) => { // Assuming ExportOptions type is not directly imported here
    try {
      // In development, simulate export
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create a mock download
        const blob = new Blob(['Mock report data'], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Real export
        const blob = await reportsService.exportReport('financial', exportOptions);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      throw new Error('Erro ao exportar relatório');
    }
  };

  const refreshData = () => {
    loadReportData();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao Carregar Relatórios</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="primary" onClick={refreshData}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
              <p className="text-sm text-gray-500">
                Análise completa das finanças e performance da empresa
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              <span>Atualizar</span>
            </Button>
            
            <Button
              variant="primary"
              onClick={() => setIsExportPanelOpen(true)}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ReportFilters
            onFiltersChange={handleFiltersChange}
            onGenerateReport={handleGenerateReport}
          />
        </motion.div>

        {/* Financial Summary */}
        {financialSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FinancialSummary
              data={financialSummary}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {/* Advanced Charts */}
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AdvancedCharts
              monthlyData={monthlyData}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do relatório...</p>
          </div>
        )}
      </div>

      {/* Export Panel */}
      <ExportPanel
        isOpen={isExportPanelOpen}
        onClose={() => setIsExportPanelOpen(false)}
        onExport={handleExport}
        currentFilters={filters}
      />
    </div>
  );
};
