import { Suspense } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { StatsSection } from '../components/landing-page-modern/stats/StatsSection';
import { TestimonialsSection } from '../components/landing-page-modern/testimonials/TestimonialsSection';
import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
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
    <div className="min-h-screen bg-[#020202] text-foreground overflow-x-hidden selection:bg-white selection:text-black">
      <Suspense fallback={<LoadingFallback />}>
        <ModernHero />
        <StatsSection />
        <TestimonialsSection />
        <FinalCTASection />
      </Suspense>

      {/* Decorative mesh pattern overlay */}
      <div className="pointer-events-none fixed inset-0 bento-mask opacity-5 z-[100]" />
    </div>
  );
}
