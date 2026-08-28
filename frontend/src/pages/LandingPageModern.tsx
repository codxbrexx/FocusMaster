import { Suspense } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { DetailedFeaturesSection } from '../components/landing-page-modern/detailed-features/DetailedFeaturesSection';
import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
import { FooterSection } from '../components/landing-page-modern/footer/FooterSection';
import { Loader } from '../components/ui/Loader';
import Header from '../components/landing-page-modern/header/Header';
import { Sparkles, Clock, BarChart2, Users, Trophy } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen w-full bg-[#f8f9fc] flex items-center justify-center">
    <div className="text-center">
      <Loader message="Preparing your experience" size={50} />
    </div>
  </div>
);

export function LandingPageModern() {
  return (
    <div
      className="light min-h-screen overflow-x-hidden selection:bg-indigo-500 selection:text-white relative bg-[#f8f9fc]"
    >
      <Suspense fallback={<LoadingFallback />}>
        <div className="relative z-10 flex-grow flex flex-col pointer-events-auto w-full">
          <Header />
          <h1 className="sr-only">
            FocusMaster — Free Pomodoro Timer, Task Manager &amp; Productivity Dashboard
          </h1>
          <main aria-label="FocusMaster productivity app landing page">
            <ModernHero />

            {/* Social proof strip */}
            <SocialProofStrip />

            {/* Detailed feature deep-dives */}
            <div aria-label="Detailed features">
              <DetailedFeaturesSection />
            </div>

            <FinalCTASection />
            <FooterSection />
          </main>
        </div>
      </Suspense>
    </div>
  );
}

/** Feature highlights bar between hero and detailed features */
const SocialProofStrip = () => {
  const highlights = [
    { icon: Users, label: 'Multiplayer Focus Rooms', color: 'text-rose-600' },
    { icon: Trophy, label: 'Gamification & Level Badges', color: 'text-amber-600' },
    { icon: Sparkles, label: 'AI Weekly Digest & Insights', color: 'text-indigo-600' },
    { icon: Clock, label: 'Pomodoro & Clock In/Out', color: 'text-cyan-600' },
    { icon: BarChart2, label: 'Focus Analytics & Heatmap', color: 'text-purple-600' },
  ];

  return (
    <div className="relative w-full border-y border-slate-200/70 bg-white/70 backdrop-blur-sm py-4 px-6 lg:px-16 xl:px-24">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around sm:justify-between gap-y-3 gap-x-6">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <h.icon className={`w-4.5 h-4.5 ${h.color}`} />
            <span>{h.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
