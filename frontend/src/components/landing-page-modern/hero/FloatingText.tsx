import { motion } from 'framer-motion';

export const FloatingText = () => {
  return (
    <motion.div
      className="max-w-4xl lg:-translate-y-8 pr-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-6xl md:text-8xl font-black leading-[0.87] tracking-tighter text-white uppercase">
        Transform Your <br />
        <span className="text-indigo-500">
          PRODUCTIVITY
        </span>
      </h1>

      <p className="mt-8 font-mono text-[11px] text-white/40 uppercase tracking-[0.35em] max-w-sm leading-relaxed">
        We engineer immersive focus experiences through advanced productivity tools and spatial mastery.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="/register"
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center min-w-[170px]"
        >
          Get Started Free
        </a>
        <a
          href="/login"
          className="px-8 py-4 border border-white/20 hover:border-indigo-500/50 hover:bg-white/5 text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center min-w-[170px]"
        >
          Try Guest Mode
        </a>
      </div>
    </motion.div>
  );
};
