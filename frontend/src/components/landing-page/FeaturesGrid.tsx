import { motion } from 'framer-motion';
import {
    Timer,
    BarChart2,
    ListTodo,
    Music2,
    Clock,
    Shield
} from 'lucide-react';

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

export const FeaturesGrid = () => {
    return (
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
    );
};
