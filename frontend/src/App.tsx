import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeviceProvider } from './context/DeviceContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { GlobalTimer } from './components/GlobalTimer';
import { LoadingPage } from './components/ui/LoadingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';

// Lazy Load Pages/Components
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const PomodoroTimer = lazy(() => import('./components/pomodoro/PomodoroTimer').then(module => ({ default: module.PomodoroTimer })));
const TaskManager = lazy(() => import('./components/TaskManager').then(module => ({ default: module.TaskManager })));
const Analytics = lazy(() => import('./components/Analytics').then(module => ({ default: module.Analytics })));
const ClockInOut = lazy(() => import('./components/ClockInOut').then(module => ({ default: module.ClockInOut })));
const SpotifyPanel = lazy(() => import('./components/SpotifyPanel').then(module => ({ default: module.SpotifyPanel })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const Profile = lazy(() => import('./components/Profile').then(module => ({ default: module.Profile })));
const Calendar = lazy(() => import('./components/Calendar').then(module => ({ default: module.Calendar })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const SpotifyCallback = lazy(() => import('./pages/SpotifyCallback').then(module => ({ default: module.SpotifyCallback })));

// Admin Components
const AdminShell = lazy(() => import('./admin/components/layout/AdminShell').then(module => ({ default: module.AdminShell })));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const UserManagement = lazy(() => import('./admin/pages/UserManagement').then(module => ({ default: module.UserManagement })));
const AuditLogsPage = lazy(() => import('./admin/pages/AuditLogsPage').then(module => ({ default: module.AuditLogsPage })));
const LiveActivityPage = lazy(() => import('./admin/pages/LiveActivityPage').then(module => ({ default: module.LiveActivityPage })));
const SystemHealthPage = lazy(() => import('./admin/pages/SystemHealthPage').then(module => ({ default: module.SystemHealthPage })));
const SystemSettingsPage = lazy(() => import('./admin/pages/SystemSettingsPage').then(module => ({ default: module.SystemSettingsPage })));
const IssueReportsPage = lazy(() => import('./admin/pages/IssueReportsPage').then(module => ({ default: module.IssueReportsPage })));

const queryClient = new QueryClient();

const App = () => {

  return (
    <DeviceProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <GlobalTimer />
            <BrowserRouter>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route element={<PublicOnlyRoute />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<TaskManager />} />
                      <Route path="/pomodoro" element={<PomodoroTimer />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/clock" element={<ClockInOut />} />
                      <Route path="/spotify" element={<SpotifyPanel />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/callback" element={<SpotifyCallback />} />
                    </Route>
                  </Route>

                  {/* ADMIN ROUTES */}
                  <Route path="/admin" element={<AdminShell />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="audit" element={<AuditLogsPage />} />
                    <Route path="live" element={<LiveActivityPage />} />
                    <Route path="health" element={<SystemHealthPage />} />
                    <Route path="support" element={<IssueReportsPage />} />
                    <Route path="settings" element={<SystemSettingsPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </DeviceProvider>
  );
};

export default App;
