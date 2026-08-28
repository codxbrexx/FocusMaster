import { useMemo } from 'react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useSettingsStore } from '@/store/useSettingsStore';

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
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
    const focusMin = todaySessions
      .filter((s) => s.type === 'pomodoro')
      .reduce((acc, s) => acc + s.duration, 0);
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
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .slice(0, 4)
      .map((s) => ({
        time: new Date(s.startTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        label: s.type === 'pomodoro' ? s.tag || 'Focus Session' : 'Break',
        type: s.type,
      }));
  }, [sessions]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs font-sans text-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Column 1: Current Goal */}
        <div className="space-y-3 md:pr-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Active Focus Goal
          </p>
          <p className="text-xs font-bold text-slate-900 truncate">
            {selectedTask ? selectedTask.title : 'No task selected'}
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-slate-500">Daily Target</span>
              <span className="text-[#6E36E4]">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6E36E4] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400">
              {sessionCount} of {goal} sessions completed
            </p>
          </div>
        </div>

        {/* Column 2: Today's Timeline */}
        <div className="space-y-3 pt-4 md:pt-0 md:px-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Today's Focus Timeline
          </p>
          {timeline.length === 0 ? (
            <p className="text-xs font-semibold text-slate-400 pt-2">No sessions logged yet today.</p>
          ) : (
            <div className="space-y-2">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold font-mono text-slate-400 w-16 shrink-0">
                    {item.time}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.type === 'pomodoro' ? 'bg-[#6E36E4]' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-900 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Daily Summary */}
        <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Daily Session Summary
          </p>
          <div className="space-y-2 text-xs font-semibold">
            {[
              { label: 'Total Focus', value: fmtMin(stats.focusMin) },
              { label: 'Completed Tasks', value: `${stats.completedTasks}` },
              { label: 'Sessions Finished', value: `${sessionCount}` },
              { label: 'Target Efficiency', value: `${stats.productivity}%` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-slate-600">
                <span>{label}</span>
                <span className="font-mono font-bold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
