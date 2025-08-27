import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { CreateInvitationModal } from './CreateInvitationModal';
import { UserInvitation, InvitationStatus, TeamRole } from '../../types/team';
import * as teamService from '../../services/teamService';

export const InvitationManagement: React.FC = () => {
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<UserInvitation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<TeamRole | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load invitations from API
  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load invitations:', err);
      setError('Falha ao carregar convites');
      // Fallback to mock data for development
      setInvitations(mockInvitations);
    } finally {
      setLoading(false);
    }
  };

  // Filter invitations
  useEffect(() => {
    let filtered = invitations;

    if (searchTerm) {
      filtered = filtered.filter(invitation =>
        invitation.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invitation => invitation.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(invitation => invitation.role === roleFilter);
    }

    setFilteredInvitations(filtered);
  }, [invitations, searchTerm, statusFilter, roleFilter]);

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await teamService.resendInvitation(invitationId);
      // Reload invitations to get updated data
      await loadInvitations();
    } catch (err) {
      console.error('Failed to resend invitation:', err);
      setError('Falha ao reenviar convite');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await teamService.cancelInvitation(invitationId);
      // Reload invitations to get updated data
      await loadInvitations();
    } catch (err) {
      console.error('Failed to cancel invitation:', err);
      setError('Falha ao cancelar convite');
    }
  };

  const handleCreateInvitation = async () => {
    try {
      // Reload invitations to get new data
      await loadInvitations();
    } catch (err) {
      console.error('Failed to create invitation:', err);
      setError('Falha ao criar convite');
    }
  };

  const getStatusIcon = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return <ClockIcon className="w-4 h-4" />;
      case InvitationStatus.ACCEPTED:
        return <CheckCircleIcon className="w-4 h-4" />;
      case InvitationStatus.DECLINED:
        return <XCircleIcon className="w-4 h-4" />;
      case InvitationStatus.EXPIRED:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case InvitationStatus.CANCELLED:
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case InvitationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case InvitationStatus.DECLINED:
        return 'bg-red-100 text-red-800';
      case InvitationStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800';
      case InvitationStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return 'Pendente';
      case InvitationStatus.ACCEPTED:
        return 'Aceito';
      case InvitationStatus.DECLINED:
        return 'Recusado';
      case InvitationStatus.EXPIRED:
        return 'Expirado';
      case InvitationStatus.CANCELLED:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getRoleLabel = (role: TeamRole) => {
    switch (role) {
      case TeamRole.OWNER:
        return 'Proprietário';
      case TeamRole.ADMIN:
        return 'Administrador';
      case TeamRole.MEMBER:
        return 'Membro';
      case TeamRole.VIEWER:
        return 'Visualizador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case TeamRole.OWNER:
        return 'bg-purple-100 text-purple-800';
      case TeamRole.ADMIN:
        return 'bg-blue-100 text-blue-800';
      case TeamRole.MEMBER:
        return 'bg-green-100 text-green-800';
      case TeamRole.VIEWER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && invitations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Convites</h2>
          <p className="text-gray-600">Gerencie convites para novos usuários e equipes</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Convite
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvitationStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value={InvitationStatus.PENDING}>Pendente</option>
            <option value={InvitationStatus.ACCEPTED}>Aceito</option>
            <option value={InvitationStatus.DECLINED}>Recusado</option>
            <option value={InvitationStatus.EXPIRED}>Expirado</option>
            <option value={InvitationStatus.CANCELLED}>Cancelado</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as TeamRole | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas as Funções</option>
            <option value={TeamRole.OWNER}>Proprietário</option>
            <option value={TeamRole.ADMIN}>Administrador</option>
            <option value={TeamRole.MEMBER}>Membro</option>
            <option value={TeamRole.VIEWER}>Visualizador</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="secondary"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setRoleFilter('all');
            }}
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvitations.map((invitation) => (
                <motion.tr
                  key={invitation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {invitation.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(invitation.role)}`}>
                      {getRoleLabel(invitation.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invitation.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invitation.status)}`}>
                        {getStatusLabel(invitation.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invitation.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invitation.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {invitation.status === InvitationStatus.PENDING && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id)}
                          >
                            <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                            Reenviar
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button variant="secondary" size="sm">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="secondary" size="sm">
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvitations.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum convite encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando um novo convite.'}
            </p>
          </div>
        )}
      </div>

      {/* Create Invitation Modal */}
      <CreateInvitationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        companyId="company1"
        onInvitationCreated={handleCreateInvitation}
      />
    </div>
  );
};

// Mock data for development (fallback when API is not available)
const mockInvitations: UserInvitation[] = [
  {
    id: '1',
    email: 'joao@empresa.com',
    companyId: 'company1',
    teamId: 'team1',
    invitedBy: 'user1',
    role: TeamRole.MEMBER,
    status: InvitationStatus.PENDING,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Bem-vindo à nossa equipe!',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'maria@empresa.com',
    companyId: 'company1',
    teamId: 'team2',
    invitedBy: 'user1',
    role: TeamRole.ADMIN,
    status: InvitationStatus.ACCEPTED,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Convidamos você para ser administradora da equipe.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    email: 'pedro@empresa.com',
    companyId: 'company1',
    teamId: 'team1',
    invitedBy: 'user1',
    role: TeamRole.MEMBER,
    status: InvitationStatus.DECLINED,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Gostaríamos de contar com sua colaboração.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
