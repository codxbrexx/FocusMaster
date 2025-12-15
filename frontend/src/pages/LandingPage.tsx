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
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px] opacity-20" />
            </div>

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
