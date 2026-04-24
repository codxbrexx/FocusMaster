import { Suspense } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { FeaturesSection } from '../components/landing-page-modern/features/FeaturesSection';
import { DetailedFeaturesSection } from '../components/landing-page-modern/detailed-features/DetailedFeaturesSection';
import { HowItWorksSection } from '../components/landing-page-modern/how-it-works/HowItWorksSection';
import { StatsSection } from '../components/landing-page-modern/stats/StatsSection';
import { TestimonialsSection } from '../components/landing-page-modern/testimonials/TestimonialsSection';
import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
import { FooterSection } from '../components/landing-page-modern/footer/FooterSection';
import { Loader } from '../components/ui/Loader';

const LoadingFallback = () => (
  <div className="min-h-screen w-full bg-[#020202] flex items-center justify-center">
    <div className="text-center">
      <Loader message="Preparing your experience" size={50} />
    </div>
  </div>
);

export function LandingPageModern() {
  return (
    <div className="min-h-screen bg-[#0f0f1e] text-foreground overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Suspense fallback={<LoadingFallback />}>
        <ModernHero />
        <FeaturesSection />
        <DetailedFeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <FinalCTASection />
        <FooterSection />
      </Suspense>
    </div>
  );
}
