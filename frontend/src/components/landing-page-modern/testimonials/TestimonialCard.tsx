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
      className="glass-panel p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all h-full"
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
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-white/80 text-base leading-relaxed mb-6 italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 border-t border-white/10 pt-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <p className="text-xs text-white/60">
            {role}
            {company && ` at ${company}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
