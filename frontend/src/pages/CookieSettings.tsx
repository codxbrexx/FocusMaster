import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/api';
import { ArrowLeft, Shield, LineChart, Target, Save } from 'lucide-react';

export function CookieSettings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          essential: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        };
      } catch {
        // Fallback to default
      }
    }
    return {
      essential: true,
      analytics: false,
      marketing: false,
    };
  });

  const handleSave = async () => {
    const updatedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(updatedPreferences));
    
    try {
      await api.post('/gdpr/log-consent', { preferences: updatedPreferences });
      toast.success('Cookie preferences saved successfully');
    } catch {
      toast.success('Cookie preferences saved locally'); // Still show success if offline/not logged in
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
              Cookie Preferences
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage how we use cookies to personalize your experience.
            </p>
          </div>
          <Badge variant="secondary" className="font-normal self-start md:self-center shrink-0">
            Privacy Centric
          </Badge>
        </div>
        
        <div className="space-y-6">
          {/* Essential */}
          <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-1">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-lg">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Required for core functionality like security, session management, and authentication. These cookies cannot be turned off.
                  </p>
                </div>
              </div>
              <Switch checked={true} disabled={true} />
            </CardContent>
          </Card>
          
          {/* Analytics */}
          <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-1">
                  <LineChart className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-lg">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Help us understand how you use our app (e.g. tracking duration of focus sessions, page navigation patterns) so we can optimize performance.
                  </p>
                </div>
              </div>
              <Switch 
                checked={preferences.analytics}
                onCheckedChange={(val) => setPreferences({...preferences, analytics: val})}
              />
            </CardContent>
          </Card>
          
          {/* Marketing */}
          <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-1">
                  <Target className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-lg">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Used to deliver personalized recommendations and track feature adoption metrics to improve feature discoverability.
                  </p>
                </div>
              </div>
              <Switch 
                checked={preferences.marketing}
                onCheckedChange={(val) => setPreferences({...preferences, marketing: val})}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} className="w-full sm:w-auto px-8 gap-2 shadow-glow">
            <Save className="w-4 h-4" /> Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
