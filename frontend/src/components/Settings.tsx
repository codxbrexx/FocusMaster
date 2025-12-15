import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';

// Sub-components
import { TimerSettings } from './settings/TimerSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { AutomationSettings } from './settings/AutomationSettings';
import { SystemSettings } from './settings/SystemSettings';

export function Settings() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'blue', 'green', 'purple');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure your focus environment.</p>
        </div>
        <Button onClick={() => toast.success('Settings saved')} variant="outline" className="gap-2 w-full sm:w-auto">
          <Check className="w-4 h-4" /> Saved
        </Button>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-secondary/30 rounded-xl mb-8 overflow-x-auto">
          {['timer', 'appearance', 'automation', 'system'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="timer">
            <TimerSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
