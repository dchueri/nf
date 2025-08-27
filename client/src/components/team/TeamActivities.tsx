import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { 
  TeamActivity, 
  MemberActivity 
} from '../../types/team';
import * as teamService from '../../services/teamService';
import { cn } from '../../utils/cn';

interface TeamActivitiesProps {
  companyId: string;
  teamId?: string;
  className?: string;
}

export const TeamActivities: React.FC<TeamActivitiesProps> = ({ 
  companyId, 
  teamId,
  className 
}) => {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [memberActivities, setMemberActivities] = useState<MemberActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Mock data for development
  const mockActivities: TeamActivity[] = [
    {
      id: '1',
      teamId: 'team1',
      userId: 'user1',
      action: 'invoice_submitted',
      details: {
        invoiceNumber: 'NF-001/2024',
        amount: 2500.00,
        description: 'Serviços de consultoria técnica'
      },
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      teamId: 'team1',
      userId: 'user2',
      action: 'invoice_approved',
      details: {
        invoiceNumber: 'NF-002/2024',
        amount: 1800.00,
        approver: 'user1'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      teamId: 'team2',
      userId: 'user3',
      action: 'team_joined',
      details: {
        teamName: 'Equipe de Marketing',
        role: 'Membro'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      teamId: 'team1',
      userId: 'user1',
      action: 'reminder_sent',
      details: {
        invoiceNumber: 'NF-003/2024',
        dueDate: '2024-02-10',
        recipients: ['user2', 'user3']
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockMemberActivities: MemberActivity[] = [
    {
      userId: 'user1',
      userName: 'João Silva',
      lastActive: new Date().toISOString(),
      invoicesSubmitted: 15,
      invoicesApproved: 8,
      responseTime: 2.5,
      contributionScore: 95
    },
    {
      userId: 'user2',
      userName: 'Maria Santos',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      invoicesSubmitted: 12,
      invoicesApproved: 10,
      responseTime: 1.8,
      contributionScore: 88
    },
    {
      userId: 'user3',
      userName: 'Pedro Oliveira',
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      invoicesSubmitted: 8,
      invoicesApproved: 6,
      responseTime: 3.2,
      contributionScore: 72
    }
  ];

  useEffect(() => {
    loadActivities();
  }, [companyId, teamId, selectedPeriod]);

  const loadActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActivities(mockActivities);
        setMemberActivities(mockMemberActivities);
      } else {
        const [activityList, memberList] = await Promise.all([
          teamService.getTeamActivities(teamId || 'all'),
          teamService.getTeamStats(teamId || 'all')
        ]);
        setActivities(activityList);
        setMemberActivities(memberList.memberActivity || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atividades');
      console.error('Error loading activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'invoice_submitted':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'invoice_approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'team_joined':
        return <UserIcon className="h-5 w-5 text-purple-600" />;
      case 'reminder_sent':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'invoice_submitted':
        return 'Nota fiscal enviada';
      case 'invoice_approved':
        return 'Nota fiscal aprovada';
      case 'team_joined':
        return 'Membro adicionado à equipe';
      case 'reminder_sent':
        return 'Lembrete enviado';
      default:
        return action.replace('_', ' ');
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'invoice_submitted':
        return 'bg-blue-50 border-blue-200';
      case 'invoice_approved':
        return 'bg-green-50 border-green-200';
      case 'team_joined':
        return 'bg-purple-50 border-purple-200';
      case 'reminder_sent':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const getContributionScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Atividades</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadActivities}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Atividades da Equipe</h2>
            <p className="text-sm text-gray-500">
              Acompanhe as atividades e colaboração em tempo real
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Period Filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoje</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
            </select>

            {/* Team Filter */}
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as equipes</option>
              <option value="team1">Equipe de Desenvolvimento</option>
              <option value="team2">Equipe de Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando atividades...</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-4 border rounded-lg',
                      getActionColor(activity.action)
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {getActionLabel(activity.action)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.details && typeof activity.details === 'object' && (
                            <>
                              {activity.details.invoiceNumber && (
                                <span className="font-medium">{activity.details.invoiceNumber}</span>
                              )}
                              {activity.details.amount && (
                                <span className="ml-2">R$ {activity.details.amount.toFixed(2)}</span>
                              )}
                              {activity.details.description && (
                                <span className="ml-2">- {activity.details.description}</span>
                              )}
                            </>
                          )}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Usuário {activity.userId}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Equipe {activity.teamId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Member Performance */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance dos Membros</h3>
              <div className="space-y-4">
                {memberActivities.map((member) => (
                  <motion.div
                    key={member.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{member.userName}</h4>
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getContributionScoreColor(member.contributionScore)
                      )}>
                        {member.contributionScore}%
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notas enviadas:</span>
                        <span className="font-medium">{member.invoicesSubmitted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notas aprovadas:</span>
                        <span className="font-medium">{member.invoicesApproved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tempo resposta:</span>
                        <span className="font-medium">{member.responseTime}h</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Ativo {formatTimestamp(member.lastActive)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Resumo da Semana</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600 font-medium">Total de Atividades</div>
                    <div className="text-2xl font-bold text-blue-900">{activities.length}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Membros Ativos</div>
                    <div className="text-2xl font-bold text-blue-900">{memberActivities.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
