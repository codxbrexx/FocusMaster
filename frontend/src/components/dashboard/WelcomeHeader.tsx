
import { motion } from 'framer-motion';
import { Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WelcomeHeaderProps {
    user: any;
    settings: any;
    randomQuote: string;
    points: number;
    badge: {
        name: string;
        color: string;
        icon: any;
    };
}

export function WelcomeHeader({ user, settings, randomQuote, points, badge }: WelcomeHeaderProps) {
    const navigate = useNavigate();
    const BadgeIcon = badge.icon;

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
            className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-card/50 border border-white/10 p-8 lg:p-10 shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border"
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
                            className="rounded-full px-8 bg-background/50 hover:bg-background/80 border border-white/1 hover:border-purple-500"
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
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="hidden md:flex flex-col items-center justify-center bg-card/20 backdrop-blur-md p-5 rounded-2xl border border-primary/50 min-w-[200px] h-full"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                        Current Rank
                    </span>

                    <div
                        className={`
    flex items-center gap-2 px-4 py-1.5 rounded-lg mb-3
    bg-background/40 border border-white/5
    ${badge.color.includes('yellow') ? 'shadow-[0_0_10px_-3px_rgba(234,179,8,0.3)]' : ''} 
  `}
                    >
                        <BadgeIcon className={`h-3.5 w-3.5 ${badge.color.split(' ')[1]}`} />
                        <span className={`text-sm font-bold ${badge.color.split(' ')[1]}`}>{badge.name}</span>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-black tracking-tight leading-none">{points}</div>
                        <p className="text-[10px] font-medium text-muted-foreground mt-1">Focus Points</p>
                    </div>
                </motion.div>
            </div>

            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        </motion.div>
    );
}
