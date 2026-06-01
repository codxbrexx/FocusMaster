import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/services/api';

export function CookieSettings() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        // Handle parse error
      }
    }
  }, []);

  const handleSave = async () => {
    const updatedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(updatedPreferences));
    
    try {
      await api.post('/gdpr/log-consent', { preferences: updatedPreferences });
      toast.success('Cookie preferences saved successfully');
    } catch (error) {
      toast.success('Cookie preferences saved locally'); // Still show success if offline/not logged in
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cookie Preferences</h1>
        <p className="text-muted-foreground">Manage how we use cookies to personalize your experience.</p>
      </div>
      
      <div className="space-y-6">
        {/* Essential */}
        <div className="flex items-start justify-between space-x-4 p-4 rounded-lg border bg-card/50 backdrop-blur">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Essential Cookies</h3>
            <p className="text-sm text-muted-foreground">Required for core functionality like security, session management, and authentication.</p>
          </div>
          <Switch checked={true} disabled={true} />
        </div>
        
        {/* Analytics */}
        <div className="flex items-start justify-between space-x-4 p-4 rounded-lg border bg-card/50 backdrop-blur">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
            <p className="text-sm text-muted-foreground">Help us understand how you use our app so we can improve it.</p>
          </div>
          <Switch 
            checked={preferences.analytics}
            onCheckedChange={(val) => setPreferences({...preferences, analytics: val})}
          />
        </div>
        
        {/* Marketing */}
        <div className="flex items-start justify-between space-x-4 p-4 rounded-lg border bg-card/50 backdrop-blur">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
            <p className="text-sm text-muted-foreground">Used to deliver personalized recommendations and track ad performance.</p>
          </div>
          <Switch 
            checked={preferences.marketing}
            onCheckedChange={(val) => setPreferences({...preferences, marketing: val})}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <Button onClick={handleSave} className="w-full sm:w-auto px-8">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
