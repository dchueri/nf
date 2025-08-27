import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { FinancialSummary as FinancialSummaryType } from '../../types/reports';
import { cn } from '../../utils/cn';

interface FinancialSummaryProps {
  data: FinancialSummaryType;
  className?: string;
  isLoading?: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ 
  data, 
  className,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getStatusColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case 'negative':
        return <ArrowTrendingDownIcon className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const summaryCards = [
    {
      title: 'Total de Invoices',
      value: data.totalInvoices.toLocaleString('pt-BR'),
      change: `${data.totalInvoices > 0 ? '+' : ''}${data.totalInvoices}`,
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Valor Total',
      value: formatCurrency(data.totalAmount),
      change: `${data.totalAmount > 0 ? '+' : ''}${formatCurrency(data.totalAmount)}`,
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Valor Pendente',
      value: formatCurrency(data.totalPending),
      change: `${data.totalPending > 0 ? '+' : ''}${formatCurrency(data.totalPending)}`,
      changeType: (data.totalPending > 0 ? 'negative' : 'positive') as 'positive' | 'negative' | 'neutral',
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Valor em Atraso',
      value: formatCurrency(data.totalOverdue),
      change: `${data.totalOverdue > 0 ? '+' : ''}${formatCurrency(data.totalOverdue)}`,
      changeType: (data.totalOverdue > 0 ? 'negative' : 'positive') as 'positive' | 'negative' | 'neutral',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const metrics = [
    {
      label: 'Valor Médio por Invoice',
      value: formatCurrency(data.averageInvoiceAmount),
      description: 'Média dos valores das invoices'
    },
    {
      label: 'Taxa de Pagamento',
      value: formatPercentage(data.paymentRate),
      description: 'Percentual de invoices pagas'
    },
    {
      label: 'Taxa de Atraso',
      value: formatPercentage(data.overdueRate),
      description: 'Percentual de invoices em atraso'
    }
  ];

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h3>
          <p className="text-sm text-gray-500">Visão geral das finanças e métricas de pagamento</p>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-600 font-medium">Atualizado</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-4 rounded-lg border-2',
              card.bgColor,
              card.borderColor
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className={cn('h-6 w-6', card.color)} />
              <div className={cn(
                'flex items-center space-x-1 text-xs font-medium',
                getStatusColor(card.changeType)
              )}>
                {getStatusIcon(card.changeType)}
                <span>{card.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            <div className="text-sm text-gray-600">
              {card.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metric.value}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              {metric.label}
            </div>
            <div className="text-xs text-gray-500">
              {metric.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Insights</h4>
        <div className="space-y-2">
          {data.totalOverdue > 0 && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span>
                <strong>{formatCurrency(data.totalOverdue)}</strong> em invoices em atraso
              </span>
            </div>
          )}
          {data.paymentRate > 0.8 && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span>
                Excelente taxa de pagamento de <strong>{formatPercentage(data.paymentRate)}</strong>
              </span>
            </div>
          )}
          {data.averageInvoiceAmount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>
                Valor médio por invoice: <strong>{formatCurrency(data.averageInvoiceAmount)}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
