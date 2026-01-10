import { Check, User, UserCog, Timer, Palette, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sub-components
import { TimerSettings } from './settings/TimerSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { AutomationSettings } from './settings/AutomationSettings';
import { SystemSettings } from './settings/SystemSettings';
import { ProfileSettings } from './settings/ProfileSettings';
import { AccountSettings } from './settings/AccountSettings';

export function Settings() {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: UserCog },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center backdrop-blur-lg justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure your focus environment.</p>
        </div>
        <Button
          onClick={() => toast.success('Settings saved')}
          variant="outline"
          className="gap-2 w-full sm:w-auto"
        >
          <Check className="w-4 h-4" /> Saved
        </Button>
      </div>

      <Tabs
        defaultValue="profile"
        className="w-full backdrop-blur-lg border border-primary/50 rounded-xl"
      >
        <TabsList className="w-full justify-start h-auto p-1 rounded-xl border-primary/50 mb-8 overflow-x-auto bg-background/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold capitalize transition-all"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

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
