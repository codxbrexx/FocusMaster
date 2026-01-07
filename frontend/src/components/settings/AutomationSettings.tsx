import { Zap, Minus, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';

export function AutomationSettings() {
    const { settings, updateSettings } = useSettingsStore();

    const toggles = [
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
    ];

    return (
        <Card className="border-none shadow-none bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Workflow
                </CardTitle>
                <CardDescription>Automate the transitions between your sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {toggles.map((item) => (
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
    );
}
