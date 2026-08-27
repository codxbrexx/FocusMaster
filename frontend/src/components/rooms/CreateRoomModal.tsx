import { useState } from 'react';
import { X, Sparkles, Users, Music, Layers, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoomStore } from '@/store/useRoomStore';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMBIENT_OPTIONS = [
  { id: 'none', label: 'No Sound', icon: '🔇' },
  { id: 'lofi', label: 'Lofi Beats', icon: '🎧' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'binaural', label: 'Binaural', icon: '🧠' },
  { id: 'cafe', label: 'Cozy Cafe', icon: '☕' },
  { id: 'fireplace', label: 'Fireplace', icon: '🔥' },
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
    <div className="fixed inset-0 z-50 bg-[#191918]/40 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-indigo-100 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#E6E4DF] w-full max-w-lg p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E6E4DF] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#F4F4F0] border border-[#E6E4DF] text-[#191918]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-serif font-normal text-[#191918]">
                Create Focus Room
              </h2>
            </div>
            <p className="text-xs text-[#666560]">
              Host a synchronized co-working room for your stream with live timer and ambient audio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9C9A92] hover:text-[#191918] hover:bg-[#F4F4F0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#191918]">
              Room Title *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Engineering Grind"
              className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:border-[#191918] focus:bg-white focus-visible:ring-0 rounded-xl text-sm px-4"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#191918]">
              Description (Optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 25-min silent Pomodoro focus sessions"
              className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:border-[#191918] focus:bg-white focus-visible:ring-0 rounded-xl text-sm px-4"
            />
          </div>

          {/* Stream & Capacity Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#191918] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#666560]" />
                Study Stream
              </label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] rounded-xl text-sm focus:ring-0 focus:border-[#191918]">
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E6E4DF] text-[#191918] rounded-xl">
                  <SelectItem value="all">🌐 All Streams</SelectItem>
                  <SelectItem value="engineering">💻 Engineering</SelectItem>
                  <SelectItem value="medical">🩺 Medical</SelectItem>
                  <SelectItem value="commerce">📈 Commerce</SelectItem>
                  <SelectItem value="competitive">🏆 Competitive Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#191918] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#666560]" />
                Max Capacity
              </label>
              <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                <SelectTrigger className="h-11 bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] rounded-xl text-sm focus:ring-0 focus:border-[#191918]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E6E4DF] text-[#191918] rounded-xl">
                  <SelectItem value="10">10 Co-workers</SelectItem>
                  <SelectItem value="25">25 Co-workers</SelectItem>
                  <SelectItem value="50">50 Co-workers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ambient Sound Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#191918] flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#666560]" />
              Ambient Audio Soundscape
            </label>

            <div className="grid grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAmbientPreset(opt.id)}
                  className={`p-2.5 rounded-xl text-center border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    ambientPreset === opt.id
                      ? 'bg-[#191918] text-white border-[#191918] shadow-sm font-semibold'
                      : 'bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] hover:bg-[#EFECE6]'
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-[11px] font-medium leading-none">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#E6E4DF]">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl bg-white hover:bg-[#F4F4F0] text-[#191918] text-xs font-medium border border-[#E6E4DF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="h-11 px-6 rounded-xl bg-[#191918] hover:bg-[#333330] text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
