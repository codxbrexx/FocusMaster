import { Palette, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function AppearanceSettings() {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" /> Theme & Interface
        </CardTitle>
        <CardDescription>Your current interface appearance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5">
          <div className="p-3 rounded-lg bg-primary/10">
            <Sun className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Light Mode</p>
            <p className="text-sm text-muted-foreground">Currently active theme</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
