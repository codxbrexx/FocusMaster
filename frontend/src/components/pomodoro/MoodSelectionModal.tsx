import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Flame, Smile, Frown, Coffee } from 'lucide-react';

interface MoodSelectionModalProps {
    show: boolean;
    onSelect: (m: string) => void;
}

export function MoodSelectionModal({ show, onSelect }: MoodSelectionModalProps) {
    const moods = [
        { id: 'great', label: 'On Fire', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'hover:border-orange-500/50' },
        { id: 'good', label: 'Good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50' },
        { id: 'distracted', label: 'Distracted', icon: Frown, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50' },
        { id: 'tired', label: 'Tired', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50' },
    ];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-lg"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 to-card/40 backdrop-blur-2xl shadow-2xl">
                            {/* Ambient background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                            <div className="p-8 text-center relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5"
                                >
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </motion.div>

                                <h2 className="text-2xl font-bold tracking-tight mb-2">Session Complete!</h2>
                                <p className="text-muted-foreground mb-8">How was your focus during this session?</p>

                                <div className="grid grid-cols-2 gap-4">
                                    {moods.map((m, index) => (
                                        <motion.button
                                            key={m.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.05 }}
                                            onClick={() => onSelect(m.id)}
                                            className={`
                                                relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl 
                                                border border-white/5 bg-white/5 hover:bg-white/10 ${m.border}
                                                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                            `}
                                        >
                                            <div className={`p-3 rounded-xl ${m.bg} group-hover:scale-110 transition-transform duration-300`}>
                                                <m.icon className={`w-6 h-6 ${m.color}`} />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {m.label}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
