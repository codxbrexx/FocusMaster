import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// 1. Define a strict validation schema
const profileSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) return false;
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    {
      message: 'Current password is required to set a new one',
      path: ['currentPassword'],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileSettings = () => {
  const { user, refreshUser } = useAuth(); // Assume refreshUser updates the global state

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedEmail = watch('email');
  const isEmailChanged = watchedEmail !== user?.email;

  // Sync form if user data loads late
  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  // Handle Name and Password updates
  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      const payload: any = { name: data.name };
      if (data.newPassword) payload.password = data.newPassword;
      if (data.currentPassword) payload.currentPassword = data.currentPassword;

      await api.put('/auth/profile', payload);
      toast.success('Profile updated successfully');

      if (refreshUser) await refreshUser();

      // Reset password fields only
      reset({ ...data, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await api.post('/auth/otp/send', { newEmail: watchedEmail });
      setIsOtpSent(true);
      toast.success(`Verification code sent to ${watchedEmail}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      await api.put('/auth/otp/verify', { otp });
      toast.success('Email updated successfully');
      if (refreshUser) await refreshUser();
      setIsOtpSent(false);
    } catch {
      toast.error('Invalid code. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24 pt-4">
      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-12">
        {/* --- Personal Information --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="border-b border-border/50 pb-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Personal Information
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Update your basic profile details.</p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
                Full Name
              </Label>
              <div className="relative group">
                <Input
                  id="name"
                  {...register('name')}
                  className={cn(
                    'h-10 bg-background border-input transition-all duration-200 focus:ring-1 focus:ring-primary/20',
                    errors.name && 'border-destructive focus:ring-destructive/20'
                  )}
                  placeholder="e.g. Jane Doe"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Email Address
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isOtpSent}
                  className={cn(
                    'h-10 bg-background border-input transition-all duration-200 focus:ring-1 focus:ring-primary/20',
                    isEmailChanged && 'border-amber-500/50'
                  )}
                  placeholder="name@example.com"
                />
              </div>

              {isEmailChanged && !isOtpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200/50"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 mr-2" />
                    )}
                    Verify New Email
                  </Button>
                </motion.div>
              )}

              {isOtpSent && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3"
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Enter Verification Code
                  </p>
                  <Input
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center tracking-[0.5em] font-mono text-lg h-11 bg-background"
                    placeholder="000000"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsOtpSent(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || otp.length < 6}
                    >
                      {verifyingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* --- Security --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="border-b border-border/50 pb-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your password and authentication settings.
            </p>
          </div>

          <div className="grid gap-5 bg-muted/20 p-5 rounded-xl border border-border/40">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Current Password
              </Label>
              <Input
                type="password"
                {...register('currentPassword')}
                className="h-10 bg-background"
                placeholder="Required for changes"
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    className="h-10 bg-background pr-10"
                    placeholder="Min. 6 chars"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  {...register('confirmPassword')}
                  className="h-10 bg-background"
                  placeholder="Re-enter new password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Sticky Footer --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="sticky bottom-4 pt-4"
        >
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border/60 shadow-lg shadow-black/5 ring-1 ring-black/5">
            <div className="flex items-center gap-2.5 px-2">
              {isDirty ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-sm font-medium text-amber-600">Unsaved changes</span>
                </>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">Up to date</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Discard
                </Button>
              )}
              <Button
                disabled={isSubmitting || !isDirty}
                type="submit"
                size="sm"
                className="min-w-[100px] font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};
