import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Lock, Mail, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginAsGuest, googleLogin } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="flex h-[100dvh] w-full bg-gradient-to-br from-[#0a0a0a] to-[#020202]">
      {/* Left side - Image (hidden on mobile) */}
      <div className="w-full hidden md:flex items-center justify-center bg-gray-50">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1514474959185-1472d4c4e0d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Focus and productivity"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full flex flex-col items-center justify-center px-6 md:px-0">
        <div className="w-full md:w-96 max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-2">Sign in to unlock your focus.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    await googleLogin(credentialResponse.credential);
                    navigate('/dashboard');
                  } catch {
                    setError('Google login failed. Please try again.');
                  }
                }
              }}
              onError={() => {
                setError('Google Login Failed');
              }}
              theme="filled_black"
              shape="circle"
              useOneTap
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-slate-500">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 border border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-slate-600 rounded focus:ring-blue-500 accent-blue-600"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full h-11 mt-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Guest Login */}
            <button
              type="button"
              className="w-full h-11 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await loginAsGuest();
                  navigate('/dashboard');
                } catch (err) {
                  // Error is already toasted in loginAsGuest
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              Continue as Guest
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
