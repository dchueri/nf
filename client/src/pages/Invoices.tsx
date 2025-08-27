import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';

interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue';
  description: string;
  company: string;
  submittedBy: string;
}

export const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'NF-001/2024',
      issueDate: '2024-01-15',
      dueDate: '2024-01-31',
      amount: 1500.00,
      status: 'pending',
      description: 'Desenvolvimento de software - Janeiro 2024',
      company: 'Tech Solutions Ltda',
      submittedBy: 'João Silva',
    },
    {
      id: '2',
      number: 'NF-002/2024',
      issueDate: '2024-01-10',
      dueDate: '2024-01-25',
      amount: 2300.00,
      status: 'approved',
      description: 'Consultoria em TI - Projeto A',
      company: 'Tech Solutions Ltda',
      submittedBy: 'Maria Santos',
    },
    {
      id: '3',
      number: 'NF-003/2024',
      issueDate: '2024-01-05',
      dueDate: '2024-01-20',
      amount: 800.00,
      status: 'paid',
      description: 'Manutenção de sistemas',
      company: 'Tech Solutions Ltda',
      submittedBy: 'Pedro Costa',
    },
    {
      id: '4',
      number: 'NF-004/2024',
      issueDate: '2024-01-01',
      dueDate: '2024-01-15',
      amount: 1200.00,
      status: 'overdue',
      description: 'Suporte técnico - Dezembro 2023',
      company: 'Tech Solutions Ltda',
      submittedBy: 'Ana Oliveira',
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      case 'paid':
        return 'Paga';
      case 'overdue':
        return 'Em Atraso';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="text-gray-600">Gerencie todas as notas fiscais da empresa</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Nota Fiscal
          </Button>
        </div>
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
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovada</option>
                <option value="rejected">Rejeitada</option>
                <option value="paid">Paga</option>
                <option value="overdue">Em Atraso</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Notas Fiscais ({filteredInvoices.length})
            </h2>
            <div className="text-sm text-gray-500">
              Total: {formatCurrency(filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota Fiscal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                        <div className="text-sm text-gray-500">Emissão: {formatDate(invoice.issueDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{invoice.description}</div>
                    <div className="text-sm text-gray-500">Por: {invoice.submittedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="secondary" size="sm">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="secondary" size="sm">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma nota fiscal encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando uma nova nota fiscal.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
