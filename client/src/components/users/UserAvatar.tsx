import React from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { User } from '../../types/user'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  className?: string
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showName = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
          />
        ) : (
          <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 flex items-center justify-center ${getInitialsColor(user.name)} text-white font-semibold ${textSizeClasses[size]}`}>
            {getInitials(user.name)}
          </div>
        )}
        
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1">
          <div className={`h-3 w-3 rounded-full border-2 border-white ${
            user.status === 'active' ? 'bg-green-500' :
            user.status === 'inactive' ? 'bg-gray-400' :
            'bg-red-500'
          }`} />
        </div>
      </div>
      
      {showName && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{user.name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      )}
    </div>
  )
}
