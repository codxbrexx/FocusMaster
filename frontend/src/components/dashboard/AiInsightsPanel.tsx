import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAiStore } from '@/store/useAiStore';
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  Zap,
  Target,
  Clock,
  Flame,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStrokeColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/30"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBreakdownBar({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: LucideIcon;
}) {
  const getBarColor = () => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{score}</span>
    </div>
  );
}

export function AiInsightsPanel() {
  const { insights, isLoading, error, fetchAiInsights } = useAiStore();

  useEffect(() => {
    fetchAiInsights();
  }, [fetchAiInsights]);

  if (isLoading) {
    return (
      <motion.div variants={item}>
        <Card className="bg-card border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted/50 rounded" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-16 bg-muted/30 rounded-lg" />
              <div className="h-16 bg-muted/30 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error && !insights) {
    return (
      <motion.div variants={item}>
        <Card className="bg-card border border-border/50 shadow-sm">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">AI insights unavailable right now.</p>
            <button
              onClick={fetchAiInsights}
              className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="h-3 w-3" /> Try again
            </button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!insights) return null;

  const { productivityScore, scoreBreakdown, insights: aiInsights, recommendations, summary, prepAdvice } = insights;

  return (
    <motion.div variants={item} className="lg:col-span-3">
      <Card className="bg-card border border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Sparkles className="h-5 w-5 text-purple-500 fill-purple-500/20" />
              AI Insights
            </CardTitle>
            <button
              onClick={fetchAiInsights}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 hover:border-border"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Productivity Score */}
            <div className="flex flex-col items-center gap-3">
              <ScoreRing score={productivityScore} />
              <p className="text-sm font-medium">Productivity Score</p>
              <div className="w-full space-y-2">
                <ScoreBreakdownBar
                  label="Consistency"
                  score={scoreBreakdown.consistency.score}
                  icon={Flame}
                />
                <ScoreBreakdownBar
                  label="Completion"
                  score={scoreBreakdown.completion.score}
                  icon={Target}
                />
                <ScoreBreakdownBar
                  label="Focus Quality"
                  score={scoreBreakdown.focusQuality.score}
                  icon={Zap}
                />
                <ScoreBreakdownBar
                  label="Time Mgmt"
                  score={scoreBreakdown.timeManagement.score}
                  icon={Clock}
                />
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Insights
              </h4>
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 text-sm text-foreground/80"
                >
                  {insight}
                </div>
              ))}
            </div>

            {/* Recommendations + Summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Recommendations
              </h4>
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm text-foreground/80"
                >
                  {rec}
                </div>
              ))}

              {summary && (
                <div className="mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="text-xs text-purple-400 font-medium mb-1">✨ Daily Summary</p>
                  <p className="text-sm text-foreground/80">{summary}</p>
                </div>
              )}

              {prepAdvice && (
                <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Preparation Advice</p>
                  <p className="text-sm text-foreground/80">{prepAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
