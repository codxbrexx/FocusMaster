import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Hero = () => {
    const { loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <header className="relative z-10 container mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32 text-center">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-5xl mx-auto space-y-8"
            >
                <div className="relative z-10 pt-12">
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-md">
                        <span> Welcome to FocusMaster</span>
                    </motion.div>

                    <div className="relative">
                        {/* Text Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] " />

                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight leading-[1.1] mb-6 text-foreground">
                            Focus <span className="text-blue-500">Deeply</span>. <br />
                            <span className="text-purple-500 backdown-blur-sm">
                                Achieve Mastery.
                            </span>
                        </motion.h1>
                    </div>

                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Transform the way you work with a powerful workspace that integrates focus tools, real-time insights, and
                        intuitive task management to keep you in the zone longer.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-101"
                            >
                                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-101"
                            onClick={async () => {
                                try {
                                    await loginAsGuest();
                                    navigate('/dashboard');
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                        >
                            Try as Guest
                        </Button>
                    </motion.div>
                </div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    variants={fadeInUp}
                    className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-border/40 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-sm"
                    style={{ perspective: "1000px" }}
                >
                    {/* Browser Window Controls */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-muted/80 flex items-center px-4 gap-2 border-b border-white/5 z-20">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>

                    {/* App Content */}
                    <div className="pt-10 grid grid-cols-12 gap-0 h-[400px] md:h-[600px] bg-gradient-to-br from-background/95 to-background/80">

                        {/* Fake Sidebar */}
                        <div className="col-span-1 md:col-span-2 border-r border-white/5 hidden md:flex flex-col p-4 gap-4 bg-muted/10">
                            <div className="flex items-center gap-2 mb-6 opacity-50">
                                <div className="w-6 h-6 rounded bg-primary/40" />
                                <div className="h-2 w-20 rounded bg-white/20" />
                            </div>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-3 opacity-30">
                                    <div className="w-5 h-5 rounded-sm bg-white/20" />
                                    <div className="h-2 w-16 rounded-full bg-white/10" />
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="col-span-12 md:col-span-10 p-6 md:p-8 grid grid-cols-12 gap-6 opacity-90 overflow-hidden relative">

                            {/* Stats / Timer Card */}
                            <div className="col-span-12 md:col-span-5 h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <div className="flex items-center justify-between">
                                    <div className="h-3 w-24 rounded-full bg-primary/30" />
                                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                                </div>
                                <div className="text-4xl md:text-5xl font-mono font-bold tracking-tighter text-foreground/90 mt-4">
                                    25:00
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <div className="h-8 w-24 rounded-lg bg-primary/40" />
                                    <div className="h-8 w-8 rounded-lg bg-primary/20" />
                                </div>
                            </div>

                            {/* Activity Chart Card */}
                            <div className="col-span-12 md:col-span-7 h-48 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-6 flex flex-col justify-end gap-2 relative">
                                <div className="absolute top-6 left-6 h-3 w-32 rounded-full bg-blue-400/30" />
                                <div className="flex items-end justify-between gap-2 h-24 mt-auto opacity-70">
                                    {[40, 70, 45, 90, 60, 80, 50, 75, 60, 90].map((h, i) => (
                                        <div key={i} style={{ height: `${h}%` }} className="w-full rounded-t-sm bg-blue-500/40 hover:bg-blue-400/60 transition-colors" />
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Section (Task List) */}
                            <div className="col-span-12 h-64 rounded-2xl bg-gradient-to-br from-zinc-500/10 to-transparent border border-white/10 p-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="h-4 w-32 rounded-full bg-white/20" />
                                    <div className="h-8 w-8 rounded-lg bg-white/10" />
                                </div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 w-full rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-4">
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
