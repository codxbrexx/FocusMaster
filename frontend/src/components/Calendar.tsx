import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, isAfter, isBefore } from 'date-fns';
import { CalendarEventDialog } from './calendar/CalendarEventDialog';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const queryClient = useQueryClient();

  // Fetch Tasks (Events)
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'], // ideally filter by month range in future optimization
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tasks`, { withCredentials: true });
      return res.data;
    }
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newEvent: any) => {
      const res = await axios.post(`${API_URL}/tasks`, newEvent, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Event scheduled successfully');
      setIsDialogOpen(false);
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedEvent: any) => {
      const res = await axios.put(`${API_URL}/tasks/${updatedEvent._id}`, updatedEvent, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Event updated');
      setIsDialogOpen(false);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/tasks/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Event deleted');
      setIsDialogOpen(false);
    }
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(undefined); // Using event date
    setIsDialogOpen(true);
  };

  const handleSave = (eventData: any) => {
    if (editingEvent) {
      updateMutation.mutate(eventData);
    } else {
      createMutation.mutate(eventData);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Padding days for grid alignment
  const startDay = startOfMonth(currentDate).getDay();
  const paddingDays = Array.from({ length: startDay });

  const getEventsForDay = (date: Date) => {
    return tasks.filter((task: any) => {
      // Fallback or legacy support
      if (!task.dueDate && !task.deadline) return false;

      const start = task.dueDate ? parseISO(task.dueDate) : parseISO(task.deadline);
      const end = task.deadline ? parseISO(task.deadline) : start;

      // Check if 'date' is within the start-end range (inclusive)
      return (isSameDay(date, start) || isSameDay(date, end) || (isAfter(date, start) && isBefore(date, end)));
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold font-heading tracking-tight text-foreground">
            Calendar
          </h2>
          <p className="text-muted-foreground mt-1">Plan your Schedule, Events, and Goals.</p>
        </div>

        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-2 rounded-2xl border border-border shadow-sm">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-bold min-w-[160px] text-center selecting-none font-heading text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <Button
          onClick={() => { setSelectedDate(new Date()); setEditingEvent(null); setIsDialogOpen(true); }}
          className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      <Card className="border border-border shadow-lg bg-card/40 backdrop-blur-xl overflow-hidden rounded-xl">
        <CardHeader className="border-b border-border pb-4 bg-card/20">
          <div className="grid grid-cols-7 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-sm font-semibold text-muted-foreground uppercase tracking-widest py-2"
              >
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-[110px]">
              {/* Empty padding cells */}
              {paddingDays.map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-b border-r border-border bg-muted/20"
                />
              ))}

              {/* Calendar Days */}
              {days.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                const dayEvents = getEventsForDay(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      'p-2 border-b border-r border-border relative hover:bg-muted/50 transition-all cursor-pointer group h-[110px] flex flex-col gap-1 overflow-hidden',
                      isToday && 'bg-primary/5'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          'text-[11px] font-medium w-6 h-6 flex items-center justify-center rounded-full transition-colors',
                          isToday ? 'bg-primary text-primary-foreground shadow-glow-sm' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-muted-foreground bg-muted px-1.5 rounded-full border border-border">
                          +{dayEvents.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar">
                      {dayEvents.slice(0, 4).map((evt: any) => (
                        <div
                          key={evt._id}
                          onClick={(e) => handleEventClick(e, evt)}
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-[4px] truncate font-medium border hover:scale-[1.02] transition-transform cursor-pointer shadow-sm shrink-0',
                            evt.category === 'Sprint' ? 'bg-purple-100 dark:bg-purple-500/10 text-black dark:text-purple-500 border-purple-500 dark:border-purple-500/20' :
                              evt.category === 'Review' ? 'bg-cyan-100 dark:bg-cyan-500/10 text-black dark:text-cyan-500 border-cyan-500 dark:border-cyan-500/20' :
                                evt.category === 'Deadline' ? 'bg-red-100 dark:bg-red-500/10 text-black dark:text-red-500 border-red-500 dark:border-red-500/20' :
                                  evt.category === 'Deep Work' ? 'bg-blue-100 dark:bg-blue-500/10 text-black dark:text-blue-500 border-blue-500 dark:border-blue-500/20' :
                                    'bg-muted/50 text-foreground border-border'
                          )}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CalendarEventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        onDelete={(id) => deleteMutation.mutate(id)}
        initialDate={selectedDate}
        existingEvent={editingEvent}
      />
    </motion.div>
  );
}
