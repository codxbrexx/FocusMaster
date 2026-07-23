import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAiStore } from '@/store/useAiStore';
import { BookOpen, RefreshCw, Calendar, Loader2, Settings, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const activityColors: Record<string, string> = {
  Study: 'bg-blue-500/10 text-blue-500',
  Revision: 'bg-amber-500/10 text-amber-500',
  Practice: 'bg-emerald-500/10 text-emerald-500',
  'Mock Test': 'bg-purple-500/10 text-purple-500',
};

export function StudyPlanCard() {
  const { studyPlan, planLoading, planError, fetchStudyPlan, regenerateStudyPlan, studyProfile } =
    useAiStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyPlan();
  }, [fetchStudyPlan]);

  const plan = studyPlan?.plan;

  // Get the current week's plan (week 1 or the first available)
  const currentWeek = plan?.weeks?.[0];

  // No study profile set up
  if (!studyProfile?.stream && !studyProfile?.subjects?.length) {
    return (
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-card border border-border/50 p-5 sm:p-8 lg:p-10 transition-all duration-300 shadow-sm group hover:shadow-md hover:border-primary/30 flex flex-col items-center text-center justify-center min-h-[250px]">
          <div className="absolute inset-0 bg-none z-0 pointer-events-none" />
          
          <div className="relative z-10 space-y-5 flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">AI Study Plan</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-[320px] mx-auto">
                Set up your study profile to unlock a personalized, AI-powered study schedule.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
              AI insights unavailable right now
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button size="lg" onClick={() => navigate('/settings?tab=study')} className="gap-2 w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold">
                <Settings className="h-5 w-5" />
                Set Up Profile
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/settings?tab=study')} className="gap-2 w-full sm:w-auto rounded-xl transition-all border border-border/50 hover:bg-muted/50 font-semibold text-purple-500 hover:text-purple-400">
                <Sparkles className="h-5 w-5" />
                AI Auto-Setup
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={item}>
      <Card className="bg-card border border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Study Plan
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={regenerateStudyPlan}
              disabled={planLoading}
              className="text-xs gap-1"
            >
              {planLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {plan ? 'Regenerate' : 'Generate'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {planLoading && !plan && (
            <div className="flex items-center justify-center py-8 gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating your study plan...
            </div>
          )}

          {planError && !plan && (
            <p className="text-sm text-muted-foreground text-center py-4">{planError}</p>
          )}

          {currentWeek && (
            <div className="space-y-3">
              {plan?.examDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Exam: {new Date(plan.examDate).toLocaleDateString()}
                  {currentWeek.theme && (
                    <span className="ml-auto text-foreground/70">
                      Week {currentWeek.weekNumber}: {currentWeek.theme}
                    </span>
                  )}
                </div>
              )}

              {currentWeek.dailyPlans?.slice(0, 5).map((dayPlan, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs font-medium text-muted-foreground w-10 pt-0.5 shrink-0">
                    {dayPlan.day?.slice(0, 3)}
                  </span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {dayPlan.subjects?.map((subject, j) => (
                      <span
                        key={j}
                        className={`text-[11px] px-2 py-0.5 rounded-full ${activityColors[subject.activity] || 'bg-muted/30 text-foreground/70'}`}
                      >
                        {subject.name} · {subject.hours}h
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {plan && plan.weeks.length > 1 && (
                <p className="text-[11px] text-muted-foreground text-center pt-2">
                  {plan.totalWeeks} weeks planned · Showing week {currentWeek.weekNumber}
                </p>
              )}
            </div>
          )}

          {!planLoading && !plan && !planError && (
            <div className="text-center py-6">
              <Button variant="outline" size="sm" onClick={regenerateStudyPlan} className="gap-2">
                <BookOpen className="h-3.5 w-3.5" />
                Generate Study Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
