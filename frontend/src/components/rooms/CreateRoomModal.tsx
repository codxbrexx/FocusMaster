import { useState } from 'react';
import { X, Users, Layers, ArrowRight, VolumeX, Headphones, CloudRain, Brain, Coffee, Flame } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-lg p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Create Focus Room
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Host a synchronized co-working room for your stream with live timer and ambient audio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Room Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Engineering Grind"
              className="h-10 bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:border-[#6E36E4] focus:bg-white rounded-xl text-xs px-3.5 w-full font-medium"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 25-min silent Pomodoro focus sessions"
              className="h-10 bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:border-[#6E36E4] focus:bg-white rounded-xl text-xs px-3.5 w-full font-medium"
            />
          </div>

          {/* Stream & Capacity Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Study Stream
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="h-10 bg-slate-50 border border-slate-200/80 text-slate-900 rounded-xl text-xs px-3 w-full font-medium focus:outline-none focus:border-[#6E36E4]"
              >
                <option value="all">All Streams</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
                <option value="commerce">Commerce</option>
                <option value="competitive">Competitive Exams</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Max Capacity
              </label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="h-10 bg-slate-50 border border-slate-200/80 text-slate-900 rounded-xl text-xs px-3 w-full font-medium focus:outline-none focus:border-[#6E36E4]"
              >
                <option value="10">10 Co-workers</option>
                <option value="25">25 Co-workers</option>
                <option value="50">50 Co-workers</option>
              </select>
            </div>
          </div>

          {/* Ambient Sound Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-slate-500" />
              Default Soundscape
            </label>

            <div className="grid grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = ambientPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAmbientPreset(opt.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#6E36E4] bg-purple-50 text-[#6E36E4] shadow-2xs font-bold'
                        : 'border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Creating Room...' : 'Launch Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
