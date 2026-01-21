import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

export const EditProfilePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="max-w-4xl mx-auto py-10 px-6"
    >
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-10 shadow-sm">
        <ProfileSettings />
      </div>
    </motion.div>
  );
};
