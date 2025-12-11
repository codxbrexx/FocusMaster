import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Timer,
    BarChart2,
    ListTodo,
    Music2,
    ArrowRight,
    Trophy,
    Clock,
    Shield
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
        <div className="min-h-screen bg-matrix text-foreground overflow-hidden selection:bg-primary/30">
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
            <header className="relative z-10 container mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32 text-center">
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

            {/* High-Level Features Overview */}
            <section className="relative z-10 container mx-auto px-6 py-24 border-t border-border/40">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold bg-clip-text 
                    text-transparent bg-purple-400">
                        Everything You Need to Work Smarter
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A complete ecosystem designed to keep you in the flow state.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Timer className="w-6 h-6 text-blue-400" />}
                        title="Pomodoro Focus Engine"
                        description="Customizable focus cycles, automatic breaks, sound cues, and session history."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<ListTodo className="w-6 h-6 text-green-400" />}
                        title="Kanban Task Manager"
                        description="Drag-and-drop workflow boards with priorities, tags, and statuses."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<BarChart2 className="w-6 h-6 text-purple-400" />}
                        title="Deep Productivity Analytics"
                        description="Heatmaps, trends, performance scores, and detailed focus metrics."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<Music2 className="w-6 h-6 text-pink-400" />}
                        title="Spotify Integration"
                        description="Control playlists and music directly from the dashboard without losing focus."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Clock className="w-6 h-6 text-yellow-400" />}
                        title="Time Tracking System"
                        description="Clock in/out, daily logs, and real-time time summaries."
                        delay={0.5}
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-cyan-400" />}
                        title="Secure Authentication"
                        description="Your workspace is protected with secure JWT-based login and encrypted data."
                        delay={0.6}
                    />
                </div>
            </section>

            {/* Detailed Feature Sections */}
            <section className="relative z-10 container mx-auto px-6 py-20 space-y-32">
                {/* Pomodoro */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                            <Timer className="w-4 h-4" /> Focus Engine
                        </div>
                        <h3 className="text-4xl font-heading font-bold">Designed for deep work.</h3>
                        <ul className="space-y-4 text-muted-foreground text-lg">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Fully customizable session lengths
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Auto-start cycles and smart break management
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Every session stored for analytics
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20"
                    >
                        {/* Placeholder illustration for Pomodoro */}
                        <div className="aspect-video rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                            <div className="text-6xl font-mono text-blue-400/50 font-bold">25:00</div>
                        </div>
                    </motion.div>
                </div>

                {/* Kanban */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                            <ListTodo className="w-4 h-4" /> Task Manager
                        </div>
                        <h3 className="text-4xl font-heading font-bold">Your tasks, structured with clarity.</h3>
                        <ul className="space-y-4 text-muted-foreground text-lg">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" /> Visual drag-and-drop boards
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" /> Custom categories and statuses
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" /> Perfect for study plans and sprint planning
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20">
                        {/* Placeholder illustration for Kanban */}
                        <div className="aspect-video rounded-xl bg-green-500/10 flex gap-4 p-4 overflow-hidden border border-green-500/10">
                            <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                            <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                            <div className="w-1/3 bg-green-500/20 rounded-lg h-full" />
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium">
                            <BarChart2 className="w-4 h-4" /> Productivity Analytics
                        </div>
                        <h3 className="text-4xl font-heading font-bold">Understand how you work.</h3>
                        <ul className="space-y-4 text-muted-foreground text-lg">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500" /> Daily and weekly performance insights
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500" /> Focus heatmaps
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500" /> Session logs and breakdown reports
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                        {/* Placeholder illustration for Analytics */}
                        <div className="aspect-video rounded-xl bg-purple-500/10 flex items-end justify-between p-6 gap-2 border border-purple-500/10">
                            {[40, 70, 50, 90, 60, 80, 50].map((h, i) => (
                                <div key={i} style={{ height: `${h}%` }} className="w-full bg-purple-500/40 rounded-t-sm" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Spotify */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium">
                            <Music2 className="w-4 h-4" /> Spotify Control
                        </div>
                        <h3 className="text-4xl font-heading font-bold">Your music, your flow.</h3>
                        <ul className="space-y-4 text-muted-foreground text-lg">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-pink-500" /> Play, pause, skip
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-pink-500" /> Manage playlists
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-pink-500" /> No context switching
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/20">
                        {/* Placeholder illustration for Spotify */}
                        <div className="aspect-video rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/10 gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-pink-500/50 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-pink-500 border-b-[8px] border-b-transparent ml-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Tracking */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium">
                            <Clock className="w-4 h-4" /> Time Tracking
                        </div>
                        <h3 className="text-4xl font-heading font-bold">Know exactly where your time goes.</h3>
                        <ul className="space-y-4 text-muted-foreground text-lg">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" /> Clock-in/clock-out
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" /> Automatic session logging
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" /> Perfect for freelancers and remote workers
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 p-8 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/20">
                        {/* Placeholder illustration for Time Tracking */}
                        <div className="aspect-video rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/10 text-yellow-500 font-mono text-4xl">
                            09:41:05
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (3-Step Walkthrough) */}
            <section className="relative z-10 container mx-auto px-6 py-24 border-t border-border/40">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                        A Simple Workflow Designed for <span className="text-primary">Real Productivity</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="relative p-8 rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-xl font-bold font-heading text-primary shadow-lg z-10">
                            1
                        </div>
                        <div className="mt-6 mb-4 flex justify-center text-primary/80">
                            <Timer className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Set Your Focus Session</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Choose your Pomodoro intervals, select a task, and start your session.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative p-8 rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-xl font-bold font-heading text-primary shadow-lg z-10">
                            2
                        </div>
                        <div className="mt-6 mb-4 flex justify-center text-primary/80">
                            <Trophy className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Work in Flow Mode</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Stay immersed with a unified timer, task board, and music control.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative p-8 rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-xl font-bold font-heading text-primary shadow-lg z-10">
                            3
                        </div>
                        <div className="mt-6 mb-4 flex justify-center text-primary/80">
                            <BarChart2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Review Your Analytics</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Gain insights into your focus patterns and improve your performance daily.
                        </p>
                    </div>
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
            <footer className="relative z-10 backdrop-blur-xl border-t border-border/40 bg-background/50 py-6">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3 opacity-80">
                        <img src="/fmasterlogo.png" alt="Logo" className="w-6 h-6 rounded-md" />
                        <span className="font-bold">FocusMaster</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FocusMaster. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
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
