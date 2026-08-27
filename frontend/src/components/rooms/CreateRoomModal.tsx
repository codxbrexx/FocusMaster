import { useState } from 'react';
import { X, Sparkles, Users, Music, Layers, ArrowRight, VolumeX, Headphones, CloudRain, Brain, Coffee, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoomStore } from '@/store/useRoomStore';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMBIENT_OPTIONS = [
  { id: 'none', label: 'No Sound', icon: VolumeX },
  { id: 'lofi', label: 'Lofi Beats', icon: Headphones },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'binaural', label: 'Binaural', icon: Brain },
  { id: 'cafe', label: 'Cozy Cafe', icon: Coffee },
  { id: 'fireplace', label: 'Fireplace', icon: Flame },
];

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const { createRoom, isLoading } = useRoomStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stream, setStream] = useState('all');
  const [maxParticipants, setMaxParticipants] = useState('25');
  const [ambientPreset, setAmbientPreset] = useState('none');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createRoom({
        name: name.trim(),
        description: description.trim(),
        stream: stream === 'all' ? null : stream,
        maxParticipants: parseInt(maxParticipants, 10),
        ambientPreset: ambientPreset as any,
      });
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-primary/20 font-sans text-foreground">
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 w-full max-w-lg p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Create Focus Room
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Host a synchronized co-working room for your stream with live timer and ambient audio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Room Title *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Engineering Grind"
              className="h-11 bg-muted/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card rounded-xl text-sm px-4"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Description (Optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 25-min silent Pomodoro focus sessions"
              className="h-11 bg-muted/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card rounded-xl text-sm px-4"
            />
          </div>

          {/* Stream & Capacity Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                Study Stream
              </label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger className="h-11 bg-muted/40 border-border/50 text-foreground rounded-xl text-sm focus:ring-0 focus:border-primary">
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 text-foreground rounded-xl">
                  <SelectItem value="all">All Streams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="competitive">Competitive Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                Max Capacity
              </label>
              <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                <SelectTrigger className="h-11 bg-muted/40 border-border/50 text-foreground rounded-xl text-sm focus:ring-0 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 text-foreground rounded-xl">
                  <SelectItem value="10">10 Co-workers</SelectItem>
                  <SelectItem value="25">25 Co-workers</SelectItem>
                  <SelectItem value="50">50 Co-workers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ambient Sound Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-muted-foreground" />
              Ambient Audio Soundscape
            </label>

            <div className="grid grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAmbientPreset(opt.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      ambientPreset === opt.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                        : 'bg-muted/40 border-border/50 text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-medium leading-none">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl bg-card hover:bg-muted/50 text-foreground text-xs font-medium border border-border/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                'Creating Room...'
              ) : (
                <>
                  Create Room <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
