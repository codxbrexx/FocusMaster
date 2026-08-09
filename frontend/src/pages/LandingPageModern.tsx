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
        {/* Foreground Content */}
        <div className="relative z-10 flex-grow flex flex-col pointer-events-auto w-full">
          <Header />
          {/* Visually hidden h1 */}
          <h1 className="sr-only">
            FocusMaster — Free Pomodoro Timer, Task Manager &amp; Productivity Dashboard
          </h1>
          <main aria-label="FocusMaster productivity app landing page">
            <ModernHero />
            
            {/* Elements below the hero with standard stacking (no inversion) */}
            <div className="relative z-10">
              <div id="features" aria-label="Features">
                <DetailedFeaturesSection />
              </div>

              <FinalCTASection />
              <FooterSection />
            </div>
          </main>
        </div>
      </Suspense>
    </div>
  );
}
