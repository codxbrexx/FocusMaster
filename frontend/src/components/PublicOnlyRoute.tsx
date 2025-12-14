import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const PublicOnlyRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-background"><LoadingSpinner size={40} /></div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
