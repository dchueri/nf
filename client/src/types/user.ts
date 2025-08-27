export enum UserRole {
  COMPANY = 'company',
  COLLABORATOR = 'collaborator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  companyId?: string;
  invitedBy?: string;
  phone?: string;
  cpfCnpj?: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  reminderPreferences?: {
    email: boolean;
    whatsapp: boolean;
    frequency: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  status: UserStatus;
}
