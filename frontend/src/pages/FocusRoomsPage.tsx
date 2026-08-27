import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Search, RefreshCw, Trophy, SlidersHorizontal, Laptop, Stethoscope, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { CreateRoomModal } from '@/components/rooms/CreateRoomModal';
import { useRoomStore } from '@/store/useRoomStore';

const STREAM_TABS = [
  { id: 'all', label: 'All Rooms', icon: SlidersHorizontal },
  { id: 'engineering', label: 'Engineering', icon: Laptop },
  { id: 'medical', label: 'Medical', icon: Stethoscope },
  { id: 'commerce', label: 'Commerce', icon: TrendingUp },
  { id: 'competitive', label: 'Competitive', icon: Trophy },
];

export function FocusRoomsPage() {
  const { rooms, fetchRooms, isLoading, error } = useRoomStore();
  const [selectedStream, setSelectedStream] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = rooms.filter((r) => {
    const matchesStream =
      selectedStream === 'all' || (r.stream && r.stream.toLowerCase() === selectedStream.toLowerCase());
    const hostName = r.host?.name || '';
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hostName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  const activeRoomsCount = rooms.length;
  const activeFocusersCount = rooms.reduce((acc, r) => acc + (r.participants?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16 px-1 sm:px-0 font-sans text-slate-900">
      {/* Hero Header Card with Create Room Button at the Bottom */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl relative z-10 w-full">
          {/* Main Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Synchronized Focus Rooms
          </h1>

          {/* Description */}
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Study alongside peers in real-time Pomodoro rooms with synchronized timers, ambient audio, and bonus XP rewards.
          </p>

          {/* Bottom Actions Row (Stats + Create Room Button at bottom) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-[#6E36E4]">
                <span className="w-2 h-2 rounded-full bg-[#6E36E4]" />
                <span>{activeRoomsCount} Active Rooms</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeFocusersCount} Online Co-Workers</span>
              </div>
            </div>

            {/* Create Room Button positioned at the bottom */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-semibold rounded-xl px-4 py-2 text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Focus Room</span>
            </button>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="relative z-10 shrink-0 hidden md:block">
          <img
            src="/room-ui.png"
            alt="Room Elements"
            className="w-36 h-auto object-contain max-h-32"
          />
        </div>
      </div>

      {/* Stream Tabs & Search Bar Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Stream Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STREAM_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStream(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedStream === tab.id
                    ? 'bg-[#6E36E4] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms or hosts..."
              className="bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-3.5 py-2 text-xs w-full focus:outline-none focus:border-[#6E36E4] transition-all shadow-2xs font-medium"
            />
          </div>

          <button
            onClick={() => fetchRooms()}
            title="Refresh Rooms"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {error ? (
        <div className="p-10 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2 max-w-md mx-auto">
          <p className="text-xs font-semibold text-red-600">{error}</p>
          <button
            onClick={() => fetchRooms()}
            className="px-3.5 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Retry Loading
          </button>
        </div>
      ) : isLoading && rooms.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 max-w-md mx-auto"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6E36E4] flex items-center justify-center mx-auto">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No rooms match your filter</h3>
            <p className="text-xs text-slate-500 font-medium">
              Create a new focus room to start co-working with fellow students!
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#6E36E4] text-white hover:bg-[#5B2AC6] font-semibold px-4 py-2 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Room</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onJoin={(roomId) => (window.location.href = `/rooms/${roomId}`)}
            />
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
