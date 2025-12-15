import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
    return (
        <section className="relative z-10 py-32 text-center bg-gradient-to-b from-transparent to-primary/5">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold mb-6">Ready to regain your focus?</h2>
                <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                    Join thousands of users who have optimized their workflow with FocusMaster.
                </p>
                <Link to="/register">
                    <Button size="lg" className="h-12 px-8 rounded-full">
                        Get Started Now
                    </Button>
                </Link>
            </div>
        </section>
    );
};
