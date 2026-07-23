import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check } from 'lucide-react';
import { useAiStore } from '@/store/useAiStore';

interface AdaptiveTimerSuggestionProps {
  onApply: (focus: number, shortBreak: number, longBreak: number) => void;
}

export function AdaptiveTimerSuggestion({ onApply }: AdaptiveTimerSuggestionProps) {
  const { adaptiveSuggestion, adaptiveLoading, fetchAdaptiveTimer } = useAiStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAdaptiveTimer();
  }, [fetchAdaptiveTimer]);

  if (adaptiveLoading || !adaptiveSuggestion || !adaptiveSuggestion.hasEnoughData || dismissed) {
    return null;
  }

  const { suggestedFocusDuration, suggestedShortBreak, suggestedLongBreak } = adaptiveSuggestion;

  // Don't show if we don't have suggestions (shouldn't happen if hasEnoughData is true, but just in case)
  if (!suggestedFocusDuration || !suggestedShortBreak || !suggestedLongBreak) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="mb-6 overflow-hidden"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-1.5 rounded-full mt-0.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Timer Suggestion</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on your history, a {suggestedFocusDuration}-min focus works best for you.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onApply(suggestedFocusDuration, suggestedShortBreak, suggestedLongBreak);
                setDismissed(true);
              }}
              className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Check className="h-3.5 w-3.5" /> Apply
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
