import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Timer,
    BarChart2,
    ListTodo,
    Music2,
    ArrowRight,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const LandingPage = () => {
    const { user, loginAsGuest } = useAuth();
    const navigate = useNavigate();

    // Animation variants
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
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px] opacity-20" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/fmasterlogo.png"
                            alt="FocusMaster Logo"
                            className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/20"
                        />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            FocusMaster
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to="/dashboard">
                                <Button>Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="hidden sm:flex">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto space-y-8"
                >
                    <div className="relative z-10">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-md">
                            <Trophy className="w-4 h-4" />
                            <span> #1 Productivity Suite for Flow State</span>
                        </motion.div>

                        <div className="relative">
                            {/* Text Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] " />

                            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                                Focus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Deeply</span>. <br />
                                <span className="text-transparent bg-clip-text bg-purple-500">
                                    Achieve Mastery.
                                </span>
                            </motion.h1>
                        </div>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                            Transform your workflow with the ultimate productivity dashboard.
                            Pomodoro, Spotify, Kanban & Analytics.
                            <div className="flex justify-center items-center gap-2 mt-2 ">
                                <span className="text-gray-100 font-semibold">All in one place.</span>
                            </div>
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

            {/* Features Grid */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <FeatureCard
                        icon={<Timer className="w-8 h-8 text-blue-400" />}
                        title="Pomodoro Timer"
                        description="Customizable focus intervals with short and long breaks to maintain peak mental performance."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<ListTodo className="w-8 h-8 text-green-400" />}
                        title="Task Management"
                        description="Organize your daily goals with a sleek Kanban-style board or simple list view."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<BarChart2 className="w-8 h-8 text-purple-400" />}
                        title="Deep Analytics"
                        description="Visualize your productivity trends with heatmaps, daily charts, and session logs."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Music2 className="w-8 h-8 text-pink-400" />}
                        title="Spotify Sync"
                        description="Control your focus music directly from the dashboard without switching tabs."
                        delay={0.3}
                    />
                </motion.div>
            </section>

            {/* Social Proof / Trust */}
            <section className="relative z-10 container mx-auto px-6 py-24 text-center border-t border-border/40">
                <h2 className="text-3xl font-bold mb-12">Trusted by productive people</h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Just using text for logos for now, could be SVGs */}
                    <span className="text-xl font-bold font-mono">ACME Corp</span>
                    <span className="text-xl font-bold font-serif">GlobalTech</span>
                    <span className="text-xl font-bold font-sans">StartUpInc</span>
                    <span className="text-xl font-bold">DevHouse</span>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-32 text-center bg-gradient-to-b from-transparent to-primary/5">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6">Ready to regain your focus?</h2>
                    <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                        Join thousands of users who have optimized their workflow with FocusMaster.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="h-12 px-8 rounded-full">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/40 bg-background/50 py-6">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3 opacity-80">
                        <img src="/fmasterlogo.png" alt="Logo" className="w-6 h-6 rounded-md" />
                        <span className="font-bold">FocusMaster</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FocusMaster. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <a href="updated soon" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="https://github.com/codxbrexx" className="hover:text-primary transition-colors">Terms</a>
                        <a href="https://github.com/codxbrexx" className="hover:text-primary transition-colors">GitHub</a>
                        <a href="https://linkedin/mozammilali" className="hover:text-primary transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card/60 hover:border-primary/20 backdrop-blur-sm transition-all group"
    >
        <div className="mb-4 p-3 rounded-xl bg-background/50 w-fit group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
        </p>
    </motion.div>
);