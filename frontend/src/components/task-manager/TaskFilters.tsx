import { Tag, Filter, Plus, X } from 'lucide-react';

interface TaskFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  filter: 'all' | 'high' | 'medium' | 'low';
  setFilter: (val: any) => void;
  isAdding: boolean;
  onToggleAdd: () => void;
  categories: string[];
}

export function TaskFilters({
  categoryFilter,
  setCategoryFilter,
  filter,
  setFilter,
  isAdding,
  onToggleAdd,
  categories,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans text-slate-900">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        Task Backlog & Priority Filter
      </h2>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        {/* Category Dropdown Select */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200/80 hover:bg-slate-50 font-semibold text-xs text-slate-700 py-2.5 pl-9 pr-8 rounded-xl shadow-2xs focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Priority Dropdown Select */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200/80 hover:bg-slate-50 font-semibold text-xs text-slate-700 py-2.5 pl-9 pr-8 rounded-xl shadow-2xs focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* New Task Button */}
        <button
          onClick={onToggleAdd}
          className={`font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer ${
            isAdding
              ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              : 'bg-[#6E36E4] hover:bg-[#5B2AC6] text-white'
          }`}
        >
          {isAdding ? (
            <>
              <X className="w-3.5 h-3.5" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add Task
            </>
          )}
        </button>
      </div>
    </div>
  );
}
