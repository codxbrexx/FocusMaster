import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tag, AlertCircle } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

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

    // Date & Time State
    const [isAllDay, setIsAllDay] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('17:00');

    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line
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

        // Construct Date Objects
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
            <DialogContent className="sm:max-w-[500px] bg-muted/20 backdrop-blur-xl border border-border text-foreground shadow-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2 text-foreground">
                            {existingEvent ? 'Edit Event' : 'New Event'}
                        </span>
                        {existingEvent && (
                            <span className={cn(
                                "text-xs font-normal px-2 py-0.5 rounded-full border",
                                existingEvent.category === 'Sprint' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                    existingEvent.category === 'Review' ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                                        "bg-muted text-muted-foreground border-border"
                            )}>
                                {existingEvent.category}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Event Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Q1 Sprint Review"
                            className="bg-transparent border-input focus:border-primary text-lg font-medium text-foreground placeholder:text-muted-foreground"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Type & All Day */}
                    <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Type
                            </Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-transparent border-input text-foreground">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sprint" className="text-purple-500">Sprint</SelectItem>
                                    <SelectItem value="Review" className="text-cyan-500">Review</SelectItem>
                                    <SelectItem value="Work">Work</SelectItem>
                                    <SelectItem value="Deep Work">Deep Work</SelectItem>
                                    <SelectItem value="Deadline" className="text-red-500">Deadline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 h-10 px-1">
                            <Label htmlFor="all-day" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">All Day</Label>
                            <Switch
                                id="all-day"
                                checked={isAllDay}
                                onCheckedChange={setIsAllDay}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                    </div>

                    {/* Date & Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start */}
                        <div className="space-y-1.5">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Start</Label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent border-input text-foreground"
                                    required
                                />
                                {!isAllDay && (
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="bg-transparent border-input text-foreground"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        {/* End */}
                        <div className="space-y-1.5">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">End</Label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent border-input text-foreground"
                                    required
                                />
                                {!isAllDay && (
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="bg-transparent border-input text-foreground"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm flex items-center gap-2 bg-red-500/10 p-2 rounded-md border border-red-500/20">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="desc" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Description</Label>
                        <Textarea
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Details, agenda, or goals..."
                            className="bg-transparent border-input min-h-[80px] text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <DialogFooter className="flex items-center justify-between sm:justify-between gap-4 pt-4 border-t border-border">
                        {existingEvent && onDelete ? (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => { onDelete(existingEvent._id); onClose(); }}
                                className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none hover:text-red-600"
                            >
                                Delete Event
                            </Button>
                        ) : (
                            <div />
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-accent hover:text-accent-foreground">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px] shadow-glow-sm">
                                {existingEvent ? 'Update Event' : 'Save Event'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
