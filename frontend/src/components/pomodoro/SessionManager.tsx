import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
    <div className="w-full space-y-4 sm:space-y-6 pt-4 sm:pt-6">
      {/* Tag pills */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3">Session Tag</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SESSION_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 cursor-pointer text-[10px] sm:text-xs font-normal rounded-full transition-all duration-200 border ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Task select */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3">Working On</p>
        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
          <SelectTrigger
            id="task-select"
            className="h-8 sm:h-10 text-xs sm:text-sm bg-card border-border text-foreground rounded-lg sm:rounded-xl hover:border-primary/40 transition-colors focus:ring-primary/30"
          >
            <SelectValue placeholder="No task selected" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-lg sm:rounded-xl">
            <SelectItem value="none" className="text-xs sm:text-sm cursor-pointer">No task selected</SelectItem>
            {activeTasks.map((t) => (
              <SelectItem key={t._id} value={t._id} className="text-xs sm:text-sm cursor-pointer focus:bg-primary/10 focus:text-primary">
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Today's Focus", value: sessionCount > 0 ? `${sessionCount * 25}m` : '—' },
          { label: 'Current Cycle', value: `${sessionCount} / 8` },
          { label: 'Focus Score', value: sessionCount > 0 ? `${Math.min(sessionCount * 12, 100)}%` : '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-secondary rounded-lg sm:rounded-xl p-2 sm:p-3 border border-border/40 text-center"
          >
            <p className="text-sm sm:text-base font-bold text-foreground">{value}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0 sm:mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
