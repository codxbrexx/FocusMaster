import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tag, AlertCircle, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';

interface CalendarEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  onDelete?: (id: string) => void;
  initialDate?: Date;
  existingEvent?: any;
}

export function CalendarEventDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  existingEvent,
}: CalendarEventDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');

  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');

  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (existingEvent) {
        setTitle(existingEvent.title);
        setCategory(existingEvent.category || 'Work');
        setDescription(existingEvent.description || '');

        const start = existingEvent.dueDate ? new Date(existingEvent.dueDate) : new Date();
        const end = existingEvent.deadline ? new Date(existingEvent.deadline) : start;

        setStartDate(format(start, 'yyyy-MM-dd'));
        setStartTime(format(start, 'HH:mm'));
        setEndDate(format(end, 'yyyy-MM-dd'));
        setEndTime(format(end, 'HH:mm'));

        setIsAllDay(existingEvent.isAllDay ?? false);
      } else {
        const baseDate = initialDate || new Date();
        setTitle('');
        setCategory('Work');
        setStartDate(format(baseDate, 'yyyy-MM-dd'));
        setStartTime('09:00');
        setEndDate(format(baseDate, 'yyyy-MM-dd'));
        setEndTime('10:00');
        setIsAllDay(true);
        setDescription('');
      }
    }
  }, [isOpen, existingEvent, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const start = parseISO(`${startDate}T${isAllDay ? '00:00:00' : startTime}`);
    const end = parseISO(`${endDate}T${isAllDay ? '23:59:59' : endTime}`);

    if (isAfter(start, end)) {
      setError('End date must be after start date.');
      return;
    }

    onSave({
      _id: existingEvent?._id,
      title,
      category,
      dueDate: start.toISOString(),
      deadline: end.toISOString(),
      isAllDay,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 font-sans text-slate-900">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-900">
              <CalendarIcon className="w-5 h-5 text-[#6E36E4]" />
              {existingEvent ? 'Edit Calendar Event' : 'Schedule New Event'}
            </span>
            {existingEvent && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100">
                {existingEvent.category}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Event Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Sprint Review"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#6E36E4]/40"
              autoFocus
              required
            />
          </div>

          {/* Category & All Day */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#6E36E4]" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6E36E4]/40"
              >
                <option value="Sprint">Sprint</option>
                <option value="Review">Review</option>
                <option value="Work">Work</option>
                <option value="Deep Work">Deep Work</option>
                <option value="Deadline">Deadline</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 h-10 px-2 bg-slate-50 rounded-xl border border-slate-200/80 justify-between">
              <span className="text-xs font-bold text-slate-600">All Day Event</span>
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="w-4 h-4 rounded text-[#6E36E4] focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Start Date
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  required
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> End Date
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  required
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-semibold flex items-center gap-2 bg-red-50 p-2.5 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="desc" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Notes & Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event agenda or key objectives..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 min-h-[70px] text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6E36E4]/40 resize-none"
            />
          </div>

          <DialogFooter className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {existingEvent && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(existingEvent._id);
                  onClose();
                }}
                className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 border border-red-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer"
              >
                {existingEvent ? 'Update Event' : 'Save Event'}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
