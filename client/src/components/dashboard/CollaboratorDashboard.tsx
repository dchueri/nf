import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';

interface Invoice {
  id: string;
  month: string;
  year: number;
  status: 'approved' | 'rejected' | 'pending' | 'not_submitted';
  amount: number;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export const CollaboratorDashboard: React.FC = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Mock data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const invoices: Invoice[] = [
    {
      id: '1',
      month: 'Dezembro',
      year: 2023,
      status: 'approved',
      amount: 5000,
      submittedAt: '2023-12-15',
      approvedAt: '2023-12-18',
    },
    {
      id: '2',
      month: 'Novembro',
      year: 2023,
      status: 'approved',
      amount: 4800,
      submittedAt: '2023-11-14',
      approvedAt: '2023-11-17',
    },
    {
      id: '3',
      month: 'Outubro',
      year: 2023,
      status: 'rejected',
      amount: 5200,
      submittedAt: '2023-10-13',
      rejectedAt: '2023-10-16',
      rejectionReason: 'Valor acima do limite permitido',
    },
  ];

  const currentInvoice = invoices.find(inv => 
    inv.month === monthNames[currentMonth] && inv.year === currentYear
  );

  const stats = {
    totalSubmitted: invoices.filter(inv => inv.status !== 'not_submitted').length,
    approved: invoices.filter(inv => inv.status === 'approved').length,
    rejected: invoices.filter(inv => inv.status === 'rejected').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    totalAmount: invoices.filter(inv => inv.status === 'approved').reduce((sum, inv) => sum + inv.amount, 0),
    averageAmount: invoices.filter(inv => inv.status === 'approved').length > 0 
      ? invoices.filter(inv => inv.status === 'approved').reduce((sum, inv) => sum + inv.amount, 0) / invoices.filter(inv => inv.status === 'approved').length
      : 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'not_submitted':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      case 'pending':
        return 'Em Análise';
      case 'not_submitted':
        return 'Não Enviada';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(currentYear, currentMonth + 1, 0); // Last day of current month
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysUntilDeadline = getDaysUntilDeadline();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Colaborador</h1>
        <p className="text-gray-600">Gerencie suas notas fiscais mensais</p>
        </div>
        <Button onClick={() => setShowInvoiceForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Enviar Nota Fiscal
        </Button>
      </div>

      {/* Current Month Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          📝 Nota Fiscal de {monthNames[currentMonth]} de {currentYear}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {currentInvoice ? getStatusIcon(currentInvoice.status) : <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />}
            </div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentInvoice ? getStatusLabel(currentInvoice.status) : 'Não Enviada'}
            </p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {daysUntilDeadline}
            </div>
            <p className="text-sm font-medium text-gray-600">Dias Restantes</p>
            <p className="text-lg font-semibold text-gray-900">
              {daysUntilDeadline === 0 ? 'Prazo vencido!' : 'Para envio'}
            </p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {currentInvoice?.amount ? formatCurrency(currentInvoice.amount) : '-'}
            </div>
            <p className="text-sm font-medium text-gray-600">Valor</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentInvoice?.amount ? 'Enviado' : 'Não definido'}
            </p>
          </div>
        </div>

        {!currentInvoice && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Você ainda não enviou a nota fiscal deste mês.
            </p>
            <Button onClick={() => setShowInvoiceForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Enviar Nota Fiscal
            </Button>
          </div>
        )}

        {currentInvoice?.status === 'rejected' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Motivo da Rejeição:</h4>
            <p className="text-sm text-red-700">{currentInvoice.rejectionReason}</p>
            <div className="mt-3">
              <Button variant="secondary" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Reenviar Corrigida
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enviado</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubmitted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Aprovado</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Média Mensal</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.averageAmount)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            📋 Minhas Notas Fiscais ({invoices.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês/Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Resposta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.month} {invoice.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.submittedAt ? formatDate(invoice.submittedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.approvedAt ? formatDate(invoice.approvedAt) : 
                     invoice.rejectedAt ? formatDate(invoice.rejectedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm">
                        Ver Detalhes
                      </Button>
                      {invoice.status === 'rejected' && (
                        <Button variant="secondary" size="sm">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Reenviar
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personal Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Estatísticas Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(stats.totalAmount)}
            </div>
            <p className="text-sm text-blue-700">Total aprovado este ano</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.approved > 0 ? Math.round((stats.approved / stats.totalSubmitted) * 100) : 0}%
            </div>
            <p className="text-sm text-green-700">Taxa de aprovação</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatCurrency(stats.averageAmount)}
            </div>
            <p className="text-sm text-purple-700">Média mensal</p>
          </div>
        </div>
      </div>

      {/* Invoice Form Modal Placeholder */}
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar Nota Fiscal</h3>
            <p className="text-gray-600 mb-4">
              Formulário de envio de nota fiscal será implementado aqui.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowInvoiceForm(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowInvoiceForm(false)}>
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
