import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Mail, Lock, Save, Shield, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

// 1. Define a strict validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, {
  message: "Current password is required to set a new one",
  path: ["currentPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileSettings = () => {
  const { user, refreshUser } = useAuth(); // Assume refreshUser updates the global state
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const watchedEmail = watch("email");
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
      toast.success("Profile updated successfully");
      
      if (refreshUser) await refreshUser();
      
      // Reset password fields only
      reset({ ...data, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await api.post('/auth/otp/send', { newEmail: watchedEmail });
      setIsOtpSent(true);
      toast.success(`Verification code sent to ${watchedEmail}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      await api.put('/auth/otp/verify', { otp });
      toast.success("Email updated successfully");
      if (refreshUser) await refreshUser();
      setIsOtpSent(false);
    } catch (error: any) {
      toast.error("Invalid code. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary shadow-inner">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your credentials and profile preferences</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
        {/* Account Details */}
        <Card className="overflow-hidden border-border/50 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={cn("bg-background", errors.name && "border-destructive")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isOtpSent}
                  className={cn("pl-10", isEmailChanged && "border-orange-400 ring-orange-400/20")}
                />
              </div>
              
              {/* OTP Flow UI */}
              {isEmailChanged && !isOtpSent && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                  Verify New Email
                </Button>
              )}

              {isOtpSent && (
                <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in zoom-in-95">
                  <Label className="text-xs uppercase tracking-wider font-bold">Verification Code</Label>
                  <Input 
                    maxLength={6} 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center tracking-[0.5em] font-mono text-lg h-12"
                    placeholder="000000"
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOtpSent(false)}>Cancel</Button>
                    <Button type="button" className="flex-1" onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length < 6}>
                      {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Security & Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="password-change" className="border-none">
                <AccordionTrigger className="px-4 bg-background border rounded-lg hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span>Update Password</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-6 px-1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Current Password</Label>
                      <Input type="password" {...register('currentPassword')} placeholder="Required for changes" />
                      {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} {...register('newPassword')} />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" {...register('confirmPassword')} />
                      {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-6 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {isDirty ? "You have unsaved changes" : "Account is up to date"}
            </p>
            <Button disabled={isSubmitting || !isDirty} type="submit" className="min-w-[140px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};