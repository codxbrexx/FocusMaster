import { useState } from 'react';
import { RequirePermission } from '../components/guards/RequirePermission';
import { Settings, Shield, Zap, Bell, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const TABS = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'focus', label: 'Focus Defaults', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <RequirePermission permission="MANAGE_SYSTEM">
      <div className="max-w-5xl mx-auto pb-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage global configurations for FocusMaster.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <div className="flex-1 glass-card rounded-2xl p-6 md:p-8 min-h-[500px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'focus' && <FocusSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'notifications' && (
                <div className="text-center text-muted-foreground py-20">
                  Notification settings coming soon.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
};

const GeneralSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Application Basics</h3>
      <div className="grid gap-4 max-w-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">App Name</label>
          <input
            type="text"
            defaultValue="FocusMaster"
            className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Support Email</label>
          <input
            type="email"
            defaultValue="support@focusmaster.app"
            className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-border/30">
      <h3 className="text-lg font-semibold text-foreground mb-4">Maintenance</h3>
      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/40">
        <div>
          <h4 className="font-medium text-foreground">Maintenance Mode</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Prevent non-admin users from accessing the app.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>

    <div className="pt-4">
      <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
        <Save size={18} />
        Save Changes
      </button>
    </div>
  </div>
);

const FocusSettings = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">Timer Defaults</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Pomodoro (min)</label>
        <input
          type="number"
          defaultValue="25"
          className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Short Break (min)</label>
        <input
          type="number"
          defaultValue="5"
          className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Long Break (min)</label>
        <input
          type="number"
          defaultValue="15"
          className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>
    </div>

    <div className="pt-6 border-t border-border/30">
      <h3 className="text-lg font-semibold text-foreground mb-4">Behavior</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 rounded border-border/50 bg-secondary/30 text-primary focus:ring-primary/50"
          />
          <label className="text-sm text-foreground">Auto-start Breaks</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border/50 bg-secondary/30 text-primary focus:ring-primary/50"
          />
          <label className="text-sm text-foreground">Auto-start Pomodoros</label>
        </div>
      </div>
    </div>

    <div className="pt-4">
      <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
        <Save size={18} />
        Save Defaults
      </button>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">Access Control</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/40">
        <div>
          <h4 className="font-medium text-foreground">Enforce 2FA for Admins</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Require two-factor authentication for all users with MANAGE_SYSTEM permission.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/40">
        <div>
          <h4 className="font-medium text-foreground">Session Timeout</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Automatically log out inactive users after 1 hour.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <div className="w-11 h-6 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  </div>
);
