import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DateNavigatorProps {
    selectedDate: Date;
    changeDate: (days: number) => void;
    isToday: boolean;
}

export function DateNavigator({ selectedDate, changeDate, isToday }: DateNavigatorProps) {
    return (
        <Card className="border-2 backdrop-blur-xl bg-card/50">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => changeDate(-1)}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div className="text-center">
                            <div className="text-lg font-semibold">
                                {selectedDate
                                    .toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })
                                    .replace(',', '')}
                                {isToday && (
                                    <Badge variant="outline" className="mt-1 ml-2 text-xs">
                                        Today
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => changeDate(1)}
                        className="h-10 w-10"
                        disabled={isToday}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
