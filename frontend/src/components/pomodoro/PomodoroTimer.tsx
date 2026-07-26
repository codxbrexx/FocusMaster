import { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';
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
import { AdaptiveTimerSuggestion } from './AdaptiveTimerSuggestion';

// Sidebar
import { CalendarCard } from './sidebar/CalendarCard';
import { StreakCard } from './sidebar/StreakCard';
import { TasksCard } from './sidebar/TasksCard';
import { QuickNotesCard } from './sidebar/QuickNotesCard';

// Right bar
import { ProgressCard } from './rightbar/ProgressCard';
import { WeeklyAnalyticsCard } from './rightbar/WeeklyAnalyticsCard';
import { AchievementsCard } from './rightbar/AchievementsCard';
import { DailyQuoteCard } from './rightbar/DailyQuoteCard';

// Bottom
import { BottomPanel } from './bottom/BottomPanel';

export function PomodoroTimer() {
  const { tasks } = useTaskStore();

  // Timer store
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

  const { sessions, addSession } = useHistoryStore();
  const { settings } = useSettingsStore();

  // Calculate daily sessions
  const sessionCount = sessions.filter((s) => {
    const today = new Date();
    const sDate = new Date(s.startTime);
    return (
      sDate.getDate() === today.getDate() &&
      sDate.getMonth() === today.getMonth() &&
      sDate.getFullYear() === today.getFullYear() &&
      s.type === 'pomodoro'
    );
  }).length;

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [overrideDuration, setOverrideDuration] = useState<number | null>(null);

  const status = isActive
    ? 'running'
    : timeLeft < totalDuration && timeLeft > 0
      ? 'paused'
      : 'idle';

  const sessionStartTime = useRef<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync duration from settings or override
  useEffect(() => {
    if (!isActive) {
      if (overrideDuration !== null && mode === 'pomodoro') {
        if (totalDuration !== overrideDuration) {
          useTimerStore.getState().setTotalDuration(overrideDuration);
        }
      } else {
        let newDuration = settings.pomodoroDuration * 60;
        if (mode === 'short-break') newDuration = settings.shortBreakDuration * 60;
        if (mode === 'long-break') newDuration = settings.longBreakDuration * 60;
        if (totalDuration !== newDuration) {
          useTimerStore.getState().setTotalDuration(newDuration);
        }
      }
    }
  }, [settings, mode, isActive, totalDuration, overrideDuration]);

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
    setOverrideDuration(null); // Clear override on reset
  }, [resetTimer]);

  useEffect(() => {
    const audio = new Audio();
    audio.src =
      'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTxvT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=';
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) return;
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

  // Timer completion
  useEffect(() => {
    if (timeLeft === 0 && mode === 'pomodoro' && !showMoodModal && !isActive) {
      if (audioRef.current) audioRef.current.play().catch(console.error);
      setTimeout(() => setShowMoodModal(true), 0);
    }
  }, [timeLeft, mode, showMoodModal, isActive]);

  const savePomodoroSession = async (selectedMood: string) => {
    const sessionDuration = Math.floor(totalDuration / 60);
    const startTime = sessionStartTime.current || new Date(Date.now() - sessionDuration * 60 * 1000);
    await addSession({
      type: 'pomodoro',
      duration: sessionDuration,
      startTime,
      endTime: new Date(),
      tag: selectedTag,
      taskId: selectedTaskId !== 'none' ? selectedTaskId : undefined,
      mood: selectedMood,
    });
    setShowMoodModal(false);
    resetTimer();
    sessionStartTime.current = null;
    setOverrideDuration(null); // Clear override on completion
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  // Focus mode overlay
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
    <div className="animate-fade-in space-y-6 -mx-4 md:-mx-6 px-4 md:px-6">
      {/* ── Main 3-column dashboard ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_280px] gap-6 items-start">

        {/* ════════════════════════════
            LEFT SIDEBAR
            ════════════════════════════ */}
        <div className="hidden xl:flex flex-col gap-4">
          <CalendarCard />
          <StreakCard />
          <TasksCard />
          <QuickNotesCard />
        </div>

        {/* ════════════════════════════
            CENTER — TIMER
            ════════════════════════════ */}
        <div className="flex flex-col items-center w-full">
          {mode === 'pomodoro' && (
            <div className="w-full">
              <AdaptiveTimerSuggestion
                onApply={(focus) => setOverrideDuration(focus * 60)}
              />
            </div>
          )}

          {/* Card shell */}
          <div className="w-full bg-card border border-border/50 shadow-sm rounded-2xl flex flex-col items-center overflow-hidden">

            {/* ── Card Header: Mode selector + Focus button ── */}
            <div className="w-full flex items-center justify-between px-6 pt-6 pb-0">
              <ModeSelector mode={mode} setMode={setMode} resetTimer={resetTimer} />
              <button
                id="focus-mode-btn"
                onClick={() => setFocusMode(true)}
                title="Enter Focus Mode (F)"
                className="flex-shrink-0 ml-3 p-2.5 rounded-xl bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground border border-border/40 transition-all duration-200 hover:scale-105"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* ── Timer ring ── */}
            <div className="w-full flex flex-col items-center px-6 pt-6 pb-2">
              <TimerDisplay
                mode={mode}
                timeLeft={timeLeft}
                totalDuration={totalDuration}
                progress={progress}
                status={status}
                formatTime={formatTime}
              />
            </div>

            {/* ── Controls ── */}
            <div className="w-full px-6 pb-6">
              <TimerControls
                status={status}
                handleStart={handleStart}
                handlePause={handlePause}
                handleReset={handleReset}
              />

              {/* ── Divider ── */}
              <div className="mt-8 border-t border-border/40" />

              {/* ── Session manager: tags + task + mini stats ── */}
              <SessionManager
                activeTasks={activeTasks}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                sessionCount={sessionCount}
              />
            </div>
          </div>

          {/* Mobile: sidebar cards below timer */}
          <div className="xl:hidden w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CalendarCard />
            <StreakCard />
            <TasksCard />
            <QuickNotesCard />
          </div>
        </div>


        {/* ════════════════════════════
            RIGHT SIDEBAR
            ════════════════════════════ */}
        <div className="hidden xl:flex flex-col gap-4">
          <ProgressCard sessionCount={sessionCount} />
          <WeeklyAnalyticsCard />
          <AchievementsCard />
          <DailyQuoteCard />
        </div>
      </div>

      {/* ════════════════════════════
          BOTTOM PRODUCTIVITY PANEL
          ════════════════════════════ */}
      <BottomPanel sessionCount={sessionCount} selectedTaskId={selectedTaskId} />

      {/* Right bar on tablet */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProgressCard sessionCount={sessionCount} />
        <WeeklyAnalyticsCard />
        <AchievementsCard />
        <DailyQuoteCard />
      </div>

      <MoodSelectionModal show={showMoodModal} onSelect={savePomodoroSession} />
    </div>
  );
}
