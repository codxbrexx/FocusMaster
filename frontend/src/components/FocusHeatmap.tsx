import { useState, useEffect, useMemo } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import api from '../services/api';
import { format, subDays, eachDayOfInterval, startOfToday, isSameMonth, getDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapData {
  date: string;
  count: number;
}

const CELL_SIZE = 14;
const CELL_GAP = 4;
const WEEKS_TO_SHOW = 52;

export function FocusHeatmap() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const { data } = await api.get('/analytics/heatmap');
        setData(data);
      } catch (error) {
        console.error('Failed to fetch heatmap data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  // 1. Prepare Data Map
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(d.date, d.count));
    return map;
  }, [data]);

  const { weeks, monthLabels } = useMemo(() => {
    const today = startOfToday();
    const totalDays = WEEKS_TO_SHOW * 7;
    const startDate = subDays(today, totalDays);
    const gridStart = subDays(startDate, getDay(startDate));

    const days = eachDayOfInterval({ start: gridStart, end: today });

    const weeksArr: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) weeksArr.push(currentWeek);

    const labels: { label: string; weekIndex: number }[] = [];
    weeksArr.forEach((week, index) => {
      const firstDay = week[0];
      if (index === 0 || !isSameMonth(firstDay, weeksArr[index - 1][0])) {
        if (index < weeksArr.length - 2) {
          labels.push({
            label: format(firstDay, 'MMM'),
            weekIndex: index,
          });
        }
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, []);

  // 3. Styling Logic
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted/30 border border-border/50';
    if (count === 1) return 'bg-purple-500/20 border border-purple-500/30';
    if (count <= 3)
      return 'bg-purple-500/50 border border-purple-500/60 shadow-[0_0_8px_rgba(147,51,234,0.3)]';
    return 'bg-purple-500 border border-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.6)]';
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-xl bg-card/50 border-2 border-border/50 shadow-sm order-last lg:col-span-3">
        <CardContent className="h-48 flex items-center justify-center">
          <div className="flex flex-col gap-2 w-full max-w-md animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mb-4" />
            <div className="h-28 w-full bg-muted/50 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-card/50 border border-white/10 shadow-none order-last lg:col-span-3">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Flame className="h-5 w-5 text-purple-500 fill-purple-500/20" />
              Consistency
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 pl-7">
              Your focus history over the last year
            </p>
          </div>

          {/* Modern Legend */}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
            <span>Less</span>
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getIntensityClass(0)}`} />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getIntensityClass(1)}`} />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getIntensityClass(3)}`} />
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getIntensityClass(10)}`} />
            <span>More</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 overflow-hidden">
        <div className="flex gap-4">
          {/* Fixed Day Labels */}
          <div className="flex flex-col justify-between pt-[23px] pb-[6px] text-[10px] font-medium text-muted-foreground/60 h-[126px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Scrollable Grid */}
          <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex flex-col gap-1 min-w-max">
              {/* Month Labels Layer */}
              <div className="relative h-6 w-full text-[11px] font-medium text-muted-foreground">
                {monthLabels.map((m, i) => (
                  <span
                    key={i}
                    className="absolute transform transition-colors hover:text-foreground cursor-default whitespace-nowrap"
                    style={{
                      left: `${m.weekIndex * (CELL_SIZE + CELL_GAP)}px`,
                    }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* The Grid */}
              <div className="flex" style={{ gap: `${CELL_GAP}px` }}>
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col" style={{ gap: `${CELL_GAP}px` }}>
                    {week.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const count = dataMap.get(dateStr) || 0;

                      return (
                        <TooltipProvider key={dateStr}>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div
                                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                                className={`rounded-[3px] transition-all duration-300 hover:scale-125 hover:z-10 ${getIntensityClass(count)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-popover border-border text-xs py-1 px-2"
                            >
                              <span className="font-semibold text-purple-500">
                                {count} sessions
                              </span>
                              <span className="text-muted-foreground">
                                {' '}
                                on {format(day, 'MMM do')}
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
