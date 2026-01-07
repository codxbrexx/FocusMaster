import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bug, Loader2, Sparkles, AlertCircle, Laptop, Mail, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ReportBugDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('bug');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) {
            toast.error('Please describe the issue');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/feedback', {
                message,
                category,
                email,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    screenSize: `${window.innerWidth}x${window.innerHeight}`
                }
            });
            toast.success('Thanks for your feedback! We will look into it.');
            setOpen(false);
            setMessage('');
            setCategory('bug');
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 transition-all duration-300 group shadow-sm hover:shadow-red-500/20"
                    title="Report Information"
                >
                    <Bug className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="text-[11px] font-medium hidden sm:inline-block">Report Issue</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="flex flex-row items-center gap-4 space-y-0 p-6 border-b border-white/5 bg-white/5">
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 shadow-inner">
                        <Bug className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-semibold tracking-tight text-white/90">Report an Issue</DialogTitle>
                        <DialogDescription className="text-sm text-white/50">
                            Help us improve FocusMaster by sharing your feedback or reporting bugs.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Category Selection */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase text-white/40 tracking-wider pl-1">Type of Issue</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white/90 focus:ring-red-500/50 transition-all hover:bg-white/10">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white/90">
                                <SelectItem value="bug" className="focus:bg-red-500/20 focus:text-red-400">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span>Bug Report</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="feature" className="focus:bg-purple-500/20 focus:text-purple-400">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <span>Feature Request</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="other" className="focus:bg-blue-500/20 focus:text-blue-400">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                        <span>Other Inquiry</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Message Input */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase text-white/40 tracking-wider pl-1">Description</Label>
                        <Textarea
                            placeholder={category === 'feature'
                                ? "I would love to see a feature that..."
                                : "Describe what happened, what you expected, and steps to reproduce..."}
                            className="min-h-[120px] bg-white/5 border-white/10 text-white/90 placeholder:text-white/20 focus:ring-red-500/50 resize-none p-4 leading-relaxed hover:bg-white/10 transition-colors"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase text-white/40 tracking-wider pl-1 flex justify-between">
                            Your Email <span className="text-white/20 font-normal normal-case">(Optional, for follow-up)</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-11 bg-white/5 border-white/10 text-white/90 placeholder:text-white/20 focus:ring-red-500/50 hover:bg-white/10 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* System Info (Implicit) */}
                    <div className="rounded-lg bg-white/5 border border-white/5 p-3 flex items-start gap-3">
                        <Laptop className="w-4 h-4 text-white/40 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-white/70">System Information will be included</p>
                            <p className="text-[10px] text-white/30">
                                Browser: {navigator.userAgent.split(')')[0]}) • Screen: {window.innerWidth}x{window.innerHeight}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading} className="text-white/60 hover:text-white hover:bg-white/10">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "min-w-[140px] transition-all duration-300 shadow-lg text-white font-medium",
                                category === 'feature'
                                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                                    : "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    Submit {category === 'feature' ? 'idea' : 'Report'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
