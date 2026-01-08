import { Clock, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/store/useSettingsStore';
import { DurationInput } from './DurationInput';

export function TimerSettings() {
    const { settings, updateSettings } = useSettingsStore();

    return (
        <Card className="border-none shadow-none bg-card/50">
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
                        max={1000}
                    />
                    <DurationInput
                        label="Short Break"
                        value={settings.shortBreakDuration}
                        onChange={(v) => updateSettings({ shortBreakDuration: v })}
                        max={10}
                    />
                    <DurationInput
                        label="Long Break"
                        value={settings.longBreakDuration}
                        onChange={(v) => updateSettings({ longBreakDuration: v })}
                        max={45}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mt-4 gap-4 sm:gap-0">
                    <div className="flex gap-4 items-center">
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
    );
}
