import React from 'react';
import { InvoiceStatus } from '../../types/invoice';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const statusConfig = {
  [InvoiceStatus.PENDING]: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
  },
  [InvoiceStatus.SUBMITTED]: {
    label: 'Enviada',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📤',
  },
  [InvoiceStatus.APPROVED]: {
    label: 'Aprovada',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
  },
  [InvoiceStatus.REJECTED]: {
    label: 'Rejeitada',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: '❌',
  },
  [InvoiceStatus.PAID]: {
    label: 'Paga',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '💰',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};
