import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const events = [
    { day: 5, title: 'Project Review', type: 'work' },
    { day: 12, title: 'Deep Work', type: 'focus' },
    { day: 24, title: 'Sprint End', type: 'deadline' },
  ];

  const getDayEvents = (day: number) => events.filter((e) => e.day === day);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto space-y-6 pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">Manage your schedule and deadlines.</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold w-32 text-center select-none">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="grid grid-cols-7 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-sm font-medium text-muted-foreground uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)]">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-b border-r border-border/30 bg-secondary/5"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday =
                day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
              const dayEvents = getDayEvents(day);

              return (
                <div
                  key={day}
                  className={cn(
                    'p-3 border-b border-r border-border/30 relative hover:bg-accent/5 transition-colors group',
                    isToday && 'bg-primary/5'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-2',
                      isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {day}
                  </span>

                  <div className="space-y-1.5">
                    {dayEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'text-xs px-2 py-1 rounded-md truncate font-medium',
                          evt.type === 'work'
                            ? 'bg-blue-500/10 text-blue-500'
                            : evt.type === 'focus'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {evt.title}
                      </div>
                    ))}

                    {day % 10 === 0 && (
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Clock className="w-3 h-3" /> 2h Focus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6 justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500/50" /> Work
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500/50" /> Deep Focus
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" /> Deadlines
        </div>
      </div>
    </motion.div>
  );
}
