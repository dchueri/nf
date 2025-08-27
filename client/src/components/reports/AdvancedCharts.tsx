import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  ChartBarIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { ChartData, MonthlyReport } from '../../types/reports';
import { cn } from '../../utils/cn';

interface AdvancedChartsProps {
  monthlyData: MonthlyReport[];
  className?: string;
  isLoading?: boolean;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ 
  monthlyData, 
  className,
  isLoading = false 
}) => {
  const [activeCharts, setActiveCharts] = useState<Set<string>>(new Set(['trends', 'status', 'types']));
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  const toggleChart = (chartId: string) => {
    const newActiveCharts = new Set(activeCharts);
    if (newActiveCharts.has(chartId)) {
      newActiveCharts.delete(chartId);
    } else {
      newActiveCharts.add(chartId);
    }
    setActiveCharts(newActiveCharts);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatMonth = (month: string) => {
    const months: { [key: string]: string } = {
      '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
      '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
      '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
    };
    return months[month] || month;
  };

  // Preparar dados para os gráficos
  const trendsData = monthlyData.map(item => ({
    month: formatMonth(item.month),
    invoices: item.invoices.total,
    amount: item.amounts.total,
    growth: item.trends.invoiceGrowth
  }));

  const statusData = monthlyData.flatMap(item => [
    { month: formatMonth(item.month), status: 'Pendente', value: item.invoices.submitted },
    { month: formatMonth(item.month), status: 'Aprovada', value: item.invoices.approved },
    { month: formatMonth(item.month), status: 'Rejeitada', value: item.invoices.rejected },
    { month: formatMonth(item.month), status: 'Paga', value: item.invoices.paid }
  ]);

  const typeData = monthlyData.flatMap(item => [
    { month: formatMonth(item.month), type: 'Nota Fiscal', value: item.invoices.total * 0.7 },
    { month: formatMonth(item.month), type: 'Recibo', value: item.invoices.total * 0.2 },
    { month: formatMonth(item.month), type: 'Outro', value: item.invoices.total * 0.1 }
  ]);

  const pieData = [
    { name: 'Pendente', value: monthlyData.reduce((sum, item) => sum + item.invoices.submitted, 0), color: '#F59E0B' },
    { name: 'Aprovada', value: monthlyData.reduce((sum, item) => sum + item.invoices.approved, 0), color: '#10B981' },
    { name: 'Rejeitada', value: monthlyData.reduce((sum, item) => sum + item.invoices.rejected, 0), color: '#EF4444' },
    { name: 'Paga', value: monthlyData.reduce((sum, item) => sum + item.invoices.paid, 0), color: '#3B82F6' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Análises e Gráficos</h3>
          <p className="text-sm text-gray-500">Visualizações interativas dos dados financeiros</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tipo:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'bar', icon: ChartBarIcon, label: 'Barras' },
                { id: 'line', icon: ArrowTrendingUpIcon, label: 'Linha' },
                { id: 'area', icon: ChartBarSquareIcon, label: 'Área' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id as 'bar' | 'line' | 'area')}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    chartType === type.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Gráficos:</span>
            <div className="flex space-x-1">
              {[
                { id: 'trends', label: 'Tendências', icon: ArrowTrendingUpIcon },
                { id: 'status', label: 'Status', icon: ChartBarIcon },
                { id: 'types', label: 'Tipos', icon: ChartPieIcon }
              ].map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => toggleChart(chart.id)}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    activeCharts.has(chart.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                  )}
                  title={chart.label}
                >
                  <chart.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        {activeCharts.has('trends') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Tendências Mensais</h4>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'amount' ? formatCurrency(value) : value,
                      name === 'amount' ? 'Valor' : name === 'invoices' ? 'Invoices' : 'Crescimento'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="invoices" fill="#3B82F6" name="Invoices" />
                  <Bar dataKey="amount" fill="#10B981" name="Valor" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'amount' ? formatCurrency(value) : value,
                      name === 'amount' ? 'Valor' : name === 'invoices' ? 'Invoices' : 'Crescimento'
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="invoices" stroke="#3B82F6" strokeWidth={2} name="Invoices" />
                  <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} name="Valor" />
                </LineChart>
              ) : (
                <AreaChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'amount' ? formatCurrency(value) : value,
                      name === 'amount' ? 'Valor' : name === 'invoices' ? 'Invoices' : 'Crescimento'
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="invoices" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} name="Invoices" />
                  <Area type="monotone" dataKey="amount" fill="#10B981" stroke="#10B981" fillOpacity={0.3} name="Valor" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Status Distribution Chart */}
        {activeCharts.has('status') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Distribuição por Status</h4>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pendente" fill="#F59E0B" />
                  <Bar dataKey="Aprovada" fill="#10B981" />
                  <Bar dataKey="Rejeitada" fill="#EF4444" />
                  <Bar dataKey="Paga" fill="#3B82F6" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Pendente" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="Aprovada" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Rejeitada" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Paga" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              ) : (
                <AreaChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Pendente" fill="#F59E0B" stroke="#F59E0B" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Aprovada" fill="#10B981" stroke="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Rejeitada" fill="#EF4444" stroke="#EF4444" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Paga" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Types Chart */}
        {activeCharts.has('types') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Distribuição por Tipo</h4>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Nota Fiscal" fill="#3B82F6" />
                  <Bar dataKey="Recibo" fill="#10B981" />
                  <Bar dataKey="Outro" fill="#8B5CF6" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Nota Fiscal" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Recibo" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Outro" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              ) : (
                <AreaChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Nota Fiscal" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Recibo" fill="#10B981" stroke="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Outro" fill="#8B5CF6" stroke="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Pie Chart - Always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 rounded-lg p-4 lg:col-span-2"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Distribuição Geral por Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};
