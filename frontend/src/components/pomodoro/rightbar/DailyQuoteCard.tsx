import { useState } from 'react';
import { Quote } from 'lucide-react';

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'Small progress is still progress.', author: 'Unknown' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: 'Stay focused, go after your dreams and keep moving toward your goals.', author: 'LL Cool J' },
];

export const DailyQuoteCard = () => {
  const todayIdx = new Date().getDay() + Math.floor(new Date().getDate() / 3);
  const [idx] = useState(todayIdx % QUOTES.length);
  const quote = QUOTES[idx];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Quote className="w-4 h-4 text-[#6E36E4]" />
          Daily Focus Mindset
        </h3>
      </div>

      <div className="flex gap-3">
        <Quote className="w-6 h-6 text-[#6E36E4]/40 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
            "{quote.text}"
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};
