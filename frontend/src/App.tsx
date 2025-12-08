import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { Analytics } from './components/Analytics';
import { ClockInOut } from './components/ClockInOut';
import { SpotifyPanel } from './components/SpotifyPanel';
import { Settings } from './components/Settings';
import { Calendar } from './components/Calendar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GlobalTimer } from './components/GlobalTimer';

const queryClient = new QueryClient();

const App = () => {
  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalTimer />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/tasks" element={<TaskManager />} />
                <Route path="/pomodoro" element={<PomodoroTimer />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/clock" element={<ClockInOut />} />
                <Route path="/spotify" element={<SpotifyPanel />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
