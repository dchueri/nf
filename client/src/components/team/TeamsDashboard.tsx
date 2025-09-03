import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  EnvelopeIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { UserManagement } from '../users/UserManagement';
import { TeamManagement } from './TeamManagement';
import { InvitationManagement } from './InvitationManagement';

interface TeamsDashboardProps {
  companyId?: string;
  className?: string;
}

type ActiveTab = 'users' | 'teams' | 'invitations';

export const TeamsDashboard: React.FC<TeamsDashboardProps> = ({ 
  companyId, 
  className 
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');

  const tabs = [
    {
      id: 'users' as ActiveTab,
      name: 'Usuários',
      icon: UsersIcon,
      description: 'Gerencie usuários da empresa',
      count: 12
    },
    {
      id: 'teams' as ActiveTab,
      name: 'Equipes',
      icon: UserGroupIcon,
      description: 'Organize equipes e projetos',
      count: 4
    },
    {
      id: 'invitations' as ActiveTab,
      name: 'Convites',
      icon: EnvelopeIcon,
      description: 'Gerencie convites pendentes',
      count: 3
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement companyId={companyId} />;
      case 'teams':
        return <TeamManagement companyId={companyId} />;
      case 'invitations':
        return <InvitationManagement />;
      default:
        return <UserManagement companyId={companyId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Equipes</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie usuários, equipes e convites da sua empresa
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChartBarIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <CogIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </div>
    </div>
  );
};
