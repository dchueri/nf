import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { 
  User, 
  UserRole
} from '../../types/user';
import { 
  TeamRole, 
  TeamMemberStatus,
  UserSearchFilters,
  BulkUserOperation
} from '../../types/team';
import * as teamService from '../../services/teamService';
import { cn } from '../../utils/cn';

interface UserManagementProps {
  companyId?: string;
  className?: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  companyId, 
  className 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  // Mock data for development
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'joao.silva@empresa.com',
      name: 'João Silva',
      role: UserRole.MANAGER,
      companyId: companyId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'maria.santos@empresa.com',
      name: 'Maria Santos',
      role: UserRole.COLLABORATOR,
      companyId: companyId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      email: 'pedro.oliveira@empresa.com',
      name: 'Pedro Oliveira',
      role: UserRole.COLLABORATOR,
      companyId: companyId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    loadUsers();
  }, [companyId]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filters]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } else {
        const results = await teamService.searchUsers(searchQuery, filters);
        setUsers(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Additional filters
    if (filters.role && filters.role.length > 0) {
      filtered = filtered.filter(user => filters.role!.includes(user.role));
    }



    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    }
  };

  const handleBulkOperation = async (operation: BulkUserOperation['operation']) => {
    if (selectedUsers.size === 0) return;

    try {
      const bulkOp: BulkUserOperation = {
        operation,
        users: Array.from(selectedUsers)
      };

      if (process.env.NODE_ENV === 'development') {
        // Simulate bulk operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Bulk operation:', bulkOp);
        
        // Update local state
        if (operation === 'remove') {
          setUsers(users.filter(user => !selectedUsers.has(user.id)));
        } else if (operation === 'suspend') {
          setUsers(users.map(user => 
            selectedUsers.has(user.id) 
              ? { ...user, role: UserRole.COLLABORATOR }
              : user
          ));
        }
        
        setSelectedUsers(new Set());
      } else {
        const result = await teamService.bulkUserOperation(bulkOp.operation, Array.from(selectedUsers), bulkOp.data);
        console.log('Bulk operation result:', result);
        
        // Reload users to get updated data
        await loadUsers();
        setSelectedUsers(new Set());
      }
    } catch (error) {
      console.error('Error in bulk operation:', error);
      setError('Erro ao executar operação em lote');
    }
  };



  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'Gestor';
      case UserRole.COLLABORATOR:
        return 'Colaborador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.MANAGER:
        return 'text-purple-700 bg-purple-100';
      case UserRole.COLLABORATOR:
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Usuários</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="primary" onClick={loadUsers}>
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
            <h2 className="text-lg font-semibold text-gray-900">Gerenciamento de Usuários</h2>
            <p className="text-sm text-gray-500">
              {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
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
              <UserPlusIcon className="h-4 w-4" />
              <span>Convidar Usuário</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {selectedUsers.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.size} selecionado{selectedUsers.size !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkOperation('suspend')}
                >
                  Suspender
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkOperation('remove')}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSelectAll()}
          >
            {selectedUsers.size === filteredUsers.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>

                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                <select
                  value={filters.role?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    role: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  <option value={UserRole.MANAGER}>Gestor</option>
                  <option value={UserRole.COLLABORATOR}>Colaborador</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verificado</label>
                <select
                  value={filters.isActive?.toString() || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    isActive: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Verificado</option>
                  <option value="false">Não Verificado</option>
                </select>
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

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando usuários...</p>
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getRoleColor(user.role)
                    )}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Remover"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} resultados
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
