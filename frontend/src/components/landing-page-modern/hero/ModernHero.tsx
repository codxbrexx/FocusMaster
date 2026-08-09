import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Zap, BarChart3, FolderKanban, Brain, Lock, Loader2 } from 'lucide-react';
import { LoadingPage } from '../../ui/LoadingPage';

const sideCards = [
  {
    icon: Zap,
    title: 'Lightning Quick',
    description: 'Sub-100ms response time for seamless interactions',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Adaptive focus suggestions based on your patterns',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data, always yours. End-to-end encrypted.',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Leverage proven techniques to enhance your focus and efficiency.',
  },
  {
    icon: BarChart3,
    title: 'Gain Insights',
    description: 'Understand your work patterns with powerful, visual analytics.',
  },
  {
    icon: FolderKanban,
    title: 'Stay Organized',
    description: 'Manage tasks and projects seamlessly to keep your workflow clear.',
  },
];

export const ModernHero = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      await loginAsGuest();
      navigate('/dashboard');
    } catch {
      // Error is handled by context toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingPage customMessage="Setting up guest session..." />}
      <section
        className="relative w-full overflow-hidden selection:bg-indigo-500 selection:text-white"
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}
      >

      <div className="absolute inset-0 z-0">
        <img
          src="/hero_light.webp"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />

        {/* Top fade — blends into navbar */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: '180px',
            background: 'linear-gradient(to bottom, #f8f9fc 0%, rgba(248,249,252,0.6) 40%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '380px',
            background: 'linear-gradient(to top, #f8f9fc 0%, #f8f9fc 12%, rgba(248,249,252,0.92) 30%, rgba(248,249,252,0.7) 50%, rgba(248,249,252,0.3) 70%, transparent 100%)',
          }}
        />
      </div>

      <div
        className="relative z-10 w-full min-h-[100vh] flex flex-col"
      >
        {/* Content row — fills the viewport */}
        <div
          className="flex-1 flex items-stretch w-full px-6 lg:px-16 xl:px-24"
          style={{ paddingTop: '88px' }} /* clears fixed header */
        >
          {/* LEFT column — headline, sub, CTAs */}
          <div
            className="flex flex-col justify-center w-full lg:w-[44%] pb-12 lg:pb-20"
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <h2
                className="font-black uppercase tracking-tighter text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem]"
                style={{ color: '#0f172a', lineHeight: 0.95 }}
              >
                Transform<br />
                Your<br />
                <span style={{ color: '#6D5EF9' }}>Productivity</span>
              </h2>
            </motion.div>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              className="mt-6 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-[320px] md:max-w-[400px]"
              style={{ color: 'rgba(15,23,42,0.56)' }}
            >
              We engineer immersive focus experiences<br />
              through advanced productivity tools and<br />
              spatial mastery.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
              className="mt-8 mb-8 flex flex-col sm:flex-row w-full sm:w-auto gap-3.5"
            >
              <a
                href="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '13px 28px',
                  backgroundColor: '#6D5EF9',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7C6EF9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6D5EF9')}
              >
                Get Started Free
              </a>
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '13px 28px',
                  backgroundColor: 'transparent',
                  color: '#0f172a',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1.5px solid rgba(15,23,42,0.25)',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  whiteSpace: 'nowrap',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (isLoading) return;
                  e.currentTarget.style.borderColor = 'rgba(109,94,249,0.6)';
                  e.currentTarget.style.backgroundColor = 'rgba(109,94,249,0.06)';
                }}
                onMouseLeave={e => {
                  if (isLoading) return;
                  e.currentTarget.style.borderColor = 'rgba(15,23,42,0.25)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />
                    Starting...
                  </>
                ) : (
                  'Try Guest Mode'
                )}
              </button>
            </motion.div>
          </div>

          {/* CENTER spacer — image shows through */}
          <div className="flex-1 hidden lg:block" />

          {/* RIGHT column — floating info cards */}
          <div
            className="hidden lg:flex flex-col justify-center gap-3"
            style={{ width: '260px', paddingBottom: '80px' }}
          >
            {sideCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.12 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '16px 18px',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(15,23,42,0.1)',
                    borderRadius: 0,
                    cursor: 'default',
                    transition: 'border-color 0.2s',
                    boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(109,94,249,0.45)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(15,23,42,0.1)';
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(109,94,249,0.1)',
                      border: '1px solid rgba(109,94,249,0.22)',
                      borderRadius: 0,
                    }}
                  >
                    <Icon size={15} style={{ color: '#6D5EF9' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                      {card.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(15,23,42,0.5)', lineHeight: '1.55' }}>
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM — Feature icons row */}
        <div
          className="relative z-10 w-full px-6 lg:px-16 xl:px-24"
          style={{
            paddingBottom: '52px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(15,23,42,0.08)',
          }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-x-8 max-w-[560px]"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  {/* Round icon container */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(109,94,249,0.08)',
                      border: '1px solid rgba(109,94,249,0.18)',
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={20} style={{ color: '#6D5EF9' }} />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                    {f.title}
                  </p>
                  <p style={{ fontSize: '11.5px', color: 'rgba(15,23,42,0.45)', lineHeight: '1.55' }}>
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
