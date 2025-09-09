import { motion } from 'framer-motion'
import { UsersIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { ClockIcon } from '@heroicons/react/24/outline'
import { UserStatsDashboard as UserStatsType } from '../../../services/userService'
import { DashboardStatsCard } from './DashboardStatsCard'

export const UserStats = ({ stats }: { stats: UserStatsType }) => {
  const statsArray = [
    {
      title: 'Usuários',
      value: stats.total,
      icon: <UsersIcon className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Notas Aprovadas',
      value: stats.approved,
      icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />
    },
    {
      title: 'Notas Pendentes',
      value: stats.pending,
      icon: <ClockIcon className="h-8 w-8 text-yellow-600" />
    }
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsArray.map((stat) => (
        <DashboardStatsCard
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
