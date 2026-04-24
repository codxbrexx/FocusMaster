import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0f0f1e] to-[#0a0a0a] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      <div className="mx-auto max-w-4xl text-center">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your Workflow?
          </h2>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have reclaimed their focus and
            transformed how they work. Start your free trial today.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="group relative px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg overflow-hidden transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => window.open('https://demo.focusmaster.dev', '_blank')}
            className="px-8 py-4 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 font-semibold rounded-lg transition-all hover:bg-indigo-500/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Demo
          </motion.button>
        </motion.div>

        {/* Trust statement */}
        <motion.p
          className="mt-12 text-sm text-slate-500 font-mono uppercase tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
           • Trusted YourSelf
        </motion.p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10 translate-y-1/2" />
    </section>
  );
};
