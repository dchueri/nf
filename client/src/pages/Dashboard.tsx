import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { ManagerDashboard } from '../components/dashboard/Manager/ManagerDashboard';
import { CollaboratorDashboard } from '../components/dashboard/CollaboratorDashboard';
import { PageLoader, ContentLoader } from '../components/ui/LoadingSpinner';
import { FeedbackMessage } from '../components/ui/FeedbackMessage';

export const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const { shouldRedirectToOnboarding } = useOnboarding();

  if (isLoading) {
    return <PageLoader text="Carregando dashboard..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <FeedbackMessage
          type="warning"
          title="Usuário não autenticado"
          message="Faça login para acessar o dashboard."
        />
      </div>
    );
  }

  // Verificar se precisa redirecionar para onboarding
  useEffect(() => {
    shouldRedirectToOnboarding();
  }, [shouldRedirectToOnboarding]);

  if (user.role === 'manager') {
    return <ManagerDashboard />;
  }

  return <CollaboratorDashboard />;
};
