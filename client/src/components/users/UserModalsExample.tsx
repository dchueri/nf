import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { EditUserModal, InviteUserModal } from './modals'
import { User, UserRole, UserStatus } from '../../types/user'

export const UserModalsExample: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock user data
  const mockUser: User = {
    _id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    department: 'TI',
    companyId: 'company-1',
    monthsWithInvoices: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleUserUpdated = (updatedUser: User) => {
    console.log('User updated:', updatedUser)
    // Aqui você atualizaria a lista de usuários
  }

  const handleInviteSent = (email: string) => {
    console.log('Invite sent to:', email)
    // Aqui você atualizaria a lista de convites
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Modais de Gerenciamento de Usuários
        </h2>
        <p className="text-gray-600">
          Exemplo de uso dos modais de edição e convite de usuários
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="primary"
          onClick={() => handleEditUser(mockUser)}
          className="flex items-center space-x-2"
        >
          <span>Editar Usuário</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <span>Convidar Usuário</span>
        </Button>
      </div>

      {/* User Info Card */}
      <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuário de Exemplo</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Nome:</span>
            <span className="ml-2 text-gray-900">{mockUser.name}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="ml-2 text-gray-900">{mockUser.email}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Função:</span>
            <span className="ml-2 text-gray-900">
              {mockUser.role === UserRole.MANAGER ? 'Gestor' : 'Colaborador'}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Departamento:</span>
            <span className="ml-2 text-gray-900">{mockUser.department || 'Não definido'}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="ml-2 text-gray-900">
              {mockUser.status === UserStatus.ACTIVE ? 'Ativo' :
               mockUser.status === UserStatus.INACTIVE ? 'Inativo' : 'Suspenso'}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        setSelectedUser={setSelectedUser}
        user={selectedUser}
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  )
}
