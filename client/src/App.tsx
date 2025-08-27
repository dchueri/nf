import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { Skeleton, SkeletonCard } from './components/ui/Skeleton';

// Lazy loading das páginas
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Invoices = lazy(() => import('./pages/Invoices').then(module => ({ default: module.Invoices })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const Users = lazy(() => import('./pages/Users').then(module => ({ default: module.Users })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));

// Loading fallback component
const PageLoading = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton height="2rem" width="12rem" />
        <Skeleton height="1rem" width="24rem" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
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
