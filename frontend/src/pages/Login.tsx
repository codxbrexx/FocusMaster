import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
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

  // Check for AdBlocker blocking Google Script
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
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#050505] p-4 sm:p-6 lg:p-8">
      {/* Card Container */}
      <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-[#0f111a] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-5/12 lg:w-1/2 relative">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1514474959185-1472d4c4e0d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Focus and productivity"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center min-h-[600px]">
          {/* Close Button */}
          <Link to="/" className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors bg-[#1a1d27]/50 hover:bg-[#1a1d27] p-2 rounded-md">
            <X className="h-4 w-4" />
          </Link>

          <div className="w-full max-w-[400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Log in</h1>
              <p className="text-sm text-slate-400">
                New user? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Register Now</Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <div className="mb-6 flex justify-center">
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
                shape="rectangular"
                width="336"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#2a2d3a]"></div>
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-[#2a2d3a]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Username or Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Username or Email"
                  className="h-11 bg-[#1a1d27] border-[#2a2d3a] text-white placeholder:text-slate-500 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAnyLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="h-11 bg-[#1a1d27] border-[#2a2d3a] text-white placeholder:text-slate-500 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAnyLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
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

              {/* Forgot */}
              <div className="pt-1">
                <a href="#" className="text-sm text-[#5b52ff] hover:text-indigo-400 font-medium">
                  Forgot password
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full h-11 mt-4 bg-[#5b52ff] hover:bg-[#4f46e5] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAnyLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              {/* Guest Login */}
              <button
                type="button"
                className="w-full h-11 border border-[#2a2d3a] text-slate-300 font-medium rounded-md hover:bg-[#1a1d27] transition-colors cursor-pointer"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await loginAsGuest();
                    navigate('/dashboard');
                  } catch {
                    // Error is already toasted in loginAsGuest
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isAnyLoading}
              >
                Continue as Guest
              </button>
            </form>

            {/* Bottom Text */}
            <p className="text-center text-xs text-slate-500 mt-8">
              By creating this account, you agree to our{' '}
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a> &{' '}
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
