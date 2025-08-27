import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Skeleton, SkeletonTable } from '../ui/Skeleton';
import { useToastHelpers } from '../ui/Toast';

interface UserStatus {
  id: string;
  name: string;
  email: string;
  department: string;
  hasSubmitted: boolean;
  status: 'approved' | 'rejected' | 'pending' | 'not_submitted';
  amount?: number;
  submittedAt?: string;
}

export const ManagerDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'not_submitted'>('all');
  const [loading, setLoading] = useState(false);
  const toast = useToastHelpers();

  // Mock data
  const users: UserStatus[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      department: 'TI',
      hasSubmitted: true,
      status: 'approved',
      amount: 5000,
      submittedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      department: 'Marketing',
      hasSubmitted: false,
      status: 'not_submitted',
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      department: 'Vendas',
      hasSubmitted: true,
      status: 'pending',
      amount: 4800,
      submittedAt: '2024-01-14',
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@empresa.com',
      department: 'RH',
      hasSubmitted: true,
      status: 'rejected',
      amount: 5200,
      submittedAt: '2024-01-13',
    },
  ];

  // Memoização dos dados filtrados
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (selectedFilter === 'all') return true;
      return user.status === selectedFilter;
    });
  }, [users, selectedFilter]);

  // Memoização das estatísticas
  const stats = useMemo(() => ({
    totalUsers: users.length,
    submitted: users.filter(u => u.hasSubmitted).length,
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length,
    notSubmitted: users.filter(u => u.status === 'not_submitted').length,
  }), [users]);

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

  const handleSendReminders = useCallback(async () => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Lembretes enviados!', 'Todos os colaboradores foram notificados.');
    } catch (error) {
      toast.error('Erro ao enviar lembretes', 'Tente novamente em alguns instantes.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleGenerateReport = useCallback(async () => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Relatório gerado!', 'O arquivo foi baixado automaticamente.');
    } catch (error) {
      toast.error('Erro ao gerar relatório', 'Tente novamente em alguns instantes.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Gestor</h1>
          <p className="text-gray-600">Visão geral do status de envio de notas fiscais</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={handleSendReminders}
            disabled={loading}
          >
            <BellIcon className="h-4 w-4 mr-2" />
            {loading ? 'Enviando...' : 'Enviar Lembretes'}
          </Button>
          <Button 
            onClick={handleGenerateReport}
            disabled={loading}
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
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
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notas Enviadas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.submitted}</p>
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
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Em Análise</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
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
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Não Enviadas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.notSubmitted}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrar por status:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'not_submitted', label: 'Não Enviadas' },
              { key: 'pending', label: 'Em Análise' },
              { key: 'approved', label: 'Aprovadas' },
              { key: 'rejected', label: 'Rejeitadas' },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedFilter(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Status dos Usuários ({filteredUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
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
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(user.status)}
                      <span className={`ml-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.amount ? formatCurrency(user.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.submittedAt ? formatDate(user.submittedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.status === 'pending' && (
                        <>
                          <Button variant="secondary" size="sm">
                            Aprovar
                          </Button>
                          <Button variant="secondary" size="sm">
                            Rejeitar
                          </Button>
                        </>
                      )}
                      {user.status === 'not_submitted' && (
                        <Button variant="secondary" size="sm">
                          Lembrar
                        </Button>
                      )}
                      <Button variant="secondary" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
