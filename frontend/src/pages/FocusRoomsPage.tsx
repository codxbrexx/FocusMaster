import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Sparkles, Search, Zap, Globe, Laptop, Stethoscope, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoomCard } from '@/components/rooms/RoomCard';
import { CreateRoomModal } from '@/components/rooms/CreateRoomModal';
import { useRoomStore } from '@/store/useRoomStore';

export function FocusRoomsPage() {
  const navigate = useNavigate();
  const { rooms, fetchRooms, isLoading, joinRoom } = useRoomStore();

  const [activeStream, setActiveStream] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRooms(activeStream);
  }, [activeStream, fetchRooms]);

  const handleJoin = async (roomId: string) => {
    await joinRoom(roomId);
    navigate(`/rooms/${roomId}`);
  };

  const streams = [
    { id: 'all', label: 'All Rooms', icon: Globe },
    { id: 'engineering', label: 'Engineering', icon: Laptop },
    { id: 'medical', label: 'Medical', icon: Stethoscope },
    { id: 'commerce', label: 'Commerce', icon: TrendingUp },
    { id: 'competitive', label: 'Competitive', icon: Trophy },
  ];

  const filteredRooms = rooms.filter((room) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      room.name.toLowerCase().includes(q) ||
      (room.description && room.description.toLowerCase().includes(q)) ||
      (room.host?.name && room.host.name.toLowerCase().includes(q))
    );
  });

  const totalParticipants = rooms.reduce((acc, r) => acc + (r.participants?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] p-6 sm:p-8 space-y-8 max-w-7xl mx-auto pb-24 font-sans text-[#191918]">
      {/* Co-Working Hero Header Banner - Premium Light Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E6E4DF] p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#EFECE6] to-transparent rounded-full blur-3xl pointer-events-none opacity-70" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#F4F4F0] text-[#191918] text-xs font-semibold uppercase tracking-wider border border-[#E6E4DF] flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#191918]" />
                Live Co-Working Hub
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200/80">
                <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
                +15 XP Bonus
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-normal tracking-tight text-[#191918] leading-tight">
              Synchronized Focus Rooms
            </h1>
            <p className="text-sm text-[#666560] leading-relaxed">
              Study alongside peers in real-time Pomodoro rooms. Synchronized focus timers prevent drift,
              built-in ambient audio keeps you in the zone, and group completion yields bonus XP.
            </p>

            {/* Live Stats Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-[#666560]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#191918] font-semibold">{rooms.length} Active Rooms</span>
              </div>
              <div className="w-px h-4 bg-[#E6E4DF]" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#191918]" />
                <span className="text-[#191918] font-semibold">{totalParticipants} Online Co-Workers</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="gap-2 font-medium bg-[#191918] hover:bg-[#333330] text-white rounded-2xl px-6 py-6 text-sm shrink-0 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Create Focus Room
          </Button>
        </div>
      </div>

      {/* Controls Bar: Search & Stream Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Stream Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {streams.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStream === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStream(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#191918] text-white shadow-sm font-semibold'
                    : 'bg-white text-[#666560] border border-[#E6E4DF] hover:bg-[#F4F4F0] hover:text-[#191918]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9C9A92]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms or hosts..."
            className="pl-9 text-xs rounded-xl bg-white border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:border-[#191918] focus:bg-white focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 bg-white border border-[#E6E4DF] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E6E4DF] rounded-3xl p-8 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F4F0] text-[#191918] flex items-center justify-center mx-auto border border-[#E6E4DF]">
            <Sparkles className="w-7 h-7 text-[#191918]" />
          </div>
          <h3 className="text-xl font-serif font-normal text-[#191918]">
            {searchQuery ? 'No Matching Focus Rooms' : 'No Active Focus Rooms Found'}
          </h3>
          <p className="text-sm text-[#666560] max-w-md mx-auto">
            {searchQuery
              ? `No rooms matched your search for "${searchQuery}". Try a different keyword.`
              : 'Be the first to start a room for your study stream and invite peers to study together!'}
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 font-medium bg-[#191918] hover:bg-[#333330] text-white rounded-xl px-6">
            <Plus className="w-4 h-4" />
            Create First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} onJoin={handleJoin} />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
