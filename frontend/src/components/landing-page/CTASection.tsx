import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative z-10 py-20 sm:py-24 md:py-32 text-center bg-gradient-to-b from-transparent to-primary/5"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 px-4">Ready to regain your focus?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto px-4">
          Join thousands of users who have optimized their workflow with FocusMaster.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 transition-all duration-300"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base rounded-lg shadow-lg hover:shadow-purple-500/15 border border-border/50 transition-all duration-300"
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
