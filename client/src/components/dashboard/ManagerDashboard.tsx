import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  referenceMonth: string; // Mês de referência (YYYY-MM)
  deadlineDate: string; // Data limite para o mês
}

export const ManagerDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'not_submitted'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01');
  const [loading, setLoading] = useState(false);
  const toast = useToastHelpers();

  // Funções auxiliares para meses
  const getAvailableMonths = () => {
    const months = [...new Set(users.map(user => user.referenceMonth))];
    return months.sort().reverse(); // Mais recente primeiro
  };

  const formatMonthDisplay = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
      if (month === 1) {
        newMonth = 12;
        newYear = year - 1;
      } else {
        newMonth = month - 1;
      }
    } else {
      if (month === 12) {
        newMonth = 1;
        newYear = year + 1;
      } else {
        newMonth = month + 1;
      }
    }

    const newMonthString = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    setSelectedMonth(newMonthString);
  };

  // Estado para o datepicker customizado
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentViewYear, setCurrentViewYear] = useState(() => {
    const [year] = selectedMonth.split('-');
    return parseInt(year);
  });
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Fechar datepicker quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atualizar ano da visualização quando selectedMonth mudar
  useEffect(() => {
    const [year] = selectedMonth.split('-');
    setCurrentViewYear(parseInt(year));
  }, [selectedMonth]);

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const selectMonth = (month: number, year: number) => {
    const newMonthString = `${year}-${String(month).padStart(2, '0')}`;
    setSelectedMonth(newMonthString);
    setIsDatePickerOpen(false);
  };

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

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
      referenceMonth: '2024-01',
      deadlineDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      department: 'Marketing',
      hasSubmitted: false,
      status: 'not_submitted',
      referenceMonth: '2024-01',
      deadlineDate: '2024-01-15',
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
      referenceMonth: '2024-01',
      deadlineDate: '2024-01-15',
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
      referenceMonth: '2024-01',
      deadlineDate: '2024-01-15',
    },
    {
      id: '5',
      name: 'Carlos Lima',
      email: 'carlos.lima@empresa.com',
      department: 'Financeiro',
      hasSubmitted: false,
      status: 'not_submitted',
      referenceMonth: '2024-02',
      deadlineDate: '2024-02-15',
    },
    {
      id: '6',
      name: 'Fernanda Costa',
      email: 'fernanda.costa@empresa.com',
      department: 'Vendas',
      hasSubmitted: true,
      status: 'approved',
      amount: 4500,
      submittedAt: '2024-02-10',
      referenceMonth: '2024-02',
      deadlineDate: '2024-02-15',
    },
  ];

  // Memoização dos dados filtrados
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtro por mês de referência
      if (user.referenceMonth !== selectedMonth) return false;
      
      // Filtro por status
      if (selectedFilter === 'all') return true;
      return user.status === selectedFilter;
    });
  }, [users, selectedFilter, selectedMonth]);

  // Memoização das estatísticas
  const stats = useMemo(() => {
    const monthUsers = users.filter(u => u.referenceMonth === selectedMonth);
    return {
      totalUsers: monthUsers.length,
      submitted: monthUsers.filter(u => u.hasSubmitted).length,
      pending: monthUsers.filter(u => u.status === 'pending').length,
      approved: monthUsers.filter(u => u.status === 'approved').length,
      rejected: monthUsers.filter(u => u.status === 'rejected').length,
      notSubmitted: monthUsers.filter(u => u.status === 'not_submitted').length,
    };
  }, [users, selectedMonth]);

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

  const getDelayStatus = (user: UserStatus) => {
    if (user.hasSubmitted) return null;
    
    const deadline = new Date(user.deadlineDate);
    const now = new Date();
    
    if (now > deadline) {
      const daysLate = Math.ceil((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
      return { isLate: true, daysLate };
    }
    
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { isLate: false, daysUntilDeadline };
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

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Mês de Referência</h3>
            <p className="text-sm text-gray-600">Filtre os dados por mês específico</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="px-2"
                title="Mês anterior"
              >
                ←
              </Button>
              
              <div className="relative" ref={datePickerRef}>
                <button
                  type="button"
                  onClick={openDatePicker}
                  className="flex items-center justify-between w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors"
                  title="Selecione o mês e ano de referência"
                >
                  <span className="text-sm text-gray-900">
                    {formatMonthDisplay(selectedMonth)}
                  </span>
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </button>

                {/* Datepicker Dropdown */}
                {isDatePickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {/* Header com navegação de ano */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentViewYear(currentViewYear - 1);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-900">
                        {currentViewYear}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentViewYear(currentViewYear + 1);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Grid de meses */}
                    <div className="p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => {
                          const monthNumber = index + 1;
                          const monthString = `${currentViewYear}-${String(monthNumber).padStart(2, '0')}`;
                          const isSelected = monthString === selectedMonth;
                          const isCurrentMonth = monthString === getCurrentMonth();
                          
                          return (
                            <button
                              key={month}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectMonth(monthNumber, currentViewYear);
                              }}
                              className={`
                                px-3 py-2 text-sm rounded-md transition-colors
                                ${isSelected 
                                  ? 'bg-blue-600 text-white font-medium' 
                                  : 'hover:bg-gray-100 text-gray-700'
                                }
                                ${isCurrentMonth ? 'ring-2 ring-blue-300' : ''}
                              `}
                            >
                              {month}
                              {isCurrentMonth && !isSelected && (
                                <span className="ml-1 text-xs text-blue-600">•</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer com botão para mês atual */}
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMonth(getCurrentMonth());
                          setIsDatePickerOpen(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Ir para Mês Atual
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="px-2"
                title="Próximo mês"
              >
                →
              </Button>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedMonth(getCurrentMonth())}
            >
              Mês Atual
            </Button>
          </div>
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
                 Status dos Usuários - {formatMonthDisplay(selectedMonth)} ({filteredUsers.length})
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
                  Prazo
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
                    {(() => {
                      const delayStatus = getDelayStatus(user);
                      if (!delayStatus) return '-';
                      
                      if (delayStatus.isLate) {
                        return (
                          <span className="text-red-600 font-medium">
                            ⚠️ {delayStatus.daysLate} dia(s) atrasado
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-green-600 font-medium">
                            ⏰ {delayStatus.daysUntilDeadline} dia(s) restante(s)
                          </span>
                        );
                      }
                    })()}
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
