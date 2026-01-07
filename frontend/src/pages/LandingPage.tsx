import { Navbar } from '@/components/landing-page/Navbar';
import { Hero } from '@/components/landing-page/Hero';
import { FeaturesGrid } from '@/components/landing-page/FeaturesGrid';
import { DetailedFeatures } from '@/components/landing-page/DetailedFeatures';
import { WorkflowSteps } from '@/components/landing-page/WorkflowSteps';
import { CTASection } from '@/components/landing-page/CTASection';
import { Footer } from '@/components/landing-page/Footer';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-matrix text-foreground overflow-hidden selection:bg-primary/30">
            <Navbar />
            <Hero />
            <FeaturesGrid />
            <DetailedFeatures />
            <WorkflowSteps />
            <CTASection />
            <Footer />
        </div>
    );
};
