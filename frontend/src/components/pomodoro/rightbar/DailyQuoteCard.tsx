import { useState } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-foreground">Daily Quote</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex gap-3">
          <Quote className="w-7 h-7 text-primary/30 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-relaxed italic">
              "{quote.text}"
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
