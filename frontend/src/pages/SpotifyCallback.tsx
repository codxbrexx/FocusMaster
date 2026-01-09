import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { LoadingPage } from '@/components/ui/LoadingPage';

export const SpotifyCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    const processedRef = useRef(false);

    useEffect(() => {
        const exchangeCodeForToken = async () => {
            // Prevent double-firing in Strict Mode
            if (processedRef.current) return;
            processedRef.current = true;

            if (!code) {
                toast.error('No authorization code found');
                navigate('/spotify');
                return;
            }

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/spotify/callback`, {
                    code
                }, {
                    withCredentials: true
                });

                if (response.data.success) {
                    toast.success('Successfully connected to Spotify!');
                    // Small delay to ensure toast is seen and state propagates
                    setTimeout(() => navigate('/spotify'), 500);
                }
            } catch (error: any) {
                console.error('Spotify Auth Error:', error);
                toast.error(error.response?.data?.message || 'Failed to connect Spotify');
                navigate('/spotify');
            }
        };

        exchangeCodeForToken();
    }, [code, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-matrix text-foreground">
            <div className="fixed inset-0 z-50">
                <LoadingPage customMessage="Connecting to Spotify..." />
            </div>
            <p className="text-lg font-medium text-muted-foreground animate-pulse">Connecting to Spotify...</p>
        </div>
    );
};
