import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const Hero = () => {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <header className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-28 md:pb-32 text-center overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
      >
        <motion.div variants={fadeInUp} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-secondary/50 border border-border/50 text-secondary-foreground text-xs sm:text-sm font-medium backdrop-blur-sm">
            <span>Welcome to FocusMaster</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight leading-[1.1] text-foreground px-2">
            Master Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-400">
              Focus State
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
        >
          The all-in-one workspace designed to eliminate distraction. Combine tasks, time tracking,
          and deep work analytics into a single, flowing experience.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-4 sm:px-0"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 transition-all duration-300"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 border border-border/50 transition-all duration-300"
            onClick={async () => {
              try {
                await loginAsGuest();
                navigate('/dashboard');
              } catch (e: any) {
                console.error(e);
                toast.error('Guest login failed. Please try again.');
              }
            }}
          >
            Try as Guest
          </Button>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-12 sm:mt-16 md:mt-20 relative mx-auto max-w-5xl rounded-xl border border-border/40 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{ perspective: '1000px' }}
        >
          <div className="h-8 sm:h-10 bg-muted/30 border-b border-white/5 flex items-center px-3 sm:px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/20 border border-red-500/30" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/20 border border-yellow-500/30" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/20 border border-green-500/30" />
            </div>
            <div className="ml-4 h-5 w-64 rounded bg-muted/20 hidden sm:block"></div>
          </div>

          {/* App Content */}
          <div className="pt-6 sm:pt-10 grid grid-cols-12 gap-0 h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-br from-background/95 to-background/80">
            <div className="col-span-1 md:col-span-2 border-r border-white/5 hidden md:flex flex-col p-4 gap-4 bg-muted/10">
              <div className="flex items-center gap-2 mb-6 opacity-50">
                <div className="w-6 h-6 rounded bg-primary/40" />
                <div className="h-2 w-20 rounded bg-white/20" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 opacity-30">
                  <div className="w-5 h-5 rounded-sm bg-white/20" />
                  <div className="h-2 w-16 rounded-full bg-white/10" />
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 md:col-span-10 p-3 sm:p-6 md:p-8 grid grid-cols-12 gap-3 sm:gap-6 opacity-90 overflow-hidden relative">
              <div className="col-span-12 md:col-span-5 h-40 sm:h-48 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center justify-between">
                  <div className="h-2 sm:h-3 w-16 sm:w-24 rounded-full bg-primary/30" />
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-tighter text-foreground/90 mt-2 sm:mt-4">
                  25:00
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 sm:h-8 sm:w-24 rounded-lg bg-primary/40" />
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary/20" />
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 h-40 sm:h-48 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4 sm:p-6 flex flex-col justify-end gap-2 relative">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 h-2 sm:h-3 w-24 sm:w-32 rounded-full bg-blue-400/30" />
                <div className="flex items-end justify-between gap-1 sm:gap-2 h-20 sm:h-24 mt-auto opacity-70">
                  {[40, 70, 45, 90, 60, 80, 50, 75, 60, 90].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-full rounded-t-sm bg-blue-500/40 hover:bg-blue-400/60 transition-colors"
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-12 h-48 sm:h-64 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-500/10 to-transparent border border-white/10 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-32 rounded-full bg-white/20" />
                  <div className="h-8 w-8 rounded-lg bg-white/10" />
                </div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-full rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-4"
                  >
                    <div className="w-4 h-4 rounded-full border border-white/20" />
                    <div className="h-2 w-48 rounded-full bg-white/10" />
                    <div className="ml-auto w-16 h-4 rounded-full bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
};
