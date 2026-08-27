import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
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
  high: 'bg-amber-50 border-amber-200/80 text-amber-900',
  medium: 'bg-blue-50 border-blue-200/80 text-blue-900',
  low: 'bg-emerald-50 border-emerald-200/80 text-emerald-900',
};

export function RecommendationsCard() {
  const { recommendations, recsLoading, fetchRecommendations } = useAiStore();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (recsLoading && recommendations.length === 0) {
    return (
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100/60 rounded-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <motion.div variants={item} className="font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <TrendingUp className="h-4 w-4 text-[#6E36E4]" />
          <h3 className="text-base font-bold text-slate-900">Smart AI Nudges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => {
            const Icon = typeIcons[rec.type] || Zap;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${priorityStyles[rec.priority] || priorityStyles.medium}`}
              >
                <Icon className="h-4 w-4 mt-0.5 shrink-0 text-[#6E36E4]" />
                <p className="text-xs font-semibold leading-relaxed">{rec.message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
