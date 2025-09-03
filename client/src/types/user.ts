import { InvoiceStatus } from './invoice'

export enum UserRole {
  COLLABORATOR = 'collaborator',
  MANAGER = 'manager'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  monthsWithInvoices: {
    month: string
    invoices: number
    status: InvoiceStatus
    submittedAt: string
    amount?: number
  }[]
  companyId: string
  avatar?: string
  position?: string
  department?: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  status: UserStatus
}

export interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}
