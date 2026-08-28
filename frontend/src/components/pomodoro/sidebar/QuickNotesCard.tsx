import { useState } from 'react';
import { Save, NotebookPen } from 'lucide-react';

const STORAGE_KEY = 'fm-quick-notes';

export const QuickNotesCard = () => {
  const [note, setNote] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <NotebookPen className="w-4 h-4 text-[#6E36E4]" />
          Quick Scratchpad
        </h3>
        <button
          id="quick-notes-save"
          onClick={save}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
            saved
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <Save className="w-3 h-3" />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <textarea
        id="quick-notes-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => localStorage.setItem(STORAGE_KEY, note)}
        placeholder="Scratchpad for session thoughts & key takeaways..."
        rows={4}
        className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200/80 rounded-xl p-3 resize-none outline-none focus:border-[#6E36E4] transition-colors leading-relaxed"
      />
    </div>
  );
};
