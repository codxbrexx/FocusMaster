import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Mail, Lock, Save, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      <div className="grid gap-8">
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-8">

          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
              <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <Input
                      id="name"
                      {...register('name')}
                      className={cn(
                        "pl-10 h-11 bg-background/50 transition-all duration-200 focus:bg-background border-border/50 focus:border-primary/50",
                        errors.name && "border-destructive focus:border-destructive"
                      )}
                      placeholder="Enter your name"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive font-medium ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      disabled={isOtpSent}
                      className={cn(
                        "pl-10 h-11 bg-background/50 transition-all duration-200 focus:bg-background border-border/50 focus:border-primary/50",
                        isEmailChanged && "border-amber-500/50 ring-2 ring-amber-500/10"
                      )}
                    />
                  </div>

                  {isEmailChanged && !isOtpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 h-9 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200/50"
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
                      >
                        {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                        Verify Email Change
                      </Button>
                    </motion.div>
                  )}

                  {isOtpSent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3"
                    >
                      <Label className="text-xs uppercase tracking-wider font-bold text-primary/80">Verification Code</Label>
                      <Input
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center tracking-[0.5em] font-mono text-lg h-12 bg-background shadow-inner border-primary/20"
                        placeholder="000000"
                      />
                      <div className="flex gap-2 pt-1">
                        <Button type="button" variant="ghost" className="flex-1 h-9" onClick={() => setIsOtpSent(false)}>Cancel</Button>
                        <Button type="button" className="flex-1 h-9" onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length < 6}>
                          {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky bottom-4 z-20"
          >
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
              <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Security & Password
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="password-change" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/30 transition-colors data-[state=open]:bg-muted/30">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-foreground">Change Password</span>
                          <span className="text-xs text-muted-foreground font-normal">Update your account password regularly</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="grid gap-5 pt-2 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-2">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground">Current Password</Label>
                          <Input
                            type="password"
                            {...register('currentPassword')}
                            className="bg-primary/50"
                            placeholder="Enter current password to authorize changes"
                          />
                          {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground">New Password</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              {...register('newPassword')}
                              className="bg-primary/50 pr-10"
                              placeholder="Min. 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground">Confirm New Password</Label>
                          <Input
                            type="password"
                            {...register('confirmPassword')}
                            className="bg-background/50"
                            placeholder="Re-enter new password"
                          />
                          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>


          {/* Sticky Action Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bottom-4 z-20"
          >
            <div className="rounded-xl border border-border/60 bg-background/80 backdrop-blur-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isDirty ? "bg-amber-500" : "bg-emerald-500")} />
                <p className="text-sm font-medium text-muted-foreground">
                  {isDirty ? 'Unsaved changes' : 'All systems normal'}
                </p>
              </div>
              <div className="flex gap-3">
                {isDirty && (
                  <Button type="button" variant="ghost" onClick={() => reset()} disabled={isSubmitting}>
                    Discard
                  </Button>
                )}
                <Button disabled={isSubmitting || !isDirty} type="submit" className="min-w-[120px] shadow-lg shadow-primary/20">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};
