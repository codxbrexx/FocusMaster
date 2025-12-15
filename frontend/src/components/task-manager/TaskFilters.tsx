import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, Filter, Plus, X } from 'lucide-react';

interface TaskFiltersProps {
    currentTab: string;
    categoryFilter: string;
    setCategoryFilter: (val: string) => void;
    filter: 'all' | 'high' | 'medium' | 'low';
    setFilter: (val: any) => void;
    isAdding: boolean;
    onToggleAdd: () => void;
    categories: string[];
}

export function TaskFilters({
    currentTab,
    categoryFilter,
    setCategoryFilter,
    filter,
    setFilter,
    isAdding,
    onToggleAdd,
    categories
}: TaskFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="grid w-full md:w-[240px] grid-cols-2">
                <TabsTrigger value="active">To Do</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
                {currentTab === 'active' && (
                    <>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[140px] shadow-sm">
                                <Tag className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[140px] shadow-sm">
                                <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                )}

                <Button
                    onClick={onToggleAdd}
                    variant={isAdding ? 'secondary' : 'default'}
                    className="shadow-sm min-w-[120px]"
                >
                    {isAdding ? (
                        <>
                            <X className="w-4 h-4 mr-2" /> Close
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" /> New Task
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
