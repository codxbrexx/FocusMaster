import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, LogOut, Crown } from 'lucide-react';
import { RoomTimer } from '@/components/rooms/RoomTimer';
import { ParticipantList } from '@/components/rooms/ParticipantList';
import { RoomChat } from '@/components/rooms/RoomChat';
import { AmbientSoundMixer } from '@/components/rooms/AmbientSoundMixer';
import { useRoomStore } from '@/store/useRoomStore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function FocusRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { activeRoom, joinRoom, leaveRoom, isLoading, error } = useRoomStore();
  const { user } = useAuth();

  useEffect(() => {
    if (roomId && (!activeRoom || activeRoom._id !== roomId)) {
      joinRoom(roomId);
    }
  }, [roomId, activeRoom, joinRoom]);

  const handleLeave = () => {
    leaveRoom();
    navigate('/rooms');
  };

  const handleShareRoom = () => {
    if (!activeRoom) return;
    const inviteCode = (activeRoom as any).accessCode || activeRoom._id;
    navigator.clipboard.writeText(inviteCode);
    toast.success(`Room Code "${inviteCode}" copied to clipboard! Share it with your friends.`);
  };

  if (isLoading || !activeRoom) {
    return (
      <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#6E36E4] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Connecting to live focus room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 text-center space-y-4 max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
          {error}
        </div>
        <button
          onClick={() => navigate('/rooms')}
          className="bg-[#6E36E4] text-white hover:bg-[#5B2AC6] font-semibold px-4 py-2 rounded-xl text-xs"
        >
          Back to Focus Rooms
        </button>
      </div>
    );
  }

  const isHost = activeRoom.host?._id === user?._id || (activeRoom.host as any) === user?._id;

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16 px-1 sm:px-0 font-sans text-slate-900">
      {/* Top Header Navigation Bar */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Top Accent Purple Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500" />

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleLeave}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Back to Rooms"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {activeRoom.name}
            </h1>

            {isHost && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                Room Host
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleShareRoom}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Code</span>
          </button>

          <button
            onClick={handleLeave}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Room</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Timer & Ambient Sound Mixer */}
        <div className="lg:col-span-2 space-y-5">
          <RoomTimer />
          <AmbientSoundMixer preset={activeRoom.ambientPreset} />
        </div>

        {/* Right Column: Active Co-Workers & Live Room Chat */}
        <div className="space-y-5">
          <ParticipantList
            participants={activeRoom.participants}
            hostId={activeRoom.host?._id || (activeRoom.host as any)}
          />
          <RoomChat />
        </div>
      </div>
    </div>
  );
}
