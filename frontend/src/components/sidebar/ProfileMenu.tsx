import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    Palette,
    ChevronRight,
    Sun,
    Moon,
    Monitor,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface ProfileMenuProps {
    isOpen: boolean;
}

export const ProfileMenu = ({ isOpen }: ProfileMenuProps) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [showAppearance, setShowAppearance] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    return (
        <div ref={containerRef} className="relative mt-4 group bg-card/80">
            <div
                className={cn(
                    'flex items-center gap-3 p-3 border border-border/50 rounded-2xl transition-all duration-300 cursor-pointer relative z-[60]',
                    isOpen
                        ? 'bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 dark:to-white/[0.02] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg'
                        : 'justify-center w-full bg-transparent border-0',
                    isProfileMenuOpen && 'bg-purple-500/15 border-purple-500/20 shadow-sm'
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
            >
                <div className="relative shrink-0">
                    <img
                        src={user?.picture || "/profilelogo.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full shrink-0 border border-black/5 dark:border-white/10 object-cover shadow-sm bg-background group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 overflow-hidden min-w-0"
                        >
                            <p className="text-sm font-semibold truncate text-foreground text-left">{user?.name || 'Guest User'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">
                                    Gold
                                </span>
                                <p className="text-[10px] text-muted-foreground truncate">Level 5</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isOpen && (
                    <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        isProfileMenuOpen ? "rotate-90" : ""
                    )} />
                )}
            </div>

            {/* Profile Menu Popover */}
            <AnimatePresence>
                {isProfileMenuOpen && (
                    <div
                        className={cn(
                            "absolute z-[70]",
                            isOpen ? "bottom-full left-0 w-full mb-3" : "left-14 bottom-0 pl-2"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={cn(
                                "bg-black/45 backdrop-blur-[50px] border border-border/50 p-2 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 text-popover-foreground",
                                isOpen ? "w-full" : "w-64"
                            )}
                        >
                            {/* User Section (collapsed mode) */}
                            {!isOpen && (
                                <div className="flex items-center gap-3 p-3 mb-2 bg-muted/50 rounded-lg">
                                    <img
                                        src={user?.picture || "/profilelogo.png"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border border-border/50 object-cover"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-white text-sm truncate">{user?.name || 'Guest User'}</h4>
                                        <p className="text-xs text-white truncate">{user?.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Menu Items */}
                            <div className="space-y-0.5 mb-2">
                                <button
                                    onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md transition-colors text-left group/item"
                                >
                                    <User className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                    <span className="text-foreground">My Profile</span>
                                </button>

                                <button
                                    onClick={() => { navigate('/settings'); setIsProfileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md transition-colors text-left group/item"
                                >
                                    <Settings className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                    <span className="text-foreground">Settings</span>
                                </button>

                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => { navigate('/admin'); setIsProfileMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition-colors text-left group/item"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="font-medium">Admin Panel</span>
                                    </button>
                                )}
                            </div>

                            <div className="h-px bg-border/50 my-1 mx-2" />

                            {/* Appearance Section */}
                            <div className="px-1 py-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowAppearance(!showAppearance); }}
                                    className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Palette className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">Appearance</span>
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", showAppearance && "rotate-90")} />
                                </button>

                                <AnimatePresence>
                                    {showAppearance && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1 mx-2 mb-2 mt-1 rounded-lg">
                                                {(['light', 'dark', 'system'] as const).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={(e) => { e.stopPropagation(); setTheme(t); }}
                                                        className={cn(
                                                            "flex items-center justify-center py-1.5 rounded-md transition-all duration-200",
                                                            theme === t
                                                                ? "bg-background text-primary shadow-sm ring-1 ring-border"
                                                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                                        )}
                                                        title={t.charAt(0).toUpperCase() + t.slice(1)}
                                                    >
                                                        {t === 'light' && <Sun className="w-4 h-4" />}
                                                        {t === 'dark' && <Moon className="w-4 h-4" />}
                                                        {t === 'system' && <Monitor className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-px bg-border/50 mb-1" />

                            {/* Logout */}
                            <button
                                onClick={() => handleLogout()}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
