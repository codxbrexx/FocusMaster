import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Plus, Timer, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface TaskFormState {
    title: string;
    estimatedPomodoros: number;
    priority: 'high' | 'medium' | 'low';
    deadline: string;
    category: string;
}

interface TaskFormProps {
    isAdding: boolean;
    taskForm: TaskFormState;
    setTaskForm: (form: TaskFormState) => void;
    editingTaskId: string | null;
    resetForm: () => void;
    handleSubmit: () => void;
    categories: string[];
}

export function TaskForm({
    isAdding,
    taskForm,
    setTaskForm,
    editingTaskId,
    resetForm,
    handleSubmit,
    categories
}: TaskFormProps) {
    if (!isAdding) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
        >
            <Card className="backdrop-blur-xl bg-card/50 border-2 border-border/50 shadow-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        {editingTaskId ? (
                            <Pencil className="w-5 h-5 text-primary" />
                        ) : (
                            <Plus className="w-5 h-5 text-primary" />
                        )}
                        {editingTaskId ? 'Edit Task' : 'Create New Task'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-3">
                        <label className="text-sm font-medium">What needs to be done?</label>
                        <Input
                            placeholder="Eg. Add your Task here..."
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="text-lg py-6 px-4"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={taskForm.category}
                                onValueChange={(v) => setTaskForm({ ...taskForm, category: v })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select
                                value={taskForm.priority}
                                onValueChange={(v: any) => setTaskForm({ ...taskForm, priority: v })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high" className="text-destructive">
                                        High Priority
                                    </SelectItem>
                                    <SelectItem value="medium" className="text-orange-500">
                                        Medium Priority
                                    </SelectItem>
                                    <SelectItem value="low" className="text-blue-500">
                                        Low Priority
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Est. Pomodoros
                            </label>
                            <div className="flex items-center gap-2 relative">
                                <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={taskForm.estimatedPomodoros}
                                    onChange={(e) =>
                                        setTaskForm({
                                            ...taskForm,
                                            estimatedPomodoros: parseInt(e.target.value) || 1,
                                        })
                                    }
                                    className="h-10 pr-8"
                                />
                                <Timer className="w-4 h-4 text-muted-foreground absolute right-3" />
                            </div>
                        </div>
                        {/* date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Due Date</label>
                            <div className="flex w-full items-center">
                                <Input
                                    type="text"
                                    placeholder="MM-DD-YYYY"
                                    value={taskForm.deadline}
                                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                    className="rounded-r-none focus-visible:z-10"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-l-none -ml-px focus-visible:z-10"
                                        >
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </PopoverTrigger>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="px-8">
                            {editingTaskId ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
