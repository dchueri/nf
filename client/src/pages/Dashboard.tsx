import React from 'react';
import { useUser } from '../contexts/UserContext';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { CollaboratorDashboard } from '../components/dashboard/CollaboratorDashboard';

export const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Usuário não autenticado</h2>
        <p className="text-gray-500">Faça login para acessar o dashboard.</p>
      </div>
    );
  }

  // Render dashboard based on user role
  if (user.role === 'manager') {
    return <ManagerDashboard />;
  }

  return <CollaboratorDashboard />;
};
