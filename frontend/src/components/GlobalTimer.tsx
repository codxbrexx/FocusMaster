import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { toast } from 'sonner';

export function GlobalTimer() {
  const {
    isActive,
    timeLeft,
    mode,
    setIsActive,
    totalDuration,
    setTotalDuration,
    setMode,
    selectedTag,
    selectedTaskId,
  } = useTimerStore();

  const { settings } = useSettingsStore();
  const { addSession } = useHistoryStore();

  // Audio ref for background sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src =
      'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTxvT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=';
    audioRef.current = audio;
  }, []);

  // Sync settings with store when mode changes
  useEffect(() => {
    const durationMap = {
      pomodoro: settings.pomodoroDuration * 60,
      'short-break': settings.shortBreakDuration * 60,
      'long-break': settings.longBreakDuration * 60,
    };

    // If not active, update the logical duration for the current mode
    // We don't want to reset timeLeft if it's running.
    if (!isActive && timeLeft === totalDuration) {
      const newDuration = durationMap[mode];
      if (totalDuration !== newDuration) {
        setTotalDuration(newDuration);
      }
    }
  }, [mode, settings, isActive, timeLeft, totalDuration, setTotalDuration]);

  // The Tick Mechanism
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      const endTime = Date.now() + timeLeft * 1000;

      interval = setInterval(() => {
        const now = Date.now();
        const secondsRemaining = Math.ceil((endTime - now) / 1000);

        const { setTimeLeft } = useTimerStore.getState();

        if (secondsRemaining <= 0) {
          setTimeLeft(0);
        } else {
          setTimeLeft(secondsRemaining);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  // specific effect for completion
  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      const handleComplete = () => {
        setIsActive(false);
        if (settings.soundEnabled && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        const endTime = new Date();
        const startTime = new Date(
          endTime.getTime() -
            (mode === 'pomodoro'
              ? settings.pomodoroDuration
              : mode === 'short-break'
                ? settings.shortBreakDuration
                : settings.longBreakDuration) *
              60 *
              1000
        );

        // Save to history
        addSession({
          type: mode,
          duration:
            mode === 'pomodoro'
              ? settings.pomodoroDuration
              : mode === 'short-break'
                ? settings.shortBreakDuration
                : settings.longBreakDuration,
          startTime,
          endTime,
          tag: selectedTag,
          taskId: selectedTaskId === 'none' ? undefined : selectedTaskId,
          mood: undefined,
        });

        // Determine what finished
        if (mode === 'pomodoro') {
          toast.success('Focus Session Complete!', {
            description: 'Take a break, you earned it.',
            duration: 5000,
          });

          // If auto-start break is on
          if (settings.autoStartBreak) {
            setMode('short-break');
            const breakDuration = settings.shortBreakDuration * 60;
            setTotalDuration(breakDuration);
            setIsActive(true);
          }
        } else {
          toast.info('Break is over!', {
            description: 'Time to get back to focus.',
          });
          if (settings.autoStartPomodoro) {
            setMode('pomodoro');
            const focusDuration = settings.pomodoroDuration * 60;
            setTotalDuration(focusDuration);
            setIsActive(true);
          }
        }
      };
      handleComplete();
    }
  }, [
    timeLeft,
    isActive,
    setIsActive,
    settings,
    mode,
    addSession,
    selectedTag,
    selectedTaskId,
    setMode,
    setTotalDuration,
  ]);

  return null;
}
