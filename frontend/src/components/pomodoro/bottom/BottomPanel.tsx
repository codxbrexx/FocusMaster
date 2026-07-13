import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BottomPanelProps {
  sessionCount: number;
  selectedTaskId: string;
}

export const BottomPanel = ({ sessionCount, selectedTaskId }: BottomPanelProps) => {
  const { sessions } = useHistoryStore();
  const { tasks } = useTaskStore();
  const { settings } = useSettingsStore();
  const goal = settings.dailyGoal || 8;

  const selectedTask = tasks.find((t) => t._id === selectedTaskId);

  const stats = useMemo(() => {
    const today = new Date();
    const todaySessions = sessions.filter((s) => {
      const d = new Date(s.startTime);
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const focusMin = todaySessions.filter((s) => s.type === 'pomodoro').reduce((acc, s) => acc + s.duration, 0);
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const productivity = goal > 0 ? Math.min(Math.round((sessionCount / goal) * 100), 100) : 0;
    return { focusMin, completedTasks, productivity };
  }, [sessions, tasks, sessionCount, goal]);

  const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
  const progress = Math.min((sessionCount / goal) * 100, 100);

  const timeline = useMemo(() => {
    const today = new Date();
    return sessions
      .filter((s) => {
        const d = new Date(s.startTime);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      })
      .slice(0, 4)
      .map((s) => ({
        time: new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        label: s.type === 'pomodoro' ? (s.tag || 'Focus Session') : 'Break',
        type: s.type,
      }));
  }, [sessions]);

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1: Current Goal */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Current Goal</p>
            <p className="text-sm font-semibold text-foreground mb-3 truncate">
              {selectedTask ? selectedTask.title : 'No task selected'}
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Daily progress</span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-secondary" />
              <p className="text-[10px] text-muted-foreground">{sessionCount} of {goal} sessions completed</p>
            </div>
          </div>

          {/* Column 2: Today's Timeline */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Today's Timeline</p>
            {timeline.length === 0 ? (
              <p className="text-xs text-muted-foreground">No sessions yet today.</p>
            ) : (
              <div className="space-y-2.5">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[11px] tabular-nums text-muted-foreground w-16 flex-shrink-0">{item.time}</span>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.type === 'pomodoro' ? 'bg-primary' : 'bg-green-500'}`} />
                    <span className="text-sm text-foreground truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Daily Summary */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Daily Summary</p>
            <div className="space-y-3">
              {[
                { label: 'Focus Time', value: fmtMin(stats.focusMin) },
                { label: 'Tasks Completed', value: `${stats.completedTasks}` },
                { label: 'Sessions Finished', value: `${sessionCount}` },
                { label: 'Productivity', value: `${stats.productivity}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
