import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Plus, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isAfter,
  isBefore,
} from 'date-fns';
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
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tasks`, { withCredentials: true });
      return res.data;
    },
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
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedEvent: any) => {
      const res = await axios.put(`${API_URL}/tasks/${updatedEvent._id}`, updatedEvent, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Event updated');
      setIsDialogOpen(false);
    },
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
    },
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
    setSelectedDate(undefined);
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

  const startDay = startOfMonth(currentDate).getDay();
  const paddingDays = Array.from({ length: startDay });

  const getEventsForDay = (date: Date) => {
    return tasks.filter((task: any) => {
      if (!task.dueDate && !task.deadline) return false;

      const start = task.dueDate ? parseISO(task.dueDate) : parseISO(task.deadline);
      const end = task.deadline ? parseISO(task.deadline) : start;

      return (
        isSameDay(date, start) ||
        isSameDay(date, end) ||
        (isAfter(date, start) && isBefore(date, end))
      );
    });
  };

  const categoryPills: Record<string, string> = {
    Sprint: 'bg-purple-50 text-[#6E36E4] border-purple-100 font-semibold',
    Review: 'bg-blue-50 text-blue-700 border-blue-100 font-semibold',
    Deadline: 'bg-red-50 text-red-700 border-red-100 font-semibold',
    'Deep Work': 'bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold',
    Work: 'bg-slate-100 text-slate-800 border-slate-200 font-semibold',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-24 font-sans text-slate-900"
    >
      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <CalendarIcon className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Schedule & Milestones</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Interactive Calendar & Task Events
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Plan sprints, track task deadlines, schedule deep work blocks, and manage upcoming milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Month Navigator */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold font-mono min-w-[120px] text-center text-slate-900 uppercase tracking-wide">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setEditingEvent(null);
              setIsDialogOpen(true);
            }}
            className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center bg-slate-50/60 border-b border-slate-100 py-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Body */}
        <div>
          {isLoading ? (
            <div className="h-[550px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6E36E4]" />
            </div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-[115px]">
              {paddingDays.map((_, i) => (
                <div key={`empty-${i}`} className="border-b border-r border-slate-100 bg-slate-50/30" />
              ))}

              {days.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                const dayEvents = getEventsForDay(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.005 }}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      'p-2 border-b border-r border-slate-100 relative hover:bg-purple-50/30 transition-all cursor-pointer group h-[115px] flex flex-col gap-1 overflow-hidden',
                      isToday && 'bg-purple-50/40'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          'text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors',
                          isToday
                            ? 'bg-[#6E36E4] text-white shadow-2xs'
                            : 'text-slate-600 group-hover:text-slate-900'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200/60">
                          +{dayEvents.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
                      {dayEvents.slice(0, 3).map((evt: any) => (
                        <div
                          key={evt._id}
                          onClick={(e) => handleEventClick(e, evt)}
                          className={cn(
                            'text-[10px] px-2 py-1 rounded-lg truncate border transition-transform cursor-pointer shadow-2xs shrink-0',
                            categoryPills[evt.category] || categoryPills.Work
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
        </div>
      </div>

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
