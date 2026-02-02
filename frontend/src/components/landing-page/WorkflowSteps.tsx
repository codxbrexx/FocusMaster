import { Timer, BarChart2, Trophy } from 'lucide-react';

export const WorkflowSteps = () => {
  return (
    <section
      id="workflow"
      className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 border-t border-border/40"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6 px-4">
          A Simple Workflow Designed for <span className="text-primary">Real Productivity</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Step 1 */}
        <div className="relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border border-border flex items-center justify-center text-lg sm:text-xl font-bold font-heading text-primary shadow-lg z-10">
            1
          </div>
          <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex justify-center text-primary/80">
            <Timer className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Set Your Focus Session</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Choose your Pomodoro intervals, select a task, and start your session.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border border-border flex items-center justify-center text-lg sm:text-xl font-bold font-heading text-primary shadow-lg z-10">
            2
          </div>
          <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex justify-center text-primary/80">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Work in Flow Mode</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Stay immersed with a unified timer, task board, and music control.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card/30 border border-border/50 text-center hover:bg-card/50 transition-colors group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border border-border flex items-center justify-center text-lg sm:text-xl font-bold font-heading text-primary shadow-lg z-10">
            3
          </div>
          <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 flex justify-center text-primary/80">
            <BarChart2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Review Your Analytics</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gain insights into your focus patterns and improve your performance daily.
          </p>
        </div>
      </div>
    </section>
  );
};
