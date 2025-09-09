import { motion } from 'framer-motion'
import { UsersIcon } from '@heroicons/react/24/outline'
import { UserStatsDashboard } from 'services/userService'
import { Skeleton } from '../../ui/Skeleton'
import { useUser } from '../../../contexts/UserContext'

export const DashboardStatsCard = ({
  title,
  value,
  icon
}: {
  title: string
  value: number
  icon: React.ReactNode
}) => {
  const { isLoading } = useUser()
  const SkeletonComponent = () => {
    return (
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="ml-4 flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      {isLoading ? (
        <SkeletonComponent />
      ) : (
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
