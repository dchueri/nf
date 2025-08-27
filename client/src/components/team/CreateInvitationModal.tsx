import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  EnvelopeIcon,
  UserIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { TeamRole } from '../../types/team';
import * as teamService from '../../services/teamService';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onInvitationCreated: () => void;
}

export const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
  isOpen,
  onClose,
  companyId,
  onInvitationCreated
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: TeamRole.MEMBER,
    message: '',
    expiresInDays: 7
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Creating invitation:', { 
          ...formData, 
          companyId,
          expiresAt: new Date(Date.now() + formData.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        });
        onInvitationCreated();
        onClose();
        resetForm();
      } else {
        await teamService.createInvitation({
          ...formData,
          companyId,
          expiresAt: new Date(Date.now() + formData.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        });
        onInvitationCreated();
        onClose();
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar convite');
      console.error('Error creating invitation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: TeamRole.MEMBER,
      message: '',
      expiresInDays: 7
    });
    setError(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const getRoleDescription = (role: TeamRole) => {
    switch (role) {
      case TeamRole.OWNER:
        return 'Acesso total ao sistema e todas as funcionalidades';
      case TeamRole.ADMIN:
        return 'Pode gerenciar usuários, equipes e configurações';
      case TeamRole.MEMBER:
        return 'Acesso padrão para uso das funcionalidades principais';
      case TeamRole.VIEWER:
        return 'Apenas visualização, sem permissão de edição';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 95, y: 20 }}
            animate={{ opacity: 1, scale: 100, y: 0 }}
            exit={{ opacity: 0, scale: 95, y: 20 }}
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Novo Convite</h3>
                    <p className="text-sm text-gray-500">Convide um novo usuário para sua empresa</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="usuario@empresa.com"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome completo"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as TeamRole }))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={TeamRole.MEMBER}>Membro</option>
                    <option value={TeamRole.ADMIN}>Administrador</option>
                    <option value={TeamRole.VIEWER}>Visualizador</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {getRoleDescription(formData.role)}
                </p>
              </div>

              {/* Expiration */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expira em *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) }))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>1 dia</option>
                    <option value={3}>3 dias</option>
                    <option value={7}>1 semana</option>
                    <option value={14}>2 semanas</option>
                    <option value={30}>1 mês</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mensagem personalizada para o convite..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>Enviar Convite</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
