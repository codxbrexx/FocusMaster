import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavigatorProps {
  selectedDate: Date;
  changeDate: (days: number) => void;
  isToday: boolean;
}

export function DateNavigator({ selectedDate, changeDate, isToday }: DateNavigatorProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between font-sans text-slate-900">
      <button
        onClick={() => changeDate(-1)}
        className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6E36E4]">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="text-center flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">
            {selectedDate
              .toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              .replace(',', '')}
          </span>
          {isToday && (
            <span className="text-[10px] font-bold text-[#6E36E4] bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => changeDate(1)}
        disabled={isToday}
        className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
