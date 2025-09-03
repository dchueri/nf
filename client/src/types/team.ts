export interface Team {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  ownerId: string;
  members: TeamMember[];
  settings: TeamSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  role: TeamRole;
  joinedAt: string;
  invitedBy?: string;
  status: TeamMemberStatus;
  permissions: TeamPermission[];
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
  LEFT = 'left'
}

export interface TeamPermission {
  resource: string;
  actions: string[];
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  defaultRole: TeamRole;
  maxMembers: number;
  privacy: TeamPrivacy;
}

export enum TeamPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted'
}

export interface UserInvitation {
  id: string;
  email: string;
  invitedBy: string;
  companyId: string;
  teamId?: string;
  role: TeamRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  message?: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface UserProfile {
  userId: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  experience: string;
  department?: string;
  position?: string;
  phone?: string;
  location?: string;
  socialLinks: SocialLinks;
  preferences: UserPreferences;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'auto';
  emailFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  invoiceUpdates: boolean;
  teamUpdates: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
}

export interface TeamStats {
  teamId: string;
  totalMembers: number;
  activeMembers: number;
  totalInvoices: number;
  totalAmount: number;
  averageResponseTime: number;
  memberActivity: MemberActivity[];
}

export interface MemberActivity {
  userId: string;
  userName: string;
  lastActive: string;
  invoicesSubmitted: number;
  invoicesApproved: number;
  responseTime: number;
  contributionScore: number;
}

export interface BulkUserOperation {
  operation: 'invite' | 'update' | 'remove' | 'suspend' | 'cancel-invite';
  users: string[];
  data?: any;
}

export interface UserSearchFilters {
  query?: string;
  role?: string[];
  status?: string[];
  companyId?: string;
  department?: string;
  lastActiveAfter?: string;
  lastActiveBefore?: string;
}

export interface TeamSearchFilters {
  query?: string;
  privacy?: TeamPrivacy[];
  ownerId?: string;
  memberCount?: {
    min?: number;
    max?: number;
  };
  createdAtAfter?: string;
  createdAtBefore?: string;
}
