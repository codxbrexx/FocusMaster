import { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/useTaskStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTimerStore } from '@/store/useTimerStore';
import type { TimerState } from '@/store/useTimerStore';
import { MoodSelectionModal } from './MoodSelectionModal';
import { FocusModeOverlay } from './FocusModeOverlay';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { SessionManager } from './SessionManager';
import { ModeSelector } from './ModeSelector';

export function PomodoroTimer() {
  const { tasks } = useTaskStore();

  // Use global timer store
  const mode = useTimerStore((state: TimerState) => state.mode);
  const timeLeft = useTimerStore((state: TimerState) => state.timeLeft);
  const isActive = useTimerStore((state: TimerState) => state.isActive);
  const totalDuration = useTimerStore((state: TimerState) => state.totalDuration);
  const setMode = useTimerStore((state: TimerState) => state.setMode);
  const setIsActive = useTimerStore((state: TimerState) => state.setIsActive);
  const resetTimer = useTimerStore((state: TimerState) => state.resetTimer);
  const selectedTag = useTimerStore((state: TimerState) => state.selectedTag);
  const selectedTaskId = useTimerStore((state: TimerState) => state.selectedTaskId);
  const setSelectedTag = useTimerStore((state: TimerState) => state.setSelectedTag);
  const setSelectedTaskId = useTimerStore((state: TimerState) => state.setSelectedTaskId);

  // Local state for UI specifics
  const { sessions, addSession } = useHistoryStore();

  // Calculate daily sessions for UI
  const sessionCount = sessions.filter(s => {
    const today = new Date();
    const sDate = new Date(s.startTime);
    return sDate.getDate() === today.getDate() &&
      sDate.getMonth() === today.getMonth() &&
      sDate.getFullYear() === today.getFullYear() &&
      s.type === 'pomodoro';
  }).length;

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const status = isActive ? 'running' : (timeLeft < totalDuration && timeLeft > 0 ? 'paused' : 'idle');

  const sessionStartTime = useRef<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!isActive) {
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (status === 'running') handlePause();
        else handleStart();
      }
      if (e.key === 'Escape' && focusMode) setFocusMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, focusMode, handlePause, handleStart]);

  // Timer Completion Effect
  useEffect(() => {
    if (timeLeft === 0 && mode === 'pomodoro' && !showMoodModal && !isActive) {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
      setShowMoodModal(true);
    }
  }, [timeLeft, mode, showMoodModal, isActive]);

  const savePomodoroSession = async (selectedMood: string) => {
    const sessionDuration = Math.floor(totalDuration / 60);

    // Fallback if sessionStartTime is null (e.g. after refresh)
    const startTime = sessionStartTime.current || new Date(Date.now() - sessionDuration * 60 * 1000);

    await addSession({
      type: 'pomodoro',
      duration: sessionDuration,
      startTime: startTime,
      endTime: new Date(),
      tag: selectedTag,
      taskId: selectedTaskId !== 'none' ? selectedTaskId : undefined,
      mood: selectedMood
    });

    setShowMoodModal(false);
    resetTimer();
    sessionStartTime.current = null;
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

            <ModeSelector mode={mode} setMode={setMode} resetTimer={resetTimer} />

            <TimerDisplay
              mode={mode}
              timeLeft={timeLeft}
              progress={progress}
              status={status}
              formatTime={formatTime}
            />

            <TimerControls
              status={status}
              handleStart={handleStart}
              handlePause={handlePause}
              handleReset={handleReset}
            />

            <SessionManager
              activeTasks={activeTasks}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sessionCount={sessionCount}
            />

          </div>
        </CardContent>
      </Card>
      <MoodSelectionModal show={showMoodModal} onSelect={savePomodoroSession} />
    </div>
  );
}
