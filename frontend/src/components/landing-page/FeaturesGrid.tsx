import { motion } from 'framer-motion';
import { Timer, BarChart2, ListTodo, Music2, Clock, Shield } from 'lucide-react';

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
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
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export const FeaturesGrid = () => {
  return (
    <section
      id="features"
      className="relative z-10 container mx-auto px-6 py-24 border-t border-border/40"
    >
      <div className="text-center mb-16 space-y-4">
        <h2
          className="text-3xl md:text-5xl font-heading font-bold bg-clip-text 
                    text-transparent bg-purple-400"
        >
          Your All-in-One Productivity Ecosystem
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stop switching apps. FocusMaster combines scientifically-proven tools to keep you in the
          flow state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Timer className="w-6 h-6 text-blue-400" />}
          title="Smart Focus Timer"
          description="Advanced Pomodoro engine with customizable intervals, auto-start breaks, and immersive soundscapes."
          delay={0.1}
        />
        <FeatureCard
          icon={<ListTodo className="w-6 h-6 text-green-400" />}
          title="Seamless Task Management"
          description="Organize projects with Kanban boards. Drag, drop, and prioritize tasks without leaving your focus zone."
          delay={0.2}
        />
        <FeatureCard
          icon={<BarChart2 className="w-6 h-6 text-purple-400" />}
          title="Deep Work Analytics"
          description="Visualize your productivity. Track heatmaps, session trends, and daily performance scores."
          delay={0.3}
        />
        <FeatureCard
          icon={<Music2 className="w-6 h-6 text-pink-400" />}
          title="Embedded Spotify Player"
          description="Curate your environment. Control your favorite focus playlists directly from the dashboard."
          delay={0.4}
        />
        <FeatureCard
          icon={<Clock className="w-6 h-6 text-yellow-400" />}
          title="Effortless Time Tracking"
          description="Log your hours automatically. Clock in, clock out, and generate detailed reports for your clients."
          delay={0.5}
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6 text-cyan-400" />}
          title="Private & Secure"
          description="Your data is yours. We use bank-grade encryption and secure authentication to keep your work safe."
          delay={0.6}
        />
      </div>
    </section>
  );
};
