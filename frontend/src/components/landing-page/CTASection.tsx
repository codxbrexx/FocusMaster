import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
    const { loginAsGuest } = useAuth();
    const navigate = useNavigate();

    return (
        <section id="pricing" className="relative z-10 py-32 text-center bg-gradient-to-b from-transparent to-primary/5">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold mb-6">Ready to regain your focus?</h2>
                <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                    Join thousands of users who have optimized their workflow with FocusMaster.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register">
                        <Button size="lg" className="h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 transition-all duration-300">
                            Get Started <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 border border-border/50 transition-all duration-300"
                        onClick={async () => {
                            try {
                                await loginAsGuest();
                                navigate('/dashboard');
                            } catch (e) {
                                console.error(e);
                            }
                        }}
                    >
                        Try as Guest
                    </Button>
                </div>
            </div>
        </section>
    );
};
