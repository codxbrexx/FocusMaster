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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full  hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 transition-all duration-300 group"
                    title="Report Information"
                >
                    <Bug className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="text-[11px] font-medium hidden sm:inline-block">Report Issue</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b border-border/40">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <Bug className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl">Report an Issue</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Help us improve FocusMaster by sharing your feedback or reporting bugs.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Category Selection */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Type of Issue</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-11 bg-muted/30 border-border/50 focus:ring-primary/20 transition-all">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/80 backdrop-blur-xl border-border/50">
                                <SelectItem value="bug">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span>Bug Report</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="feature">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                        <span>Feature Request</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="other">
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
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Description</Label>
                        <Textarea
                            placeholder={category === 'feature'
                                ? "I would love to see a feature that..."
                                : "Describe what happened, what you expected, and steps to reproduce..."}
                            className="min-h-[120px] bg-muted/30 border-border/50 focus:ring-primary/20 resize-none p-4 leading-relaxed"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex justify-between">
                            Your Email <span className="text-muted-foreground/60 font-normal normal-case">(Optional, for follow-up)</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-11 bg-muted/30 border-border/50 focus:ring-primary/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* System Info (Implicit) */}
                    <div className="rounded-lg bg-muted/30 border border-border/50 p-3 flex items-start gap-3">
                        <Laptop className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-foreground/80">System Information will be included</p>
                            <p className="text-[10px] text-muted-foreground">
                                Browser: {navigator.userAgent.split(')')[0]}) • Screen: {window.innerWidth}x{window.innerHeight}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "min-w-[140px] transition-all duration-300",
                                category === 'feature' ? "bg-purple-600 hover:bg-purple-700" : ""
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
