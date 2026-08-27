import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <div className="min-h-screen bg-[#FAF9F5] p-16 text-center text-[#666560] font-medium flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-[#191918] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Connecting to live focus room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] p-16 text-center space-y-4 max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
          {error}
        </div>
        <Button onClick={() => navigate('/rooms')} className="bg-[#191918] text-white hover:bg-[#333330] font-medium rounded-xl">
          Back to Focus Rooms
        </Button>
      </div>
    );
  }

  const isHost = activeRoom.host?._id === user?._id || (activeRoom.host as any) === user?._id;

  return (
    <div className="min-h-screen bg-[#FAF9F5] p-6 sm:p-8 max-w-7xl mx-auto space-y-6 pb-24 font-sans text-[#191918]">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E4DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeave}
            className="rounded-xl border border-[#E6E4DF] bg-white hover:bg-[#F4F4F0] text-[#191918]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#191918] tracking-tight">
                {activeRoom.name}
              </h1>

              {activeRoom.stream && (
                <Badge className="capitalize text-[10px] font-medium px-2.5 py-0.5 bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF] rounded-full">
                  {activeRoom.stream}
                </Badge>
              )}

              {isHost && (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold flex items-center gap-1 rounded-full">
                  <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Room Host
                </Badge>
              )}
            </div>

            {activeRoom.description && (
              <p className="text-xs text-[#666560] mt-0.5">
                {activeRoom.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareRoom}
            className="gap-2 text-xs font-medium rounded-xl border-[#E6E4DF] bg-white hover:bg-[#F4F4F0] text-[#191918]"
          >
            <Share2 className="w-4 h-4 text-[#191918]" />
            <span>Share Code</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
            className="gap-2 text-xs font-medium rounded-xl text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Room</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Synchronized Hero Timer & Ambient Sound Mixer */}
        <div className="lg:col-span-2 space-y-6">
          <RoomTimer />
          <AmbientSoundMixer preset={activeRoom.ambientPreset} />
        </div>

        {/* Right Column: Participants List & Live Room Chat */}
        <div className="space-y-6">
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
