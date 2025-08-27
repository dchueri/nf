import { 
  Notification, 
  NotificationPreferences, 
  ReminderSchedule,
  NotificationType,
  NotificationStatus 
} from '../types/notification';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class NotificationService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Notificações
  async getNotifications(limit = 50, offset = 0): Promise<Notification[]> {
    return this.request<Notification[]>(`/notifications?limit=${limit}&offset=${offset}`);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>(`/notifications/unread`);
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.request<Notification>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllAsRead(): Promise<void> {
    return this.request<void>(`/notifications/read-all`, {
      method: 'PATCH',
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this.request<void>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async getNotificationCount(): Promise<{ unread: number; total: number }> {
    return this.request<{ unread: number; total: number }>(`/notifications/count`);
  }

  // Preferências de Notificação
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return this.request<NotificationPreferences>(`/notifications/preferences`);
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return this.request<NotificationPreferences>(`/notifications/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  // Lembretes
  async getReminderSchedules(): Promise<ReminderSchedule[]> {
    return this.request<ReminderSchedule[]>(`/notifications/reminders`);
  }

  async createReminderSchedule(schedule: Partial<ReminderSchedule>): Promise<ReminderSchedule> {
    return this.request<ReminderSchedule>(`/notifications/reminders`, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  async updateReminderSchedule(scheduleId: string, updates: Partial<ReminderSchedule>): Promise<ReminderSchedule> {
    return this.request<ReminderSchedule>(`/notifications/reminders/${scheduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteReminderSchedule(scheduleId: string): Promise<void> {
    return this.request<void>(`/notifications/reminders/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  // Notificações Push (Web Push API)
  async subscribeToPushNotifications(subscription: PushSubscription): Promise<void> {
    return this.request<void>(`/notifications/push/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  async unsubscribeFromPushNotifications(): Promise<void> {
    return this.request<void>(`/notifications/push/unsubscribe`, {
      method: 'DELETE',
    });
  }

  // Teste de Notificação (para desenvolvimento)
  async sendTestNotification(type: NotificationType = NotificationType.SYSTEM): Promise<Notification> {
    return this.request<Notification>(`/notifications/test`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // WebSocket para notificações em tempo real
  connectWebSocket(onNotification: (notification: Notification) => void): WebSocket | null {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/notifications/ws?token=${token}`);
      
      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          onNotification(notification);
        } catch (error) {
          console.error('Erro ao processar notificação WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
      };

      ws.onclose = () => {
        console.log('Conexão WebSocket fechada');
      };

      return ws;
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      return null;
    }
  }
}

export const notificationService = new NotificationService();
