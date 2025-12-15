import { Palette, Moon, Monitor, Shield, Sun, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useSettingsStore } from '@/store/useSettingsStore';

export function AppearanceSettings() {
    const { settings, updateSettings } = useSettingsStore();

    const themes = [
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
    ];

    return (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" /> Theme & Interface
                </CardTitle>
                <CardDescription>Choose the look that suits your eyes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((theme) => (
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
    );
}
