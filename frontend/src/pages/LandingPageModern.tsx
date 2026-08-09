import { Suspense } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { DetailedFeaturesSection } from '../components/landing-page-modern/detailed-features/DetailedFeaturesSection';
import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
import { FooterSection } from '../components/landing-page-modern/footer/FooterSection';
import { Loader } from '../components/ui/Loader';
import Header from '../components/landing-page-modern/header/Header';

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

/** Lightweight inline social-proof bar between hero and features */
const SocialProofStrip = () => (
  <div
    className="relative w-full border-y border-slate-200/70 bg-white/60 backdrop-blur-sm py-5 px-6 lg:px-16 xl:px-24"
  >
    <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-y-4 gap-x-8">
      {/* Left — user count */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {['#6D5EF9', '#10b981', '#f59e0b', '#ef4444'].map((c, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
              style={{ backgroundColor: c }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 font-medium">
          Join <span className="font-bold text-slate-900">1,200+</span> productive people
        </p>
      </div>

      {/* Center — trust badges */}
      <div className="hidden sm:flex items-center gap-6">
        {[
          { label: 'Free forever', emoji: '' },
          { label: 'No credit card', emoji: '' },
          { label: 'Open source', emoji: '' },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <span>{b.emoji}</span>
            {b.label}
          </div>
        ))}
      </div>

      {/* Right — rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1,2,3,4,5].map(s => (
            <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-slate-600 font-medium">
          <span className="font-bold text-slate-900">4.9</span> / 5.0
        </span>
      </div>
    </div>
  </div>
);
