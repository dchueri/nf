import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isLargeScreen: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['collaborator', 'manager'] },
  { name: 'Minhas Notas', href: '/invoices', icon: DocumentTextIcon, roles: ['collaborator'] },
  { name: 'Todas as Notas', href: '/invoices', icon: DocumentTextIcon, roles: ['manager'] },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon, roles: ['manager'] },
  { name: 'Usuários', href: '/users', icon: UsersIcon, roles: ['manager'] },
  { name: 'Configurações', href: '/settings', icon: CogIcon, roles: ['manager'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isLargeScreen }) => {
  const location = useLocation();
  const { user } = useUser();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
    {
      'translate-x-0': isOpen,
      '-translate-x-full': !isOpen,
      'lg:relative lg:translate-x-0': isLargeScreen,
    }
  );

  return (
    <motion.aside
      className={sidebarClasses}
      variants={sidebarVariants}
      initial={isLargeScreen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <DocumentDuplicateIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Central de Notas</span>
        </div>
        {!isLargeScreen && (
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation
            .filter(item => !item.roles || item.roles.includes(user?.role || 'collaborator'))
            .map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    {
                      'bg-blue-50 text-blue-700 border-r-2 border-blue-700': isActive,
                      'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive,
                    }
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                      {
                        'text-blue-700': isActive,
                        'text-gray-400 group-hover:text-gray-500': !isActive,
                      }
                    )}
                  />
                  {item.name}
                </NavLink>
              );
            })}
        </div>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UsersIcon className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuário Atual</p>
            <p className="text-xs text-gray-500">admin@empresa.com</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
