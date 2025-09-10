import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Skeleton, SkeletonCard } from './components/ui/Skeleton';
import { LoadingSpinner } from 'components/ui/LoadingSpinner';
import { FirstAccess } from 'pages/auth/FirstAccess';

// Lazy loading das páginas
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Invoices = lazy(() => import('./pages/Invoices').then(module => ({ default: module.Invoices })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const Users = lazy(() => import('./pages/Users').then(module => ({ default: module.Users })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Login = lazy(() => import('./pages/auth/Login').then(module => ({ default: module.Login })));
const CompanyOnboarding = lazy(() => import('./pages/onboarding/CompanyOnboarding').then(module => ({ default: module.CompanyOnboarding })));

// Loading fallback component
const PageLoading = () => (
  <div className="space-y-6">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <Suspense fallback={<PageLoading />}>
                  <Login />
                </Suspense>
              </ProtectedRoute>
            } />

            <Route path="/first-access" element={
              <ProtectedRoute requireAuth={false} >
                <Suspense fallback={<PageLoading />}>
                  <FirstAccess />
                </Suspense>
              </ProtectedRoute>
            } />
            {/* Onboarding route */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoading />}>
                  <CompanyOnboarding />
                </Suspense>
              </ProtectedRoute>
            } />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={
                <Suspense fallback={<PageLoading />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="invoices" element={
                <Suspense fallback={<PageLoading />}>
                  <Invoices />
                </Suspense>
              } />
              <Route path="reports" element={
                <Suspense fallback={<PageLoading />}>
                  <Reports />
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<PageLoading />}>
                  <Users />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<PageLoading />}>
                  <Settings />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
