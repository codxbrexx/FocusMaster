import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export interface TestimonialProps {
  avatar: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export const TestimonialCard: FC<TestimonialProps> = ({
  avatar,
  name,
  role,
  company,
  quote,
  rating,
}) => {
  return (
    <motion.div
      className="glass-panel p-8 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all h-full"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-500 text-yellow-500"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-300 text-base leading-relaxed mb-6 italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 border-t border-slate-700 pt-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <p className="text-xs text-slate-400">
            {role}
            {company && ` at ${company}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
