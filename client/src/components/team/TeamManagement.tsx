import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { 
  Team, 
  TeamRole, 
  TeamPrivacy,
  TeamSearchFilters 
} from '../../types/team';
import * as teamService from '../../services/teamService';
import { cn } from '../../utils/cn';

interface TeamManagementProps {
  companyId?: string;
  className?: string;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ 
  companyId, 
  className 
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TeamSearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(10);

  // Mock data for development
  const mockTeams: Team[] = [
    {
      id: '1',
      name: 'Equipe de Desenvolvimento',
      description: 'Equipe responsável pelo desenvolvimento de produtos',
      companyId: companyId || '',
      ownerId: '1',
      members: [
        { userId: '1', role: TeamRole.OWNER, joinedAt: new Date().toISOString(), status: 'active' as any, permissions: [] },
        { userId: '2', role: TeamRole.MEMBER, joinedAt: new Date().toISOString(), status: 'active' as any, permissions: [] }
      ],
      settings: {
        allowMemberInvites: true,
        requireApproval: false,
        defaultRole: TeamRole.MEMBER,
        maxMembers: 10,
        privacy: TeamPrivacy.PRIVATE
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Equipe de Marketing',
      description: 'Equipe responsável pelo marketing e vendas',
      companyId: companyId || '',
      ownerId: '1',
      members: [
        { userId: '1', role: TeamRole.OWNER, joinedAt: new Date().toISOString(), status: 'active' as any, permissions: [] },
        { userId: '3', role: TeamRole.MEMBER, joinedAt: new Date().toISOString(), status: 'pending' as any, permissions: [] }
      ],
      settings: {
        allowMemberInvites: true,
        requireApproval: true,
        defaultRole: TeamRole.MEMBER,
        maxMembers: 8,
        privacy: TeamPrivacy.PUBLIC
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    loadTeams();
  }, [companyId]);

  useEffect(() => {
    filterTeams();
  }, [teams, searchQuery, filters]);

  const loadTeams = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTeams(mockTeams);
      } else {
        const teamList = await teamService.getTeams();
        setTeams(teamList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar equipes');
      console.error('Error loading teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = teams;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Additional filters
    if (filters.privacy && filters.privacy.length > 0) {
      filtered = filtered.filter(team => filters.privacy!.includes(team.settings.privacy));
    }

    if (filters.memberCount) {
      if (filters.memberCount.min !== undefined) {
        filtered = filtered.filter(team => team.members.length >= filters.memberCount!.min!);
      }
      if (filters.memberCount.max !== undefined) {
        filtered = filtered.filter(team => team.members.length <= filters.memberCount!.max!);
      }
    }

    setFilteredTeams(filtered);
    setCurrentPage(1);
  };

  const getPrivacyLabel = (privacy: TeamPrivacy) => {
    switch (privacy) {
      case TeamPrivacy.PUBLIC:
        return 'Público';
      case TeamPrivacy.PRIVATE:
        return 'Privado';
      case TeamPrivacy.RESTRICTED:
        return 'Restrito';
      default:
        return privacy;
    }
  };

  const getPrivacyColor = (privacy: TeamPrivacy) => {
    switch (privacy) {
      case TeamPrivacy.PUBLIC:
        return 'text-green-700 bg-green-100';
      case TeamPrivacy.PRIVATE:
        return 'text-blue-700 bg-blue-100';
      case TeamPrivacy.RESTRICTED:
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
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
        return 'text-purple-700 bg-purple-100';
      case TeamRole.ADMIN:
        return 'text-red-700 bg-red-100';
      case TeamRole.MEMBER:
        return 'text-blue-700 bg-blue-100';
      case TeamRole.VIEWER:
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const endIndex = startIndex + teamsPerPage;
  const currentTeams = filteredTeams.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Equipes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={loadTeams}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gerenciamento de Equipes</h2>
            <p className="text-sm text-gray-500">
              {filteredTeams.length} equipe{filteredTeams.length !== 1 ? 's' : ''} encontrada{filteredTeams.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            
            <Button
              variant="primary"
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nova Equipe</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar equipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-4 border-b border-gray-200 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacidade</label>
                <select
                  value={filters.privacy?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    privacy: e.target.value ? [e.target.value as TeamPrivacy] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  <option value={TeamPrivacy.PUBLIC}>Público</option>
                  <option value={TeamPrivacy.PRIVATE}>Privado</option>
                  <option value={TeamPrivacy.RESTRICTED}>Restrito</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membros Mínimos</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.memberCount?.min || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    memberCount: { 
                      ...prev.memberCount, 
                      min: e.target.value ? parseInt(e.target.value) : undefined 
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando equipes...</p>
        </div>
      ) : currentTeams.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          Nenhuma equipe encontrada
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTeams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getPrivacyColor(team.settings.privacy)
                      )}>
                        {getPrivacyLabel(team.settings.privacy)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Visualizar">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Editar">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Configurações">
                      <CogIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Team Description */}
                {team.description && (
                  <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                )}

                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{team.members.length}</div>
                    <div className="text-xs text-gray-500">Membros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{team.settings.maxMembers}</div>
                    <div className="text-xs text-gray-500">Máximo</div>
                  </div>
                </div>

                {/* Team Members Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Membros Principais</h4>
                  <div className="space-y-2">
                    {team.members.slice(0, 3).map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">
                              {member.userId.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">Usuário {member.userId}</span>
                        </div>
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getRoleColor(member.role)
                        )}>
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <div className="text-sm text-gray-500 text-center">
                        +{team.members.length - 3} mais membros
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    <span>Adicionar</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    <span>Estatísticas</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTeams.length)} de {filteredTeams.length} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
