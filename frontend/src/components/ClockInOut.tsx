import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useHistoryStore } from '@/store/useHistoryStore';
import { DateNavigator } from './clock-in-out/DateNavigator';
import { WorkClock } from './clock-in-out/WorkClock';
import { InfoPanel } from './clock-in-out/InfoPanel';
import { WorkTimeline } from './clock-in-out/WorkTimeline';
import { StatsGrid } from './clock-in-out/StatsGrid';

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
  const isToday =
    selectedDate.getDate() === new Date().getDate() &&
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

  const selectedDayEntries = clockEntries.filter((e) => e.date === selectedDateStr);
  const todayTotal = getTodayTotalHours();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-20">
      <DateNavigator selectedDate={selectedDate} changeDate={changeDate} isToday={isToday} />

      {/* Main Clock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkClock
          todayEntry={todayEntry}
          isToday={isToday}
          todayTotal={todayTotal}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        />

        {/* Info Panel & Timeline */}
        <div className="space-y-4">
          <InfoPanel
            todayEntry={todayEntry}
            isToday={isToday}
            todayTotal={todayTotal}
            selectedDayEntries={selectedDayEntries}
          />

          <WorkTimeline entries={selectedDayEntries} />
        </div>
      </div>

      <StatsGrid
        isToday={isToday}
        todayTotal={todayTotal}
        weeklyHours={getWeeklyHours()}
        totalEntries={clockEntries.length}
      />
    </div>
  );
}
