import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Loader2, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingPage } from '../components/ui/LoadingPage';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginAsGuest, googleLogin } = useAuth();
  const navigate = useNavigate();

  const isAnyLoading = isLoading || isGoogleLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      // @ts-expect-error Google global is injected via script tag
      if (typeof window !== 'undefined' && !window.google) {
        setError('AdBlocker detected. Please disable it to use Google Login.');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      toast.error('Please fill in all fields');
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      const errorMessage =
        data?.errors?.[0]?.message ||
        data?.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isGoogleLoading) {
    return <LoadingPage customMessage="Authenticating with Google..." />;
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#191918] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans relative overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/FM_logo.png"
            alt="FocusMaster Logo"
            className="h-8 w-8 object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-[#191918]">
            FocusMaster
          </span>
        </Link>

        <Link
          to="/"
          className="text-[#75736C] hover:text-[#191918] p-2 rounded-full hover:bg-[#EFECE6] transition-colors"
          title="Return to Home"
        >
          <X className="h-5 w-5" />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-4 lg:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Headline & Auth Box */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          {/* Headlines with Solid Colors */}
          <div className="max-w-xl mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.1] tracking-tight text-[#191918]">
              Master your focus
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#666560] mt-3">
              Your AI-powered partner for deep work, study plans & exam mastery
            </p>
          </div>

          {/* Auth Card Box - Clean Light Theme */}
          <div className="w-full max-w-[420px] bg-white border border-[#E6E4DF] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative">
            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {error}
              </div>
            )}

            {/* Google Login Section */}
            <div className="mb-5 flex justify-center w-full">
              {(() => {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                const isConfigured = Boolean(
                  clientId &&
                    clientId !== 'PLACEHOLDER_CLIENT_ID' &&
                    !clientId.includes('your_google_client_id')
                );

                if (isConfigured) {
                  return (
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        if (credentialResponse.credential) {
                          try {
                            setIsGoogleLoading(true);
                            setError('');
                            await googleLogin(credentialResponse.credential);
                            navigate('/dashboard');
                          } catch {
                            setError('Google login failed. Please try again.');
                          } finally {
                            setIsGoogleLoading(false);
                          }
                        }
                      }}
                      onError={() => {
                        setError('Google Login Failed');
                      }}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="pill"
                      width="356"
                    />
                  );
                }

                return (
                  <button
                    type="button"
                    className="w-full h-11 bg-white hover:bg-[#F4F4F0] border border-[#E6E4DF] text-[#191918] font-medium rounded-xl transition-all flex items-center justify-center gap-3 text-sm cursor-pointer shadow-sm"
                    onClick={() => {
                      toast.info(
                        'Google Login setup required: Add VITE_GOOGLE_CLIENT_ID to frontend/.env file.'
                      );
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                );
              })()}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E6E4DF]"></div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#9C9A92]">
                OR
              </span>
              <div className="flex-1 h-px bg-[#E6E4DF]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:border-[#191918] focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl text-sm px-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:border-[#191918] focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 rounded-xl text-sm px-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAnyLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-3 text-[#9C9A92] hover:text-[#191918] transition-colors"
                    tabIndex={-1}
                    disabled={isAnyLoading}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Main Solid CTA Button */}
              <button
                type="submit"
                className="w-full h-11 bg-[#191918] hover:bg-[#333330] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                disabled={isAnyLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Signing in...
                  </>
                ) : (
                  'Continue with email'
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-5 text-center">
              <Link
                to="/register"
                className="text-xs text-[#666560] hover:text-[#191918] transition-colors inline-block"
              >
                Need a FocusMaster account?{' '}
                <span className="underline font-medium text-[#191918] underline-offset-4">
                  Register now
                </span>
              </Link>
            </div>
          </div>

          {/* Secondary Action Below Box */}
          <div className="mt-6">
            <button
              type="button"
              className="bg-[#ECEAE4] hover:bg-[#E2DFD7] text-[#191918] text-xs font-medium py-2.5 px-5 rounded-full transition-colors cursor-pointer border border-[#E0DDD5] flex items-center gap-2"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await loginAsGuest();
                  navigate('/dashboard');
                } catch {
                  // Handled
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isAnyLoading}
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image Frame */}
        <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-hidden border border-[#E6E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-white">
            <img
              className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              src="/auth_image.png"
              alt="Deep focus study workspace"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 sm:px-12 py-4 text-center text-[11px] text-[#9C9A92]">
        By continuing, you agree to FocusMaster’s{' '}
        <a href="#" className="underline hover:text-[#191918] transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline hover:text-[#191918] transition-colors">
          Privacy Policy
        </a>
        .
      </footer>
    </div>
  );
}
