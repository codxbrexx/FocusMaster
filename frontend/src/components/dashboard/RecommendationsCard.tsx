import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAiStore } from '@/store/useAiStore';
import {
  Zap,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Heart,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const typeIcons: Record<string, LucideIcon> = {
  focus: Zap,
  streak: Flame,
  timing: Clock,
  tasks: Target,
  volume: BarChart3,
  wellness: Heart,
  onboarding: AlertCircle,
};

const priorityStyles: Record<string, string> = {
  high: 'border-l-amber-500 bg-amber-500/5',
  medium: 'border-l-blue-500 bg-blue-500/5',
  low: 'border-l-emerald-500 bg-emerald-500/5',
};

export function RecommendationsCard() {
  const { recommendations, recsLoading, fetchRecommendations } = useAiStore();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (recsLoading && recommendations.length === 0) {
    return (
      <motion.div variants={item}>
        <Card className="bg-card border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-12 bg-muted/30 rounded-lg" />
              <div className="h-12 bg-muted/30 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <motion.div variants={item}>
      <Card className="bg-card border border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Smart Nudges
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
          {recommendations.map((rec, i) => {
            const Icon = typeIcons[rec.type] || Zap;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${priorityStyles[rec.priority] || priorityStyles.medium}`}
              >
                <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-sm text-foreground/80">{rec.message}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
