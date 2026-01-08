import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionManagerProps {
    activeTasks: any[];
    selectedTaskId: string;
    setSelectedTaskId: (id: string) => void;
    selectedTag: string;
    setSelectedTag: (tag: string) => void;
    sessionCount: number;
}

export const SessionManager = ({
    activeTasks,
    selectedTaskId,
    setSelectedTaskId,
    selectedTag,
    setSelectedTag,
    sessionCount,
}: SessionManagerProps) => {
    return (
        <div className="w-full mt-12 pt-8 backdrop-blur-lg bg-background/20 border-t border-muted/10">
            <div className="flex flex-col bg-muted-50 border-muted/10  rounded-lg md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="space-y-2 w-full md:w-auto min-w-[320px]">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                        Working On
                    </span>
                    <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                        <SelectTrigger className="h-10 bg-card border-border text-sm text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 focus:ring-ring">
                            <SelectValue placeholder="No Task Added" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="none" className="focus:bg-primary/10 focus:text-primary cursor-pointer">No Task Added</SelectItem>
                            {activeTasks.map((t) => (
                                <SelectItem key={t._id} value={t._id} className="focus:bg-primary/10 hover:text-purple-500  focus:text-primary cursor-pointer font-medium">
                                    {t.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3 flex-1 flex flex-col items-center md:items-start">
                    <div className="w-full flex-col md:items-center flex">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1 self-start md:self-center">
                            Session Tag
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2 justify-start md:justify-center">
                            {['Study', 'Work', 'Code', 'Write', 'Read'].map((tag) => (
                                <Badge
                                    key={tag}
                                    variant={selectedTag === tag ? 'default' : 'outline'}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-3 py-1 cursor-pointer text-xs font-normal rounded-full transition-all border duration-300 ${selectedTag === tag ? 'bg-primary text-primary-foreground border-purple-500 hover:text-purple-500 ' : 'border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 text-muted-foreground'}`}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 w-full md:w-[200px]">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Daily Goal
                        </span>
                        <span className="text-sm font-bold tabular-nums text-muted-foreground">
                            <span className="text-foreground">{sessionCount}</span> / 4
                        </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                        <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            style={{ width: `${Math.min((sessionCount / 4) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
