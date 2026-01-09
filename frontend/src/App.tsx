import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient();

const App = () => {

  return (
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
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
