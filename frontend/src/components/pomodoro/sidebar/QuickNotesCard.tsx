import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Quick Notes</CardTitle>
          <button
            id="quick-notes-save"
            onClick={save}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
              saved
                ? 'bg-green-500/10 text-green-500'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            <Save className="w-3 h-3" />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <textarea
          id="quick-notes-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => localStorage.setItem(STORAGE_KEY, note)}
          placeholder="Write something important..."
          rows={4}
          className="w-full text-sm text-foreground placeholder-muted-foreground bg-secondary border border-border/40 rounded-xl p-3 resize-none outline-none focus:border-primary/40 transition-colors leading-relaxed"
        />
      </CardContent>
    </Card>
  );
};
