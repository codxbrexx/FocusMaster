import { Volume2, Trash2, RefreshCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { toast } from 'sonner';

export function SystemSettings() {
  const { settings, updateSettings } = useSettingsStore();

  const handleReset = () => {
    updateSettings({
      pomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreak: false,
      autoStartPomodoro: false,
      soundEnabled: true,
      motivationalQuotes: true,
      strictMode: false,
      dailyGoal: 8,
      theme: 'dark',
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" /> Sound & Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play chimes when timers complete.</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(c) => updateSettings({ soundEnabled: c })}
            />
          </div>
          <div className="h-px bg-border/50" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Motivational Quotes</Label>
              <p className="text-sm text-muted-foreground">
                Show quotes during breaks to stay inspired.
              </p>
            </div>
            <Switch
              checked={settings.motivationalQuotes}
              onCheckedChange={(c) => updateSettings({ motivationalQuotes: c })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className=" border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive text-lg">
            <Trash2 className="w-5 h-5" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium">Reset Default Settings</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCcw className="w-4 h-4" /> Reset Everything
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
