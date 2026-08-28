import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
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

  const getStrokeColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#6E36E4';
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
          stroke="#f1f5f9"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-slate-900">{score}</span>
        <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
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
    if (score >= 60) return 'bg-[#6E36E4]';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      <span className="text-slate-500 font-medium w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span className="font-mono font-bold text-slate-800 w-7 text-right">{score}</span>
    </div>
  );
}

export function AiInsightsPanel() {
  const { insights, isLoading, error, fetchAiInsights, studyProfile } = useAiStore();

  useEffect(() => {
    fetchAiInsights();
  }, [fetchAiInsights]);

  if (isLoading) {
    return (
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-slate-100" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-48 bg-slate-100/60 rounded" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error && !insights) {
    return (
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-2xs space-y-3 font-sans text-slate-900">
          <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">AI insights unavailable right now.</p>
          <button
            onClick={fetchAiInsights}
            className="text-xs text-[#6E36E4] font-bold hover:underline inline-flex items-center gap-1 mx-auto cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Try again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!insights) return null;

  const {
    productivityScore,
    examReadinessScore,
    burnoutRisk,
    scoreBreakdown,
    insights: aiInsights,
    recommendations,
    summary,
    prepAdvice,
  } = insights;

  const activeStreamName = studyProfile?.stream || studyProfile?.customStreamName || null;

  const burnoutBadgeColors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200/80',
    high: 'bg-red-50 text-red-700 border-red-200/80',
  };

  return (
    <motion.div variants={item} className="font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-[#6E36E4]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Productivity Diagnostics</h3>
              {activeStreamName && (
                <span className="text-[11px] font-bold text-[#6E36E4]">
                  Stream: {activeStreamName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {examReadinessScore !== undefined && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                Exam Readiness: {examReadinessScore}%
              </span>
            )}
            {burnoutRisk && (
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-xl border capitalize ${
                  burnoutBadgeColors[burnoutRisk.toLowerCase()] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {burnoutRisk} Burnout Risk
              </span>
            )}
            <button
              onClick={fetchAiInsights}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Productivity Score Ring */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-3">
            <ScoreRing score={productivityScore ?? 0} />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Productivity Score
            </span>

            <div className="w-full space-y-2.5 pt-2 border-t border-slate-200/60">
              <ScoreBreakdownBar
                label="Consistency"
                score={scoreBreakdown?.consistency?.score ?? 0}
                icon={Flame}
              />
              <ScoreBreakdownBar
                label="Completion"
                score={scoreBreakdown?.completion?.score ?? 0}
                icon={Target}
              />
              <ScoreBreakdownBar
                label="Focus Quality"
                score={scoreBreakdown?.focusQuality?.score ?? 0}
                icon={Zap}
              />
              <ScoreBreakdownBar
                label="Time Mgmt"
                score={scoreBreakdown?.timeManagement?.score ?? 0}
                icon={Clock}
              />
            </div>
          </div>

          {/* AI Key Insights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key AI Diagnostics
            </h4>
            <div className="space-y-2.5">
              {(aiInsights || []).map((insight, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 leading-relaxed"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Strategic Recommendations
            </h4>
            <div className="space-y-2.5">
              {(recommendations || []).map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-medium text-emerald-900 leading-relaxed"
                >
                  {rec}
                </div>
              ))}

              {summary && (
                <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                  <p className="text-[11px] text-[#6E36E4] font-bold uppercase tracking-wider">✨ Daily AI Summary</p>
                  <p className="text-xs text-slate-700 font-medium">{summary}</p>
                </div>
              )}

              {prepAdvice && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Exam Prep Advice
                  </p>
                  <p className="text-xs text-slate-700 font-medium">{prepAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
