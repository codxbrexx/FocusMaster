import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

export const AccountSettings = () => {
  // Function to handle stats reset
  const handleResetStats = async () => {
    try {
      await api.delete('/auth/profile/stats');
      toast.success('Statistics reset successfully');
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to reset statistics');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="px-6">
        <h2 className="text-xl font-semibold tracking-tight">Account Management</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account data and presence.</p>
      </div>

      <div className="bg-card/50 backdrop-blur-sm border rounded-xl overflow-hidden divide-y divide-border/50">
        {/* Header for the section */}
        <div className="p-6 bg-muted/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Danger Zone
          </h3>
        </div>

        {/* Row 1: Reset Statistics */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <RefreshCw className="w-4 h-4 text-orange-500" />
              <span>Reset Statistics</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Permanently wipe all your focus history, points, and streaks. This action cannot be
              undone.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 hover:text-orange-700 hover:bg-orange-50 border "
              >
                Reset Stats
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all statistics?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible. All your progress (streaks, points, history) will be
                  wiped clean.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetStats}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Yes, Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Row 2: Delete Account */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-destructive/5 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Trash2 className="w-4 h-4 text-destructive text-red-500" />
              <span>Delete Account</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Permanently remove your account and all associated data. This will cancel your
              sessions and remove you from our systems.
            </p>
          </div>
          <div className="shrink-0 hover:bg-red-500/70 rounded-lg flex items-center transition-all duration-200">
            <DeleteAccountDialog />
          </div>
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
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="shrink-0 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 transition-all"
        >
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">⚠️ Delete Account</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground/80">
            Are you absolutely sure you want to delete your account? <br />
            <br />
            This will:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground text-sm">
              <li>Permanently remove your personal data.</li>
              <li>Delete your focus history and stats.</li>
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
            {isLoading ? 'Deleting...' : 'Yes, Delete Everything'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
