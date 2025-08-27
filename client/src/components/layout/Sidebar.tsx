import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon,
  DocumentDuplicateIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon, current: false },
  { name: 'Upload', href: '/upload', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, current: false },
  { name: 'Team', href: '/team', icon: UsersIcon, current: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1025);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && !isLargeScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: isLargeScreen ? 0 : -300 }}
        animate={{ x: isOpen || isLargeScreen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform',
          'flex flex-col flex-shrink-0',
          isLargeScreen ? 'translate-x-0' : ''
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">
              Central de Notas
            </span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                item.current
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 transition-colors duration-200',
                  item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </a>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Usuário</p>
              <p className="text-xs text-gray-500">usuario@empresa.com</p>
            </div>
            <button className="ml-auto p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <BellIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
