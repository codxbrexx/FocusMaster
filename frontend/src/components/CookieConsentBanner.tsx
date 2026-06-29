import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('cookie-consent');
  });

  const logConsentToDatabase = async (preferences: any) => {
    try {
      await api.post('/gdpr/log-consent', { preferences });
    } catch (error) {
      console.error('Failed to log consent', error);
    }
  };

  const handleAcceptAll = () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    logConsentToDatabase(preferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    logConsentToDatabase(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 sm:p-6 z-[100] shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-foreground mb-1 text-lg">Cookie Preferences</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and improve our services.
            <a href="/privacy-policy" className="text-primary hover:underline ml-1">Learn more</a>
          </p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto border-border hover:bg-muted/50">
            Reject Non-Essential
          </Button>
          <Button onClick={handleAcceptAll} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            Accept All
          </Button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-4 sm:relative sm:right-auto sm:top-auto text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
