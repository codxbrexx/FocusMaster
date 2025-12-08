
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';

interface MoodSelectionModalProps {
    show: boolean;
    onSelect: (m: string) => void;
}

export function MoodSelectionModal({ show, onSelect }: MoodSelectionModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <Card className="w-full max-w-md border-primary/20 shadow-2xl bg-card">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Session Complete!</CardTitle>
                                <p className="text-muted-foreground text-sm">How focused did you feel?</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'great', emoji: '🔥', label: 'On Fire' },
                                        { id: 'good', emoji: '🙂', label: 'Good' },
                                        { id: 'distracted', emoji: '😵‍💫', label: 'Distracted' },
                                        { id: 'tired', emoji: '😴', label: 'Tired' },
                                    ].map((m) => (
                                        <Button
                                            key={m.id}
                                            variant="outline"
                                            className="h-24 flex flex-col gap-2"
                                            onClick={() => onSelect(m.id)}
                                        >
                                            <span className="text-3xl">{m.emoji}</span>
                                            <span className="text-sm">{m.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
