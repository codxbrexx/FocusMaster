import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import {
  Palette,
  Shield,
  Clock,
  Moon,
  RefreshCcw,
  Trash2,
  Check,
  Monitor,
  Volume2,
  Zap,
  Minus,
  Plus,
  Sun,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSettingsStore } from '../store/useSettingsStore';

// Helper component for Duration Inputs
interface DurationInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const DurationInput = ({ label, value, onChange, min = 1, max = 60 }: DurationInputProps) => (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-secondary/20 border border-border/50">
    <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </Label>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <div className="flex-1 flex justify-center items-center relative">
        <Input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) {
              if (val > max) onChange(max);
              else if (val < min && val !== 0)
                onChange(min);
              else onChange(val);
            } else if (e.target.value === '') {
              onChange(min);
            }
          }}
          onBlur={(e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < min) val = min;
            if (val > max) val = max;
            if (val !== value) onChange(val);
          }}
          className="w-20 h-10 text-2xl font-bold font-mono text-center p-0 border-none bg-transparent focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-muted-foreground absolute right-4 sm:right-8 md:right-6 pointer-events-none">
          min
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export function Settings() {
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'blue', 'green', 'purple');
    root.classList.add(settings.theme);
  }, [settings.theme]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure your focus environment.</p>
        </div>
        <Button onClick={() => toast.success('Settings saved')} variant="outline" className="gap-2">
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
          {/* --- TIMER TAB --- */}
          <TabsContent value="timer">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Timer Duration
                </CardTitle>
                <CardDescription>
                  Customize the length of your focus and break sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DurationInput
                    label="Focus"
                    value={settings.pomodoroDuration}
                    onChange={(v) => updateSettings({ pomodoroDuration: v })}
                    max={90}
                  />
                  <DurationInput
                    label="Short Break"
                    value={settings.shortBreakDuration}
                    onChange={(v) => updateSettings({ shortBreakDuration: v })}
                    max={15}
                  />
                  <DurationInput
                    label="Long Break"
                    value={settings.longBreakDuration}
                    onChange={(v) => updateSettings({ longBreakDuration: v })}
                    max={45}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border bg-secondary/10 mt-4">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 h-fit">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <Label className="text-base cursor-pointer" htmlFor="strict-mode">
                        Strict Mode
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">
                        Hides the pause button and prevents stopping the timer early.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="strict-mode"
                    checked={settings.strictMode}
                    onCheckedChange={(c) => updateSettings({ strictMode: c })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- APPEARANCE TAB --- */}
          <TabsContent value="appearance">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" /> Theme & Interface
                </CardTitle>
                <CardDescription>Choose the look that suits your eyes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'dark',
                      name: 'Charcoal',
                      bg: 'bg-[#0c0c0e]',
                      text: 'text-zinc-50',
                      icon: Moon,
                    },
                    {
                      id: 'blue',
                      name: 'Navy',
                      bg: 'bg-[#020617]',
                      text: 'text-blue-400',
                      icon: Monitor,
                    },
                    {
                      id: 'green',
                      name: 'Forest',
                      bg: 'bg-[#020905]',
                      text: 'text-emerald-400',
                      icon: Shield,
                    },
                    {
                      id: 'light',
                      name: 'Paper',
                      bg: 'bg-white',
                      text: 'text-zinc-900',
                      icon: Sun,
                    },
                  ].map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => updateSettings({ theme: theme.id as any })}
                      className={`
                        relative cursor-pointer group rounded-xl border-2 transition-all duration-200 overflow-hidden
                        ${settings.theme === theme.id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-border'}
                      `}
                    >
                      {/* Fake UI Preview */}
                      <div className={`h-28 w-full p-3 ${theme.bg} flex flex-col gap-2`}>
                        <div
                          className={`w-3/4 h-2 rounded-full opacity-20 bg-white`}
                        />
                        <div
                          className={`w-1/2 h-2 rounded-full opacity-20 bg-white`}
                        />
                        {/* Dot Matrix Preview hint */}
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                          backgroundSize: '12px 12px'
                        }} />

                        <div className="mt-auto flex justify-between items-center z-10">
                          <theme.icon className={`w-5 h-5 ${theme.text}`} />
                          {settings.theme === theme.id && (
                            <div className="bg-primary rounded-full p-1">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-2 text-center text-sm font-medium bg-secondary/50">
                        {theme.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- AUTOMATION TAB --- */}
          <TabsContent value="automation">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Workflow
                </CardTitle>
                <CardDescription>Automate the transitions between your sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: 'autoStartBreak',
                    label: 'Auto-start Breaks',
                    desc: 'Timer starts break immediately after focus ends.',
                    val: settings.autoStartBreak,
                  },
                  {
                    id: 'autoStartPomodoro',
                    label: 'Auto-start Focus',
                    desc: 'Timer starts focus immediately after break ends.',
                    val: settings.autoStartPomodoro,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-secondary/20 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="text-base cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      id={item.id}
                      checked={item.val}
                      onCheckedChange={(c) => updateSettings({ [item.id]: c })}
                    />
                  </div>
                ))}

                {/* Daily Goal */}
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card mt-6">
                  <div>
                    <Label className="text-base">Daily Goal</Label>
                    <p className="text-sm text-muted-foreground">Sessions to complete per day.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-background shadow-sm"
                      onClick={() =>
                        updateSettings({ dailyGoal: Math.max(1, settings.dailyGoal - 1) })
                      }
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold">{settings.dailyGoal}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-background shadow-sm"
                      onClick={() => updateSettings({ dailyGoal: settings.dailyGoal + 1 })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- SYSTEM TAB --- */}
          <TabsContent value="system">
            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" /> Sound & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play chimes when timers complete.
                      </p>
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

              <Card className="border border-destructive/20 bg-destructive/5 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                    <Trash2 className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Reset Default Settings</p>
                    <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleReset} className="gap-2">
                    <RefreshCcw className="w-4 h-4" /> Reset Everything
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
