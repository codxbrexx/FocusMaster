import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, LogOut, Crown, Target, Zap, Sparkles } from 'lucide-react';
import { RoomTimer } from '@/components/rooms/RoomTimer';
import { RoomChat } from '@/components/rooms/RoomChat';
import { useRoomStore } from '@/store/useRoomStore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function FocusRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { activeRoom, joinRoom, leaveRoom, isLoading, error } = useRoomStore();
  const { user } = useAuth();
  const [userGoal, setUserGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');

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

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGoal.trim()) return;
    setCurrentGoal(userGoal.trim());
    toast.success(`Goal set: "${userGoal.trim()}"`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeave}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Back to Rooms"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
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
            {activeRoom.description && (
              <p className="text-xs text-slate-500 font-medium">
                {activeRoom.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Synchronized Timer & Goal Accountability */}
        <div className="lg:col-span-8 space-y-5">
          {/* Synchronized Room Timer */}
          <RoomTimer />

          {/* Session Goal Accountability Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Target className="w-4 h-4 text-[#6E36E4]" />
                <span>Session Goal & Accountability</span>
              </div>
              <span className="bg-purple-50 text-[#6E36E4] px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#6E36E4]" />
                +15 XP Active
              </span>
            </div>

            {currentGoal ? (
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6E36E4]" />
                  <span className="text-xs font-semibold text-slate-800">
                    Current Focus Goal: <span className="text-[#6E36E4]">{currentGoal}</span>
                  </span>
                </div>
                <button
                  onClick={() => setCurrentGoal('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetGoal} className="flex items-center gap-2">
                <input
                  type="text"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  placeholder="What are you studying in this session? (e.g., Solving 5 LeetCode Graph problems)"
                  className="bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl px-3.5 py-2 text-xs w-full focus:outline-none focus:border-[#6E36E4] font-medium"
                />
                <button
                  type="submit"
                  disabled={!userGoal.trim()}
                  className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Set Goal
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Full Height Room Chat Panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-4 h-[calc(100vh-140px)] min-h-[520px]">
            <RoomChat
              participants={activeRoom.participants}
              hostId={activeRoom.host?._id || (activeRoom.host as any)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
