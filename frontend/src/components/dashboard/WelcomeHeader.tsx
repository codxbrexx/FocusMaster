import { motion } from 'framer-motion';
import { Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { getLevelInfo, getProgressPercent } from '@/utils/levelUtils';

interface WelcomeHeaderProps {
  user: any;
  settings: any;
  randomQuote: string;
  points: number;
}

export function WelcomeHeader({ user, settings, randomQuote, points }: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const currentLevel = getLevelInfo(points);
  const progressPercent = getProgressPercent(points);

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
      className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-card/50 border border-border/50 p-8 lg:p-10 transition-all duration-300 border group"
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 border border-primary/20">
            <Zap className="w-3 h-3 fill-current" />
            <span>Productivity Boost Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {getTimeGreeting()},{' '}
            <span className="text-transparent bg-clip-text bg-purple-600">
              {user?.name || 'Focus Master'}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            "{settings.motivationalQuotes ? randomQuote : 'Ready to focus?'}"
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              onClick={() => navigate('/pomodoro')}
              size="lg"
              className="rounded-full px-8 bg-background/50 hover:bg-background/80 border border-white/10 hover:border-purple-500"
            >
              <Target className="mr-2 h-5 w-5" /> Start Session
            </Button>
            <Button
              onClick={() => navigate('/tasks')}
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-background/50 hover:bg-background/80"
            >
              View Tasks
            </Button>
          </div>
        </div>

        {/* Rank Card */}
        <motion.div
          className={`hidden md:flex flex-col justify-between p-6 rounded-xl border min-w-[280px] h-full relative overflow-hidden transition-all duration-500 ${currentLevel.bg} ${currentLevel.border} shadow-lg group cursor-pointer`}
        >
          <div
            className={`absolute -inset-1 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${currentLevel.gradient}`}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%]  transition-transform duration-1000 ease-in-out z-20" />

          <div
            className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentLevel.gradient} transition-opacity duration-500 group-hover:opacity-30`}
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
              className={`text-5xl font-black tracking-tighter leading-none ${currentLevel.color} drop-shadow-lg filter group-hover:brightness-125 transition-all duration-300`}
            >
              {currentLevel.name}
            </div>
          </div>

          <div className="relative z-10 mt-auto space-y-2">
            <div className="h-2.5 w-full bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: 'circOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${currentLevel.gradient} shadow-[0_0_10px_rgba(255,255,255,0.3)] relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide text-white/80 drop-shadow">
              <span>{points.toLocaleString()} XP</span>
              <span>
                {currentLevel.next === Infinity
                  ? 'MAX'
                  : `Next: ${currentLevel.next.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl opacity-50" />
    </motion.div>
  );
    }
