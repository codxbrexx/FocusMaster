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
      if (timeLeft === 0) resetTimer(); // Restart if finished
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
      if (e.code === 'Space') {
        if (status === 'running') handlePause();
        else handleStart();
      }
      if (e.key === 'Escape' && focusMode) setFocusMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, focusMode, handlePause, handleStart]);

  useEffect(() => {
    return () => {
      // Pause timer when navigating away (unmounting)
      setIsActive(false);
    };
  }, [setIsActive]);

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
    <div className="max-w-4xl mx-auto space-y-6">
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

            <div className="relative w-128 h-128 rounded-full ">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-secondary opacity-30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="text-green-600 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
                <span className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                  {status === 'idle' ? 'Ready' : mode === 'pomodoro' ? 'Focusing' : 'Taking Break'}
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
          </div>
        </CardContent>
      </Card>
      <MoodSelectionModal show={showMoodModal} onSelect={savePomodoroSession} />
    </div>
  );
}
