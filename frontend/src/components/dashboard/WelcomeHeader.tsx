import { motion } from 'framer-motion';
import { Target, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getLevelInfo, getProgressPercent } from '@/utils/levelUtils';
import { useAiStore } from '@/store/useAiStore';

interface WelcomeHeaderProps {
  user: any;
  settings: any;
  randomQuote: string;
  points: number;
}

const STREAM_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  medical: 'Medical',
  commerce: 'Commerce',
  competitive: 'Competitive Exams',
  custom: 'General',
};

export function WelcomeHeader({ user, settings, randomQuote, points }: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const { studyProfile } = useAiStore();
  const currentLevel = getLevelInfo(points);
  const progressPercent = getProgressPercent(points);

  // Dynamic user stream from profile or store
  const activeStream = (studyProfile?.stream || user?.stream || 'engineering').toLowerCase();
  const streamDisplay = STREAM_LABELS[activeStream] || 'Engineering Stream';

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
      }}
      className="relative overflow-hidden rounded-[20px] sm:rounded-3xl bg-card border border-border/50 p-5 sm:p-8 lg:p-10 transition-all duration-300 shadow-sm"
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <span>Welcome to Focus Master</span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-primary">
              <Layers className="w-3 h-3" />
              {streamDisplay}
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {getTimeGreeting()},{' '}
            <span className="text-foreground font-bold">
              {user?.name || 'Focus Master'}
            </span>
          </h1>

          <p className="font-serif italic text-sm md:text-base text-muted-foreground leading-relaxed">
            "{settings.motivationalQuotes ? randomQuote : 'Ready to focus?'}"
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              onClick={() => navigate('/pomodoro')}
              size="sm"
              className="rounded-full px-4 sm:px-6 hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400 hover:border bg-background border border-border/50"
            >
              <Target className="mr-2 h-5 w-5" /> Start Session
            </Button>
            <Button
              onClick={() => navigate('/tasks')}
              variant="outline"
              size="sm"
              className="rounded-full hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400 hover:border bg-background border border-border/50 px-8"
            >
              View Tasks
            </Button>
          </div>
        </div>

        {/* Rank Card */}
        <motion.div
          className={`hidden md:flex flex-col justify-between p-6 rounded-xl border min-w-[280px] h-full relative overflow-hidden transition-all duration-500 ${currentLevel.bg} ${currentLevel.border} shadow-lg`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] transition-transform duration-1000 ease-in-out z-20" />

          <div
            className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentLevel.gradient}`}
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-widest text-white/90 drop-shadow-md`}
            >
              Current Rank
            </span>
            <div
              className={`px-2 py-0.5 rounded-sm text-[10px] text-white font-bold uppercase border bg-background/80 backdrop-blur-lg ${currentLevel.border} shadow-sm`}
            >
              lvl {currentLevel.level}
            </div>
          </div>

          <div className="relative z-10 mb-6">
            <div
              className={`text-5xl font-black tracking-tighter leading-none ${currentLevel.color} drop-shadow-lg filter transition-all duration-300`}
            >
              {currentLevel.name}
            </div>
          </div>

          <div className="relative z-10 mt-auto space-y-2">
            <div className="flex justify-between text-xs text-white/80 font-medium">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
