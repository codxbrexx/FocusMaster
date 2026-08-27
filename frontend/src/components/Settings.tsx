import { Check, UserCog, Timer, Palette, Zap, Monitor, GraduationCap, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';

// Sub-components
import { TimerSettings } from './settings/TimerSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { AutomationSettings } from './settings/AutomationSettings';
import { SystemSettings } from './settings/SystemSettings';
import { AccountSettings } from './settings/AccountSettings';
import { StudyProfileSettings } from './settings/StudyProfileSettings';

export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'account';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: UserCog },
    { id: 'study', label: 'Study', icon: GraduationCap },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 p-4 md:p-6 pb-24 font-sans text-slate-900"
    >
      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <SettingsIcon className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Preferences & System Config</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workspace & Account Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Configure timer intervals, study stream profile, appearance themes, and automation rules.
          </p>
        </div>

        <button
          onClick={() => toast.success('Settings updated successfully!')}
          className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Check className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {/* Tabs Container */}
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
      >
        <TabsList className="w-full justify-start h-auto p-1.5 rounded-2xl border border-slate-200/60 bg-slate-100/80 overflow-x-auto flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`flex-1 min-w-[130px] gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#6E36E4] shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6E36E4]' : 'text-slate-400'}`} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <TabsContent value="account" className="mt-0">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="study" className="mt-0">
            <StudyProfileSettings />
          </TabsContent>

          <TabsContent value="timer" className="mt-0">
            <TimerSettings />
          </TabsContent>

          <TabsContent value="appearance" className="mt-0">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="automation" className="mt-0">
            <AutomationSettings />
          </TabsContent>

          <TabsContent value="system" className="mt-0">
            <SystemSettings />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
