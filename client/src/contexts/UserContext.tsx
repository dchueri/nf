import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType, UserRole } from '../types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock user data for development
    // In production, this would come from authentication service
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      role: UserRole.MANAGER, // Change to COLLABORATOR to test different views
      companyId: 'company-1',
      position: 'Desenvolvedor Senior',
      department: 'TI',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API call delay
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
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
