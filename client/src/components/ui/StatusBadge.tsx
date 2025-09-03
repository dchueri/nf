import React from 'react'
import { InvoiceStatus } from '../../types/invoice'
import { cn } from '../../utils/cn'
import { UserStatus } from 'types/user'
import { Badge } from './Badge'

interface StatusBadgeProps {
  status: InvoiceStatus | UserStatus
  className?: string
  type?: 'invoice' | 'user'
}

const userStatusConfig = {
  [UserStatus.PENDING]: {
    label: 'Convidado',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: ''
  },
  [UserStatus.ACTIVE]: {
    label: 'Ativo',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: ''
  },
  [UserStatus.INACTIVE]: {
    label: 'Inativo',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: ''
  },
  [UserStatus.SUSPENDED]: {
    label: 'Suspenso',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: ''
  }
}

const statusConfig = {
  [InvoiceStatus.PENDING]: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳'
  },
  [InvoiceStatus.SUBMITTED]: {
    label: 'Enviada',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📤'
  },
  [InvoiceStatus.APPROVED]: {
    label: 'Aprovada',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅'
  },
  [InvoiceStatus.REJECTED]: {
    label: 'Rejeitada',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: '❌'
  },
  [InvoiceStatus.PAID]: {
    label: 'Paga',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '💰'
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  type
}) => {
  const config =
    type === 'user'
      ? userStatusConfig[status as UserStatus]
      : statusConfig[status as InvoiceStatus]

  return (
    <Badge
      className={cn(config.className, className)}
      icon={config.icon}
      label={config.label}
    />
  )
}
