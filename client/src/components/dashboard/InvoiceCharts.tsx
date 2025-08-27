import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { InvoiceStatus } from '../../types/invoice';
import { cn } from '../../utils/cn';

interface InvoiceChartsProps {
  className?: string;
}

// Dados mockados para demonstração
const statusData = [
  { name: 'Pendente', value: 12, color: '#FCD34D', status: InvoiceStatus.PENDING },
  { name: 'Enviada', value: 8, color: '#3B82F6', status: InvoiceStatus.SUBMITTED },
  { name: 'Aprovada', value: 25, color: '#10B981', status: InvoiceStatus.APPROVED },
  { name: 'Rejeitada', value: 3, color: '#EF4444', status: InvoiceStatus.REJECTED },
  { name: 'Paga', value: 18, color: '#8B5CF6', status: InvoiceStatus.PAID },
];

const monthlyData = [
  { month: 'Jan', invoices: 45, amount: 125000 },
  { month: 'Fev', invoices: 52, amount: 138000 },
  { month: 'Mar', invoices: 48, amount: 132000 },
  { month: 'Abr', invoices: 61, amount: 165000 },
  { month: 'Mai', invoices: 55, amount: 148000 },
  { month: 'Jun', invoices: 67, amount: 182000 },
];

const weeklyData = [
  { week: 'Sem 1', invoices: 12, amount: 32000 },
  { week: 'Sem 2', invoices: 15, amount: 41000 },
  { week: 'Sem 3', invoices: 18, amount: 48000 },
  { week: 'Sem 4', invoices: 22, amount: 61000 },
];

export const InvoiceCharts: React.FC<InvoiceChartsProps> = ({ className }) => {
  const totalInvoices = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Status
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `${label}: ${((statusData.find(item => item.name === label)?.value || 0) / totalInvoices * 100).toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {statusData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((item.value / totalInvoices) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendência Mensal
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'amount' ? `R$ ${(value as number).toLocaleString()}` : value,
                name === 'amount' ? 'Valor Total' : 'Quantidade'
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Bar 
              dataKey="invoices" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              name="Quantidade"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendência Semanal
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="week" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'amount' ? `R$ ${(value as number).toLocaleString()}` : value,
                name === 'amount' ? 'Valor Total' : 'Quantidade'
              ]}
              labelFormatter={(label) => `Semana: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="invoices" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              name="Quantidade"
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name="Valor Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
