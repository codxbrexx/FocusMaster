import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAiStore } from '@/store/useAiStore';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const burnoutStyles: Record<string, { label: string; style: string }> = {
  low: { label: 'Low Fatigue', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  moderate: { label: 'Moderate Fatigue', style: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  high: { label: 'High Fatigue Risk', style: 'bg-red-500/10 text-red-500 border-red-500/30' },
};

export function WeeklyDigestCard() {
  const { weeklyDigest, digestLoading, fetchWeeklyDigest } = useAiStore();

  useEffect(() => {
    fetchWeeklyDigest();
  }, [fetchWeeklyDigest]);

  if (digestLoading && !weeklyDigest) {
    return (
      <motion.div variants={item}>
        <Card className="bg-card border border-border/50 shadow-sm">
          <CardContent className="p-6 flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!weeklyDigest) return null;

  const burnoutInfo = burnoutStyles[weeklyDigest.burnoutRisk] || burnoutStyles.low;

  return (
    <motion.div variants={item}>
      <Card className="bg-card border border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            AI Weekly Digest
          </CardTitle>

          <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${burnoutInfo.style}`}>
            <ShieldAlert className="h-3 w-3 mr-1" />
            {burnoutInfo.label}
          </Badge>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 sm:p-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              "{weeklyDigest.headline}"
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-muted/20 border border-border/30 rounded-lg p-2.5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Focus Hours</p>
                <p className="text-sm font-bold text-foreground">{weeklyDigest.weeklyFocusHours} hrs</p>
              </div>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-lg p-2.5 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-sm font-bold text-foreground">{weeklyDigest.sessionsCompleted}</p>
              </div>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-lg p-2.5 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-sm font-bold text-foreground">{weeklyDigest.streakDays} Days</p>
              </div>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-lg p-2.5 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Readiness</p>
                <p className="text-sm font-bold text-foreground">{weeklyDigest.examReadinessScore}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Highlights
            </h4>
            <div className="space-y-1.5">
              {weeklyDigest.keyHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3.5 flex items-start gap-3">
            <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                Next Week Focus
              </p>
              <p className="text-sm text-foreground/90 font-medium mt-0.5">
                {weeklyDigest.nextWeekAction}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
