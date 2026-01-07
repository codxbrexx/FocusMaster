
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Hero = () => {
    const { loginAsGuest } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Dynamic Background with Reduced Motion Support */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)] opacity-70" />
                <motion.div
                    className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent1/20 rounded-full blur-[100px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ willChange: "transform" }}
                />
                <motion.div
                    className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent2/20 rounded-full blur-[100px]"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ willChange: "transform" }}
                />
            </div>

            <div className="absolute inset-0 bg-matrix z-0 opacity-20 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 backdrop-blur-md shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            v2.0 Now Available
                        </span>
                    </motion.div>

                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-2">
                        Master Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent1 to-accent2">
                            Mental Flow
                        </span>
                    </h1>

                    <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground leading-relaxed">
                        The all-in-one productivity suite for deep work. Fuse tasks, timer, and workflow into a single, distraction-free environment.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                >
                    <Link to="/register">
                        <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium bg-white text-black hover:bg-white/90 shadow-glow-lg transition-all hover:scale-105">
                            Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                        See Features
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-12 px-8 text-base rounded-full hover:bg-white/5 transition-all duration-300 text-white/70 hover:text-white"
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: 0.5, duration: 1, type: "spring" }}
                    className="mt-16 relative mx-auto max-w-5xl perspective-1000"
                >
                    <div className="relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent1/10 to-accent2/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        {/* Placeholder for App Screenshot/Preview */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/20 font-heading text-2xl font-semibold">FocusMaster Dashboard</p>
                        </div>
                        {/* Glass Reflection Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Glow Effect behind container */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-accent1 to-accent2 opacity-20 blur-3xl -z-10" />
                </motion.div>
            </div>
        </div>
    );
};
