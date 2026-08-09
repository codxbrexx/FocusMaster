import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden py-24 md:py-36 px-6 lg:px-16 xl:px-24"
    >
      {/* Premium gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 40%, #fdf4ff 70%, #fff7ed 100%)',
        }}
      />
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(109,94,249,0.4), transparent)',
        }}
      />
      {/* Decorative blobs */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(109,94,249,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-[0.95] tracking-tight">
            Ready to do your<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6D5EF9 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              best work ever?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of people who have reclaimed their focus and
            transformed how they work — completely free, no credit card required.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="group relative px-8 py-4 text-white font-bold rounded-xl overflow-hidden transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            style={{
              background: 'linear-gradient(135deg, #6D5EF9 0%, #8B7CF6 100%)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/login')}
            className="px-8 py-4 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 font-semibold rounded-xl transition-all hover:bg-indigo-50/60 bg-white/80 backdrop-blur-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign In
          </motion.button>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {['No credit card', 'Free forever', 'Open source'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
