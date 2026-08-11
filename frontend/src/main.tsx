import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID'}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
);

// Register Service Worker in production, unregister in development
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registered: ', reg))
        .catch((err) => console.log('SW registration failed: ', err));
    } else {
      // In Dev, unregister any existing service workers to prevent caching Vite assets
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log('SW unregistered for development');
        }
      });
    }
  });
}
