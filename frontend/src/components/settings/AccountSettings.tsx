import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AccountSettings = () => {

    // Function to handle stats reset
    const handleResetStats = async () => {
        try {
            await api.delete('/auth/profile/stats');
            toast.success("Statistics reset successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to reset statistics");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Header */}
            <div className="space-y-2 px-6">
                <h2 className="text-xl font-semibold tracking-tight">Account Management</h2>
                <p className="text-sm text-muted-foreground">
                    Control your account data, privacy, and existence on FocusMaster.
                </p>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 p-4">
                <div className="flex items-center gap-2 px-1">
                    <AlertTriangle className="w-5 h-5 text-destructive/80" />
                    <h3 className="text-lg font-semibold text-foreground/90">Danger Zone</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Reset Stats Card */}
                    <Card className="border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors cursor-default">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <RefreshCw className="w-4 h-4" />
                                Reset Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This will permanently delete your focus history, total time, points, and streaks.
                                Your account identity and settings will remain intact.
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full border-orange-500/30 text-orange-600 hover:bg-orange-500 hover:text-white dark:text-orange-400 dark:hover:text-white">
                                        Reset Stats
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reset all statistics?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action is irreversible. All your progress (streaks, points, history) will be wiped clean.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleResetStats} className="bg-orange-500 hover:bg-orange-600 text-white">
                                            Yes, I understand
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>

                    {/* Delete Account Card */}
                    <Card className="border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-default">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2 text-destructive">
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This will permanently delete your account, session history, and all personal data.
                                This action cannot be undone.
                            </p>
                            <DeleteAccountDialog />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const DeleteAccountDialog = () => {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await api.delete('/auth/profile');
            toast.success("Account deleted successfully");
            logout();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete account");
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full border border-transparent hover:border-white/40">
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">⚠️ Delete Account</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground/80">
                        Are you absolutely sure you want to delete your account? <br /><br />
                        This will:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground text-sm">
                            <li>Permanently remove your personal data.</li>
                            <li>Delete your focus history and stats.</li>
                            <li>Cancel any active subscriptions.</li>
                        </ul>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        {isLoading ? "Deleting..." : "Yes, Delete Everything"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
