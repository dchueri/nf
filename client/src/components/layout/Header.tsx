import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Bars3Icon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../../contexts/UserContext'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user } = useUser()
  const { logout } = useAuth()

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, [logout])

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <NotificationDropdown /> */}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="hidden md:block text-sm font-medium">
                {user?.name || 'Usuário'}
              </span>
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || 'usuario@empresa.com'}
                  </p>
                </div>

                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
                  Configurações
                </a>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
