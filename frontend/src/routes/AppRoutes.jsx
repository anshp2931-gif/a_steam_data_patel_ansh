import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const AnalyticsPage = lazy(() => import('../pages/dashboard/AnalyticsPage'));
const GamesListPage = lazy(() => import('../pages/games/GamesListPage'));
const GameDetailPage = lazy(() => import('../pages/games/GameDetailPage'));
const GameFormPage = lazy(() => import('../pages/games/GameFormPage'));
const UsersListPage = lazy(() => import('../pages/users/UsersListPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/profile/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
      <p className="text-dark-400 dark:text-dark-400 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes — Inside Dashboard Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route
            path="dashboard/analytics"
            element={
              <AdminRoute>
                <AnalyticsPage />
              </AdminRoute>
            }
          />
          <Route path="games" element={<GamesListPage />} />
          <Route path="games/:appid" element={<GameDetailPage />} />
          <Route
            path="games/new"
            element={
              <AdminRoute>
                <GameFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="games/:appid/edit"
            element={
              <AdminRoute>
                <GameFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="users"
            element={
              <AdminRoute>
                <UsersListPage />
              </AdminRoute>
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
