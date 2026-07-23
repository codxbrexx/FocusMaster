import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAiStore } from '@/store/useAiStore';
import { BookOpen, RefreshCw, Calendar, Loader2, Settings } from 'lucide-react';
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
        <Card className="bg-card border border-border/50 shadow-sm">
          <CardContent className="p-6 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Set up your study profile to get an AI-powered study plan.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')} className="gap-2">
              <Settings className="h-3.5 w-3.5" />
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
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
