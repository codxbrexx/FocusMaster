import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SESSION_TAGS = ['Study', 'Work', 'Reading', 'Coding', 'Writing', 'Research', 'Design'];

interface SessionManagerProps {
  activeTasks: any[];
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  sessionCount: number;
}

export const SessionManager = ({
  activeTasks,
  selectedTaskId,
  setSelectedTaskId,
  selectedTag,
  setSelectedTag,
  sessionCount,
}: SessionManagerProps) => {
  return (
    <div className="w-full space-y-5 pt-4 font-sans text-slate-900">
      {/* Tag pills */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Session Category
        </p>
        <div className="flex flex-wrap gap-2">
          {SESSION_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-50 text-[#6E36E4] border-purple-200 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task select */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Linked Task
        </p>
        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
          <SelectTrigger
            id="task-select"
            className="h-10 text-xs font-semibold bg-white border border-slate-200/80 text-slate-900 rounded-xl hover:border-slate-300 shadow-2xs"
          >
            <SelectValue placeholder="No task selected" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200/80 rounded-xl shadow-lg">
            <SelectItem value="none" className="text-xs font-semibold cursor-pointer">
              No task selected
            </SelectItem>
            {activeTasks.map((t) => (
              <SelectItem
                key={t._id}
                value={t._id}
                className="text-xs font-semibold cursor-pointer focus:bg-purple-50 focus:text-[#6E36E4]"
              >
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[
          { label: "Today's Focus", value: sessionCount > 0 ? `${sessionCount * 25}m` : '0m' },
          { label: 'Completed Cycles', value: `${sessionCount} / 8` },
          { label: 'Focus Efficiency', value: sessionCount > 0 ? `${Math.min(sessionCount * 12, 100)}%` : '100%' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center"
          >
            <p className="text-base font-bold font-mono text-slate-900">{value}</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
