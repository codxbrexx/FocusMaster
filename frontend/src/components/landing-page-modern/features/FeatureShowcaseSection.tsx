import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, CalendarCheck, BarChart3, ArrowRight } from 'lucide-react';

const cards = [
  {
    tag: 'Deep Work',
    tagColor: '#6D5EF9',
    tagBg: 'rgba(109,94,249,0.08)',
    tagBorder: 'rgba(109,94,249,0.2)',
    title: 'Enter a state of unbreakable focus',
    description:
      'Block distractions and immerse yourself in deep work sessions that actually move the needle. Proven Pomodoro intervals keep you locked in.',
    image: '/deep_work_elements.png',
    icon: Brain,
    accent: '#6D5EF9',
    imagePosition: 'center top',
    wide: true,
  },
  {
    tag: 'Focus Planning',
    tagColor: '#10b981',
    tagBg: 'rgba(16,185,129,0.08)',
    tagBorder: 'rgba(16,185,129,0.2)',
    title: 'Plan your sessions, own your day',
    description:
      'Structure your week with intelligent focus plans. Set intentions before each session and review progress as you go.',
    image: '/plan_focus.png',
    icon: CalendarCheck,
    accent: '#10b981',
    imagePosition: 'center center',
    wide: false,
  },
  {
    tag: 'Productivity',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.08)',
    tagBorder: 'rgba(245,158,11,0.2)',
    title: 'Track what you've actually done',
    description:
      'Visual analytics show your productive hours, streaks, and patterns — so you can improve what matters most.',
    image: '/productivity_element.png',
    icon: BarChart3,
    accent: '#f59e0b',
    imagePosition: 'center center',
    wide: false,
  },
];

const FeatureCard = ({
  card,
  index,
}: {
  card: (typeof cards)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = card.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow duration-500 ${
        card.wide ? 'md:col-span-2' : 'md:col-span-1'
      }`}
      style={{ minHeight: card.wide ? '420px' : '380px' }}
    >
      {/* Image area */}
      <div
        className="relative flex-1 overflow-hidden bg-slate-50"
        style={{ minHeight: card.wide ? '260px' : '200px' }}
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition: card.imagePosition }}
        />
        {/* Subtle bottom scrim so text doesn't clash */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '80px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Text area */}
      <div className="p-6 pt-4 flex flex-col gap-3">
        {/* Tag */}
        <span
          className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{
            color: card.tagColor,
            backgroundColor: card.tagBg,
            border: `1px solid ${card.tagBorder}`,
          }}
        >
          <Icon size={11} />
          {card.tag}
        </span>

        <h3 className="text-lg font-bold text-slate-900 leading-snug">
          {card.title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed">
          {card.description}
        </p>

        <button
          className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors self-start"
          style={{ color: card.accent }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.gap = '8px';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.gap = '6px';
          }}
        >
          Learn more
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Hover accent border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: `1.5px solid ${card.tagBorder}` }}
      />
    </motion.div>
  );
};

export const FeatureShowcaseSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="relative py-24 px-6 lg:px-16 xl:px-24 bg-[#f8f9fc]">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(15,23,42,0.04) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{
              color: '#6D5EF9',
              backgroundColor: 'rgba(109,94,249,0.08)',
              border: '1px solid rgba(109,94,249,0.2)',
            }}
          >
            Built for performance
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Everything you need to<br />
            <span style={{ color: '#6D5EF9' }}>do your best work</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            FocusMaster brings together the tools that high performers rely on —
            packaged in a single, distraction-free experience.
          </p>
        </motion.div>

        {/* Bento grid — wide card + 2 stacked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <FeatureCard key={card.tag} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
