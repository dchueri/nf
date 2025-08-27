export enum NotificationType {
  INVOICE_DUE = 'invoice_due',
  INVOICE_OVERDUE = 'invoice_overdue',
  INVOICE_SUBMITTED = 'invoice_submitted',
  INVOICE_APPROVED = 'invoice_approved',
  INVOICE_REJECTED = 'invoice_rejected',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export interface Notification {
  _id: string;
  userId: string;
  companyId: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  data?: {
    invoiceId?: string;
    invoiceNumber?: string;
    dueDate?: string;
    amount?: number;
    [key: string]: any;
  };
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  userId: string;
  companyId: string;
  email: boolean;
  inApp: boolean;
  reminderFrequency: number; // dias antes do vencimento
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  types: {
    [key in NotificationType]: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReminderSchedule {
  invoiceId: string;
  userId: string;
  companyId: string;
  dueDate: string;
  reminderDates: string[]; // datas dos lembretes
  lastReminderSent: string;
  nextReminderDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
