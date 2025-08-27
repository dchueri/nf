import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheckIcon,
  UserIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { 
  TeamRole, 
  TeamPermission 
} from '../../types/team';
import * as teamService from '../../services/teamService';
import { cn } from '../../utils/cn';

interface PermissionsManagerProps {
  companyId?: string;
  teamId?: string;
  className?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'invoice' | 'team' | 'user' | 'system';
  actions: string[];
}

interface UserPermission {
  userId: string;
  userName: string;
  role: TeamRole;
  permissions: string[];
  lastUpdated: string;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({ 
  companyId, 
  teamId,
  className 
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

  // Mock data for development
  const mockPermissions: Permission[] = [
    {
      id: '1',
      name: 'Gerenciar Notas Fiscais',
      description: 'Criar, editar e excluir notas fiscais',
      category: 'invoice',
      actions: ['create', 'read', 'update', 'delete', 'approve']
    },
    {
      id: '2',
      name: 'Gerenciar Usuários',
      description: 'Adicionar, remover e modificar usuários da equipe',
      category: 'user',
      actions: ['create', 'read', 'update', 'delete', 'invite']
    },
    {
      id: '3',
      name: 'Configurações da Equipe',
      description: 'Modificar configurações e estrutura da equipe',
      category: 'team',
      actions: ['read', 'update', 'delete']
    },
    {
      id: '4',
      name: 'Relatórios e Analytics',
      description: 'Acessar relatórios e estatísticas da empresa',
      category: 'system',
      actions: ['read', 'export']
    }
  ];

  const mockUserPermissions: UserPermission[] = [
    {
      userId: 'user1',
      userName: 'João Silva',
      role: TeamRole.OWNER,
      permissions: ['1', '2', '3', '4'],
      lastUpdated: new Date().toISOString()
    },
    {
      userId: 'user2',
      userName: 'Maria Santos',
      role: TeamRole.ADMIN,
      permissions: ['1', '2', '4'],
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      userId: 'user3',
      userName: 'Pedro Oliveira',
      role: TeamRole.MEMBER,
      permissions: ['1'],
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    loadPermissions();
  }, [companyId, teamId]);

  const loadPermissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPermissions(mockPermissions);
        setUserPermissions(mockUserPermissions);
      } else {
        // In production, load from API
        const [perms, userPerms] = await Promise.all([
          Promise.resolve(mockPermissions), // Mock for now
          Promise.resolve(mockUserPermissions) // Mock for now
        ]);
        setPermissions(perms);
        setUserPermissions(userPerms);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar permissões');
      console.error('Error loading permissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'invoice':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'user':
        return <UserIcon className="h-5 w-5 text-green-600" />;
      case 'team':
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <CogIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <ShieldCheckIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'invoice':
        return 'Notas Fiscais';
      case 'user':
        return 'Usuários';
      case 'team':
        return 'Equipe';
      case 'system':
        return 'Sistema';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'invoice':
        return 'text-blue-700 bg-blue-100';
      case 'user':
        return 'text-green-700 bg-green-100';
      case 'team':
        return 'text-purple-700 bg-purple-100';
      case 'system':
        return 'text-orange-700 bg-orange-100';
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

  const handleEditPermissions = (userId: string) => {
    const user = userPermissions.find(u => u.userId === userId);
    if (user) {
      setSelectedUser(userId);
      setEditingPermissions([...user.permissions]);
      setShowPermissionModal(true);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setUserPermissions(prev => prev.map(user => 
          user.userId === selectedUser 
            ? { ...user, permissions: editingPermissions, lastUpdated: new Date().toISOString() }
            : user
        ));
        setShowPermissionModal(false);
        setSelectedUser(null);
        setEditingPermissions([]);
      } else {
        // In production, save to API
        // await teamService.updateUserPermissions(selectedUser, editingPermissions);
        await loadPermissions();
        setShowPermissionModal(false);
        setSelectedUser(null);
        setEditingPermissions([]);
      }
    } catch (err) {
      console.error('Error saving permissions:', err);
    }
  };

  const togglePermission = (permissionId: string) => {
    setEditingPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const hasPermission = (userId: string, permissionId: string) => {
    const user = userPermissions.find(u => u.userId === userId);
    return user?.permissions.includes(permissionId) || false;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Permissões</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadPermissions}
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
            <h2 className="text-lg font-semibold text-gray-900">Gerenciamento de Permissões</h2>
            <p className="text-sm text-gray-500">
              Configure permissões e controle de acesso para usuários e equipes
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <CogIcon className="h-4 w-4" />
              <span>Configurações</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando permissões...</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões Disponíveis</h3>
              <div className="space-y-3">
                {permissions.map((permission) => (
                  <motion.div
                    key={permission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(permission.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{permission.name}</h4>
                          <span className={cn(
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            getCategoryColor(permission.category)
                          )}>
                            {getCategoryLabel(permission.category)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {permission.actions.map((action) => (
                            <span
                              key={action}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* User Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões dos Usuários</h3>
              <div className="space-y-3">
                {userPermissions.map((user) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm text-gray-600 font-medium">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.userName}</h4>
                          <span className={cn(
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            getRoleColor(user.role)
                          )}>
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPermissions(user.userId)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Editar permissões"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className={cn(
                            'flex items-center space-x-2 p-2 rounded',
                            hasPermission(user.userId, permission.id)
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                          )}
                        >
                          {hasPermission(user.userId, permission.id) ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={cn(
                            'text-xs',
                            hasPermission(user.userId, permission.id)
                              ? 'text-green-700'
                              : 'text-gray-500'
                          )}>
                            {permission.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Atualizado {new Date(user.lastUpdated).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Edit Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <motion.div
                initial={{ opacity: 0, scale: 95, y: 20 }}
                animate={{ opacity: 1, scale: 100, y: 0 }}
                exit={{ opacity: 0, scale: 95, y: 20 }}
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Editar Permissões</h3>
                        <p className="text-sm text-gray-500">
                          Configure as permissões do usuário
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`perm-${permission.id}`}
                            checked={editingPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <label htmlFor={`perm-${permission.id}`} className="font-medium text-gray-900">
                              {permission.name}
                            </label>
                            <p className="text-sm text-gray-500">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowPermissionModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSavePermissions}
                  >
                    Salvar Permissões
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
