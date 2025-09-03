import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '../types/user';
import { authService, authUtils } from '../services/authService';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
          const profile = await authService.getProfile();
          console.log('profile', profile)
          const user = authUtils.formatUserForContext(profile.data);
          setUser(user);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
