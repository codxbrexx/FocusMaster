import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useAiStore } from '@/store/useAiStore';
import { BookOpen, RefreshCw, Calendar, Loader2, Settings, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const activityColors: Record<string, string> = {
  Study: 'bg-blue-50 text-blue-700 border-blue-100',
  Revision: 'bg-amber-50 text-amber-700 border-amber-100',
  Practice: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Mock Test': 'bg-purple-50 text-[#6E36E4] border-purple-100',
};

export function StudyPlanCard() {
  const { studyPlan, planLoading, planError, fetchStudyPlan, regenerateStudyPlan, studyProfile } =
    useAiStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyPlan();
  }, [fetchStudyPlan]);

  const plan = studyPlan?.plan;
  const currentWeek = plan?.weeks?.[0];

  // No study profile set up
  if (!studyProfile?.stream && !studyProfile?.subjects?.length) {
    return (
      <motion.div variants={item}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col items-center text-center justify-center min-h-[250px] font-sans text-slate-900 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6E36E4] flex items-center justify-center border border-purple-100">
            <BookOpen className="h-7 w-7" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Personalized AI Study Schedule</h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure your study stream and target subjects in settings to automatically generate an adaptive study schedule.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Profile Configuration Required</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/settings?tab=study')}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Set Up Profile</span>
            </button>
            <button
              onClick={() => navigate('/settings?tab=study')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-[#6E36E4] font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#6E36E4]" />
              <span>AI Quick Setup</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={item} className="font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#6E36E4]" />
            <h3 className="text-base font-bold text-slate-900">Adaptive AI Study Plan</h3>
          </div>
          <button
            onClick={regenerateStudyPlan}
            disabled={planLoading}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {planLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span>{plan ? 'Regenerate Schedule' : 'Generate Schedule'}</span>
          </button>
        </div>

        {planLoading && !plan && (
          <div className="flex items-center justify-center py-8 gap-2 text-xs font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#6E36E4]" />
            Analyzing profile and constructing optimal study roadmap...
          </div>
        )}

        {planError && !plan && (
          <p className="text-xs text-slate-500 text-center py-4">{planError}</p>
        )}

        {currentWeek && (
          <div className="space-y-3">
            {plan?.examDate && (
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#6E36E4]" />
                  <span>Exam Target Date: {new Date(plan.examDate).toLocaleDateString()}</span>
                </div>
                {currentWeek.theme && (
                  <span className="font-bold text-[#6E36E4] bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                    Week {currentWeek.weekNumber}: {currentWeek.theme}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2 pt-2">
              {currentWeek.dailyPlans?.slice(0, 5).map((dayPlan, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 w-12 pt-0.5 shrink-0 uppercase tracking-wider">
                    {dayPlan.day?.slice(0, 3)}
                  </span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {dayPlan.subjects?.map((subject, j) => (
                      <span
                        key={j}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          activityColors[subject.activity] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {subject.name} · {subject.hours}h
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {plan && (plan.weeks?.length ?? 0) > 1 && (
              <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                {plan.totalWeeks || plan.weeks?.length} total weeks planned · Showing Week {currentWeek.weekNumber}
              </p>
            )}
          </div>
        )}

        {!planLoading && !plan && !planError && (
          <div className="text-center py-6">
            <button
              onClick={regenerateStudyPlan}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-2xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Generate AI Study Schedule</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
