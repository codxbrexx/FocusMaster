import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoomStore } from '@/store/useRoomStore';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Create Live Focus Room
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Room Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Engineering Grind"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description (Optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 25-min silent Pomodoro sessions"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Study Stream
              </label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="competitive">Competitive Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Max Users
              </label>
              <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Users</SelectItem>
                  <SelectItem value="25">25 Users</SelectItem>
                  <SelectItem value="50">50 Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ambient Audio Preset
            </label>
            <Select value={ambientPreset} onValueChange={setAmbientPreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Audio</SelectItem>
                <SelectItem value="lofi">🎵 Lofi Chill Beats</SelectItem>
                <SelectItem value="rain">🌧️ Heavy Rain</SelectItem>
                <SelectItem value="binaural">🧠 Binaural Focus Waves</SelectItem>
                <SelectItem value="cafe">☕ Cozy Cafe</SelectItem>
                <SelectItem value="fireplace">🔥 Warm Fireplace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
