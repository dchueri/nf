import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Notification, NotificationType, NotificationStatus, NotificationPriority } from '../../types/notification';
import { notificationService } from '../../services/notificationService';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    loadNotificationCount();
    
    // Click outside para fechar dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(10); // Apenas 10 mais recentes
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      // Mock data para desenvolvimento
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getNotificationCount();
      setUnreadCount(count.unread);
    } catch (error) {
      console.error('Erro ao carregar contagem de notificações:', error);
      // Mock count para desenvolvimento
      setUnreadCount(3);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId 
            ? { ...n, status: NotificationStatus.READ, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: NotificationStatus.READ, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const notification = notifications.find(n => n._id === notificationId);
      if (notification?.status === NotificationStatus.UNREAD) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INVOICE_DUE:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case NotificationType.INVOICE_OVERDUE:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case NotificationType.INVOICE_APPROVED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case NotificationType.INVOICE_REJECTED:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case NotificationType.REMINDER:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INVOICE_DUE:
        return 'bg-yellow-50 border-yellow-200';
      case NotificationType.INVOICE_OVERDUE:
        return 'bg-red-50 border-red-200';
      case NotificationType.INVOICE_APPROVED:
        return 'bg-green-50 border-green-200';
      case NotificationType.INVOICE_REJECTED:
        return 'bg-red-50 border-red-200';
      case NotificationType.REMINDER:
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  // Mock data para desenvolvimento
  const getMockNotifications = (): Notification[] => [
    {
      _id: '1',
      userId: 'user-1',
      companyId: 'company-1',
      type: NotificationType.INVOICE_DUE,
      priority: NotificationPriority.MEDIUM,
      status: NotificationStatus.UNREAD,
      title: 'Nota Fiscal Vencendo',
      message: 'Sua nota fiscal de Janeiro vence em 3 dias',
      data: { invoiceId: 'inv-1', dueDate: '2024-01-31' },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      userId: 'user-1',
      companyId: 'company-1',
      type: NotificationType.INVOICE_APPROVED,
      priority: NotificationPriority.LOW,
      status: NotificationStatus.UNREAD,
      title: 'Nota Fiscal Aprovada',
      message: 'Sua nota fiscal de Dezembro foi aprovada',
      data: { invoiceId: 'inv-2', amount: 5000 },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      userId: 'user-1',
      companyId: 'company-1',
      type: NotificationType.REMINDER,
      priority: NotificationPriority.LOW,
      status: NotificationStatus.READ,
      title: 'Lembrete Mensal',
      message: 'Não esqueça de enviar sua nota fiscal mensal',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* Header do Dropdown */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        'p-4 hover:bg-gray-50 transition-colors duration-200',
                        getNotificationColor(notification.type),
                        notification.status === NotificationStatus.UNREAD && 'bg-blue-50'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.status === NotificationStatus.UNREAD && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {notification.status === NotificationStatus.UNREAD && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Marcar como lida"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Deletar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer do Dropdown */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    // Aqui você pode navegar para a página de notificações se quiser
                  }}
                >
                  Ver todas as notificações
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
