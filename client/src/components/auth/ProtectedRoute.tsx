import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useAuth } from '../../hooks/useAuth'
import { Skeleton } from '../ui/Skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useUser()
  const { checkAuth } = useAuth()
  const location = useLocation()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const validateAuth = async () => {
      if (!user && requireAuth) {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          setIsCheckingAuth(false)
          return
        }
      }
      setIsCheckingAuth(false)
    }

    validateAuth()
  }, [user, requireAuth, checkAuth])

  // Show loading skeleton while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Skeleton height="4rem" width="12rem" className="mx-auto mb-4" />
            <Skeleton height="1.5rem" width="16rem" className="mx-auto" />
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <Skeleton height="3rem" width="100%" />
            <Skeleton height="3rem" width="100%" />
            <Skeleton height="3rem" width="100%" />
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated and auth is required
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (!requireAuth && user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
