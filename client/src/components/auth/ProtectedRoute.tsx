import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useAuth } from '../../hooks/useAuth'
import { Skeleton } from '../ui/Skeleton'
import { LoadingSpinner } from 'components/ui/LoadingSpinner'

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
        console.log('isAuthenticated', isAuthenticated)
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
      <LoadingSpinner />
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
