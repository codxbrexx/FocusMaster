import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { User, Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingPage } from '../components/ui/LoadingPage';

// Password strength indicator
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'fair';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'fair';
  };

  const strength = getStrength();
  const colors = {
    weak: 'bg-red-500',
    fair: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <div className={`h-1 flex-1 rounded-full ${colors[strength]}`} />
      <span className="text-xs text-gray-500 capitalize">{strength}</span>
    </div>
  );
};

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { register, loginAsGuest, googleLogin } = useAuth();
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

    if (step === 1) {
      if (!name || !email) {
        const missingFields = [];
        if (!name) missingFields.push('Name');
        if (!email) missingFields.push('Email');

        const errorMsg = `Please fill in: ${missingFields.join(', ')}`;
        toast.error(errorMsg);
        setError(errorMsg);
        return;
      }
      
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error('Please enter a valid email');
        setError('Please enter a valid email');
        return;
      }

      setStep(2);
      return;
    }

    if (!password || !confirmPassword) {
      const missingFields = [];
      if (!password) missingFields.push('Password');
      if (!confirmPassword) missingFields.push('Confirm Password');

      const errorMsg = `Please fill in: ${missingFields.join(', ')}`;
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      toast.error('Password must include at least one letter');
      setError('Password must include at least one letter');
      return;
    }

    if (!/\d/.test(password)) {
      toast.error('Password must include at least one number');
      setError('Password must include at least one number');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

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
            src="/auth_image.png"
            alt="Get started with FocusMaster"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center min-h-[600px] overflow-y-auto">
          {/* Close Button */}
          <Link to="/" className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors bg-[#1a1d27]/50 hover:bg-[#1a1d27] p-2 rounded-md z-10">
            <X className="h-4 w-4" />
          </Link>

          <div className="w-full max-w-[400px] mx-auto py-4">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
              <p className="text-sm text-slate-400">
                Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
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
                      setError('Google sign-up failed. Please try again.');
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
              {step === 1 && (
                <>
                  {/* Full Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      className="h-11 bg-[#1a1d27] border-[#2a2d3a] text-white placeholder:text-slate-500 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isAnyLoading}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-11 bg-[#1a1d27] border-[#2a2d3a] text-white placeholder:text-slate-500 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isAnyLoading}
                    />
                  </div>

                  {/* Next Button */}
                  <button
                    type="submit"
                    className="w-full h-11 mt-6 bg-[#5b52ff] hover:bg-[#4f46e5] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAnyLoading}
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                  
                  {/* Start as Guest Button */}
                  <button
                    type="button"
                    className="w-full h-11 border border-[#2a2d3a] text-slate-300 font-medium rounded-md hover:bg-[#1a1d27] transition-colors cursor-pointer"
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
                    Start as Guest
                  </button>
                </>
              )}

              {step === 2 && (
                <>
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
                    {password && <PasswordStrengthIndicator password={password} />}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        placeholder="Confirm password"
                        className="h-11 bg-[#1a1d27] border-[#2a2d3a] text-white placeholder:text-slate-500 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isAnyLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                        tabIndex={-1}
                        disabled={isAnyLoading}
                      >
                        {isConfirmPasswordVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordsMatch && (
                      <div className="flex items-center gap-2 text-xs text-green-500 mt-2">
                        <CheckCircle2 className="h-3 w-3" />
                        Passwords match
                      </div>
                    )}
                  </div>

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    className="w-full h-11 mt-6 bg-[#5b52ff] hover:bg-[#4f46e5] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAnyLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                  
                  {/* Back Button */}
                  <button
                    type="button"
                    className="w-full h-11 border border-[#2a2d3a] text-slate-300 font-medium rounded-md hover:bg-[#1a1d27] transition-colors cursor-pointer"
                    onClick={() => setStep(1)}
                    disabled={isAnyLoading}
                  >
                    Back
                  </button>
                </>
              )}
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
