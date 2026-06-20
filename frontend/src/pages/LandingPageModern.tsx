import { Suspense } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { FeaturesSection } from '../components/landing-page-modern/features/FeaturesSection';
import { DetailedFeaturesSection } from '../components/landing-page-modern/detailed-features/DetailedFeaturesSection';
import { HowItWorksSection } from '../components/landing-page-modern/how-it-works/HowItWorksSection';
import { StatsSection } from '../components/landing-page-modern/stats/StatsSection';

import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
import { FooterSection } from '../components/landing-page-modern/footer/FooterSection';
import { Loader } from '../components/ui/Loader';
import Header from '../components/landing-page-modern/header/Header';

const LoadingFallback = () => (
  <div className="min-h-screen w-full bg-[#020202] flex items-center justify-center">
    <div className="text-center">
      <Loader message="Preparing your experience" size={50} />
    </div>
  </div>
);

export function LandingPageModern() {
  return (
    <div className="dark min-h-screen bg-[#0f0f1e] text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Suspense fallback={<LoadingFallback />}>
        <Header />
        {/* Visually hidden h1 — feeds primary keyword to search engines without affecting visual design */}
        <h1 className="sr-only">
          FocusMaster — Free Pomodoro Timer, Task Manager &amp; Productivity Dashboard
        </h1>
        <main aria-label="FocusMaster productivity app landing page">
          <ModernHero />
          <div id="features" aria-label="Features">
            <FeaturesSection />
          </div>
          <DetailedFeaturesSection />
          <div id="how-it-works" aria-label="How it works">
            <HowItWorksSection />
          </div>
          <StatsSection />

          <FinalCTASection />
          <FooterSection />
        </main>
      </Suspense>
    </div>
  );
}
