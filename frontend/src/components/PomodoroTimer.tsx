import { useState, useEffect, useRef, useCallback } from 'react';

import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Coffee,
  Brain,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { useTaskStore } from '@/store/useTaskStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTimerStore } from '@/store/useTimerStore';
import type { TimerMode } from '@/store/useTimerStore';
import { MoodSelectionModal } from './pomodoro/MoodSelectionModal';
import { FocusModeOverlay } from './pomodoro/FocusModeOverlay';

export function PomodoroTimer() {
  const { tasks } = useTaskStore();

  // Use global timer store
  const mode = useTimerStore(state => state.mode);
  const timeLeft = useTimerStore(state => state.timeLeft);
  const isActive = useTimerStore(state => state.isActive);
  const totalDuration = useTimerStore(state => state.totalDuration);
  const setMode = useTimerStore(state => state.setMode);
  const setIsActive = useTimerStore(state => state.setIsActive);
  const resetTimer = useTimerStore(state => state.resetTimer);

  // Local state for UI specifics
  const { sessions } = useHistoryStore();

  // Calculate daily sessions for UI
  const sessionCount = sessions.filter(s => {
    const today = new Date();
    const sDate = new Date(s.startTime);
    return sDate.getDate() === today.getDate() &&
      sDate.getMonth() === today.getMonth() &&
      sDate.getFullYear() === today.getFullYear() &&
      s.type === 'pomodoro';
  }).length;

  const [selectedTag, setSelectedTag] = useState<string>('Study');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Derived status for UI compatibility
  const status = isActive ? 'running' : (timeLeft < totalDuration && timeLeft > 0 ? 'paused' : 'idle');

  const sessionStartTime = useRef<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync settings with timer store
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Only update if timer is not active to avoid disruption
    if (!isActive) {
      // We need to map settings to totalDuration based on current mode
      let newDuration = settings.pomodoroDuration * 60;
      if (mode === 'short-break') newDuration = settings.shortBreakDuration * 60;
      if (mode === 'long-break') newDuration = settings.longBreakDuration * 60;
      if (totalDuration !== newDuration) {
        useTimerStore.getState().setTotalDuration(newDuration);
      }
    }
  }, [settings, mode, isActive, totalDuration]);

  const handleStart = useCallback(() => {
    if (!isActive) {
      if (timeLeft === 0) resetTimer();
      setIsActive(true);
      if (!sessionStartTime.current) sessionStartTime.current = new Date();
    }
  }, [isActive, timeLeft, resetTimer, setIsActive]);

  const handlePause = useCallback(() => {
    setIsActive(false);
  }, [setIsActive]);

  const handleReset = useCallback(() => {
    resetTimer();
    sessionStartTime.current = null;
  }, [resetTimer]);

  useEffect(() => {
    const audio = new Audio();
    audio.src =
      'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTxvT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=';
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if user is typing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevent scrolling for Space
        if (status === 'running') handlePause();
        else handleStart();
      }
      if (e.key === 'Escape' && focusMode) setFocusMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, focusMode, handlePause, handleStart]);



  const savePomodoroSession = (_selectedMood: string) => {

    setShowMoodModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  if (focusMode) {
    return (
      <FocusModeOverlay
        mode={mode}
        timeLeft={timeLeft}
        totalDuration={totalDuration}
        status={status}
        sessionCount={sessionCount}
        activeTasks={activeTasks}
        selectedTaskId={selectedTaskId}
        selectedTag={selectedTag}
        setFocusMode={setFocusMode}
        setMode={setMode}
        resetTimer={resetTimer}
        handleStart={handleStart}
        handlePause={handlePause}
        setSelectedTaskId={setSelectedTaskId}
        setSelectedTag={setSelectedTag}
        formatTime={formatTime}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-none  bg-gradient-to-br from-card to-secondary/10 overflow-hidden relative">
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFocusMode(true)}
            title="Enter Focus Mode"
          >
            <Maximize2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </Button>
        </div>

        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-8 bg-secondary/50 p-1 rounded-xl">
              {[
                { id: 'pomodoro', icon: Brain, label: 'Focus' },
                { id: 'short-break', icon: Coffee, label: 'Short' },
                { id: 'long-break', icon: Coffee, label: 'Long' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMode(item.id as TimerMode);
                    resetTimer();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === item.id
                    ? 'bg-background shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="relative w-96 h-96 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="main-gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" /> {/* Indigo-500 */}
                    <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                  </linearGradient>
                  <linearGradient id="main-gradient-short-break" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" /> {/* Teal-500 */}
                    <stop offset="100%" stopColor="#22c55e" /> {/* Green-500 */}
                  </linearGradient>
                  <linearGradient id="main-gradient-long-break" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 */}
                    <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan-500 */}
                  </linearGradient>
                </defs>

                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-secondary/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={`url(#main-gradient-${mode === 'short-break' ? 'short-break' : mode === 'long-break' ? 'long-break' : 'focus'})`}
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-linear shadow-glow-lg"
                  style={{ filter: `drop-shadow(0 0 8px ${mode === 'pomodoro' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(20, 184, 166, 0.4)'})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-8xl font-black tabular-nums tracking-tighter text-foreground select-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-base font-medium text-muted-foreground/80 uppercase tracking-[0.2em] mt-4 select-none">
                  {status === 'idle' ? 'Ready' : mode === 'pomodoro' ? 'Deep Work' : 'Recharging'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="rounded-full w-12 h-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              {status !== 'running' ? (
                <Button
                  onClick={handleStart}
                  className="rounded-full w-32 h-12 text-lg shadow-lg shadow-primary/20"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" /> Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="rounded-full w-32 h-12 text-lg border-2"
                >
                  <Pause className="w-5 h-5 mr-2" /> Pause
                </Button>
              )}
            </div>

            {/* Session Controls */}
            <div className="w-full mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="space-y-2 w-full md:w-auto min-w-[320px]">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Working On
                  </span>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 text-sm hover:bg-white/10 transition-colors focus:ring-0">
                      <SelectValue placeholder="-- No Specific Task --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- No Specific Task --</SelectItem>
                      {activeTasks.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
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
                          className={`px-3 py-1 cursor-pointer text-xs font-normal rounded-full transition-all border-white/10 ${selectedTag === tag ? 'bg-white text-black hover:bg-white/90' : 'hover:bg-white/10 text-muted-foreground'}`}
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
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((sessionCount / 4) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <MoodSelectionModal show={showMoodModal} onSelect={savePomodoroSession} />
    </div>
  );
}
