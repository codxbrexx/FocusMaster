import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Calendar, Timer, TrendingUp, ChevronLeft, ChevronRight, } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useHistoryStore } from '../store/useHistoryStore';

export function ClockInOut() {
  const { clockEntries, addClockEntry, updateClockEntry } = useHistoryStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toLocaleDateString('en-CA');
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
  const todayEntry = clockEntries.find((e) => !e.clockOut);
  const isToday = selectedDate.getDate() === new Date().getDate() &&
    selectedDate.getMonth() === new Date().getMonth() &&
    selectedDate.getFullYear() === new Date().getFullYear();

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleClockIn = () => {
    if (todayEntry) {
      toast.error('Already clocked in', {
        description: 'You need to clock out first',
      });
      return;
    }

    addClockEntry({
      clockIn: new Date(),
      breakTime: 0,
      date: today,
    });

    toast.success('Clocked In', {
      description: 'Your work session has started',
    });
  };

  const handleClockOut = () => {
    if (!todayEntry) {
      toast.error('Not clocked in', {
        description: 'You need to clock in first',
      });
      return;
    }

    updateClockEntry(todayEntry.id, {
      clockOut: new Date(),
    });

    toast.success('Clocked Out', {
      description: 'Great work today!',
    });
  };

  const getTodayTotalHours = () => {
    const todayEntries = clockEntries.filter((e) => e.date === today);
    let total = todayEntries.reduce((acc, entry) => {
      if (entry.clockOut) {
        const diff = new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime();
        return acc + diff;
      }
      return acc;
    }, 0);

    // Add current session if active
    if (todayEntry) {
      const diff = currentTime.getTime() - new Date(todayEntry.clockIn).getTime();
      total += diff;
    }

    const hours = Math.floor(total / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const getWeeklyHours = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekEntries = clockEntries.filter((e) => {
      const entryDate = new Date(e.clockIn);
      return entryDate >= weekAgo && e.clockOut;
    });

    const total = weekEntries.reduce((acc, entry) => {
      if (entry.clockOut) {
        const diff = new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime();
        return acc + diff;
      }
      return acc;
    }, 0);

    const hours = Math.floor(total / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatArrivalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = (start: Date, end?: Date) => {
    if (!end) return 'Active';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const selectedDayEntries = clockEntries.filter((e) => e.date === selectedDateStr);
  const todayTotal = getTodayTotalHours();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-20">
      {/* Date Navigation */}
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

      {/* Main Clock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circular Clock */}
        <Card className="border-2 backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/50 to-card/80 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>

          <CardContent className="relative z-10 pt-8 pb-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {[...Array(60)].map((_, i) => {
                    const angle = (i * 6 * Math.PI) / 180;
                    const isHourMark = i % 5 === 0;
                    const outerRadius = 136;
                    const innerRadius = isHourMark ? 126 : 130;
                    const x1 = 144 + outerRadius * Math.cos(angle);
                    const y1 = 144 + outerRadius * Math.sin(angle);
                    const x2 = 144 + innerRadius * Math.cos(angle);
                    const y2 = 144 + innerRadius * Math.sin(angle);

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth={isHourMark ? '2' : '1'}
                        className="text-muted-foreground/30"
                      />
                    );
                  })}

                  {/* Background circle */}
                  <circle
                    cx="144"
                    cy="144"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/10"
                  />

                  {/* Progress circle */}
                  {todayEntry && isToday && (
                    <circle
                      cx="144"
                      cy="144"
                      r="110"
                      stroke="url(#clockGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 110}`}
                      strokeDashoffset={`${2 * Math.PI * 110 * (1 - (todayTotal.hours % 24) / 24)}`}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {todayEntry && isToday ? 'Time at Work' : 'Left Time'}
                    </p>
                    <div className="text-xl sm:text-2xl tabular-nums text-green-500">
                      {todayEntry && isToday
                        ? `${String(todayTotal.hours).padStart(2, '0')}h ${String(todayTotal.minutes).padStart(2, '0')}m ${String(todayTotal.seconds).padStart(2, '0')}s`
                        : 'Online'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clock In/Out Buttons */}
              {isToday && (
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <Button
                    size="lg"
                    onClick={handleClockIn}
                    disabled={!!todayEntry}
                    className="flex-1 h-14 text-base gap-3 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40  disabled:opacity-50"
                  >
                    <LogIn className="w-5 h-5" />
                    Clock In
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleClockOut}
                    disabled={!todayEntry}
                    variant="secondary"
                    className="flex-1 h-14 text-base gap-3 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-40"
                  >
                    <LogOut className="w-5 h-5" />
                    Clock Out
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="border-2 backdrop-blur-xl bg-card/50">
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Arrival Time
                </p>
                <div className="text-4xl text-green-500 tabular-nums">
                  {todayEntry && isToday
                    ? formatArrivalTime(new Date(todayEntry.clockIn))
                    : '--:-- --'}
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Left Time
                </p>
                <div className="text-4xl tabular-nums">
                  {todayEntry && isToday && todayEntry.clockOut
                    ? formatArrivalTime(new Date(todayEntry.clockOut))
                    : todayEntry && isToday
                      ? 'Online'
                      : '--:-- --'}
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Productive Time
                </p>
                <div className="text-4xl text-blue-500 tabular-nums">
                  {isToday
                    ? `${String(todayTotal.hours).padStart(2, '0')}h ${String(todayTotal.minutes).padStart(2, '0')}m ${String(todayTotal.seconds).padStart(2, '0')}s`
                    : `${selectedDayEntries.reduce((acc, e) => {
                      if (e.clockOut) {
                        const diff =
                          new Date(e.clockOut).getTime() - new Date(e.clockIn).getTime();
                        return acc + diff;
                      }
                      return acc;
                    }, 0) /
                    (1000 * 60 * 60)
                    }h`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours Timeline */}
          {selectedDayEntries.length > 0 && (
            <Card className="border-2 backdrop-blur-xl bg-card/50">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-base">Working Hours</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {selectedDayEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground min-w-[140px] flex items-center gap-2">
                        <span>
                          {formatArrivalTime(new Date(entry.clockIn))} -{' '}
                          {entry.clockOut ? formatArrivalTime(new Date(entry.clockOut)) : 'Active'}
                        </span>
                        {entry.clockOut && (
                          <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">
                            {calculateDuration(entry.clockIn, entry.clockOut)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">Work Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">Private Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">Idle Time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-lg hover:scale-95 transition-all group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                <Timer className="w-6 h-6 text-blue-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today's Hours</p>
              <div className="text-4xl bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent tabular-nums">
                {isToday ? `${todayTotal.hours}h ${todayTotal.minutes}m` : '0h 0m'}
              </div>
              <p className="text-xs text-muted-foreground">Total work time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-lg hover:scale-95 transition-all group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Weekly Hours</p>
              <div className="text-4xl bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent tabular-nums">
                {getWeeklyHours()}
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-2 hover:shadow-lg hover:scale-95 transition-all group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <div className="text-4xl bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent tabular-nums">
                {clockEntries.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
