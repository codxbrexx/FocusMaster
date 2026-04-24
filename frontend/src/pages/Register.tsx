import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { User, Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [error, setError] = useState('');
  const { register, loginAsGuest, logout, googleLogin } = useAuth();
  const navigate = useNavigate();

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

    if (!name || !email || !password || !confirmPassword) {
      const missingFields = [];
      if (!name) missingFields.push('Name');
      if (!email) missingFields.push('Email');
      if (!password) missingFields.push('Password');
      if (!confirmPassword) missingFields.push('Confirm Password');

      const errorMsg = `Please fill in all fields: ${missingFields.join(', ')}`;
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      logout();
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="flex h-[100dvh] w-full bg-black overflow-hidden">
      {/* Left side - Image (hidden on mobile) */}
      <div className="w-full hidden md:flex items-center justify-center bg-gray-50">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1776083760576-b238808ec1b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Get started with FocusMaster"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full flex flex-col items-center justify-center px-6 md:px-0 bg-dot-pattern">
        <div className="w-full md:w-[420px] max-w-md p-8 rounded-xl bg-black/80 backdrop-blur-lg ">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">Create an Account</h1>
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
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  googleLogin(credentialResponse.credential);
                  navigate('/dashboard');
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
            <span className="text-xs text-slate-500">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="pl-10 h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordsMatch && (
                <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                  <CheckCircle2 className="h-3 w-3" />
                  Passwords match
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full h-11 mt-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Start as Guest Button */}
            <button
              type="button"
              className="w-full h-11 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                loginAsGuest();
                navigate('/');
              }}
              disabled={isLoading}
            >
              Start as Guest
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
