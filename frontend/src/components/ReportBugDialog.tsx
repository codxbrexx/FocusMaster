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
import { Bug, Loader2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

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
            toast.success('Report submitted successfully. Thank you!');
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
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-muted-foreground/60"
                    title="Report a Bug"
                >
                    <Bug className="w-3.5 h-3.5" />
                    <span className="sr-only md:not-sr-only md:text-[10px] md:font-medium">Report Bug</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription>
                        Found a bug or have a suggestion? Let us know so we can improve FocusMaster.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bug">Bug Report</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="For follow-up..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message">Description</Label>
                        <Textarea
                            id="message"
                            placeholder="What happened? Steps to reproduce..."
                            className="min-h-[100px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                'Submit Report'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
