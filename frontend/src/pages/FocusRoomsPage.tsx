import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/rooms/RoomCard';
import { CreateRoomModal } from '@/components/rooms/CreateRoomModal';
import { useRoomStore } from '@/store/useRoomStore';

export function FocusRoomsPage() {
  const navigate = useNavigate();
  const { rooms, fetchRooms, isLoading, joinRoom } = useRoomStore();

  const [activeStream, setActiveStream] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRooms(activeStream);
  }, [activeStream, fetchRooms]);

  const handleJoin = async (roomId: string) => {
    await joinRoom(roomId);
    navigate(`/rooms/${roomId}`);
  };

  const streams = [
    { id: 'all', label: '🌐 All Rooms' },
    { id: 'engineering', label: '💻 Engineering' },
    { id: 'medical', label: '🩺 Medical' },
    { id: 'commerce', label: '📈 Commerce' },
    { id: 'competitive', label: '🏆 Competitive' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Live Co-Working Focus Rooms
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join synchronized live Pomodoro rooms, study alongside peers, and earn bonus XP together.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 font-bold shadow-md">
          <Plus className="w-4 h-4" />
          Create Focus Room
        </Button>
      </div>

      {/* Stream Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {streams.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStream(s.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
              activeStream === s.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Active Focus Rooms Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Be the first to start a room for your study stream and invite others to study together!
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 font-bold">
            <Plus className="w-4 h-4" />
            Create First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onJoin={handleJoin} />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
