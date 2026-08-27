import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomTimer } from '@/components/rooms/RoomTimer';
import { ParticipantList } from '@/components/rooms/ParticipantList';
import { RoomChat } from '@/components/rooms/RoomChat';
import { useRoomStore } from '@/store/useRoomStore';

export function FocusRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { activeRoom, joinRoom, leaveRoom, isLoading, error } = useRoomStore();

  useEffect(() => {
    if (roomId && (!activeRoom || activeRoom._id !== roomId)) {
      joinRoom(roomId);
    }
  }, [roomId, activeRoom, joinRoom]);

  const handleLeave = () => {
    leaveRoom();
    navigate('/rooms');
  };

  if (isLoading || !activeRoom) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Connecting to live focus room...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Room Title */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeRoom.name}
              </h1>
              {activeRoom.stream && (
                <Badge className="capitalize text-xs font-semibold">
                  {activeRoom.stream}
                </Badge>
              )}
            </div>
            {activeRoom.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeRoom.description}
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleLeave} className="text-red-500 hover:text-red-600">
          Leave Room
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timer & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <RoomTimer />

          {/* Room Audio Info */}
          {activeRoom.ambientPreset !== 'none' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Ambient Audio Active
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 capitalize">
                    Playing {activeRoom.ambientPreset} preset for all participants
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Participants & Live Chat */}
        <div className="space-y-6">
          <ParticipantList
            participants={activeRoom.participants}
            hostId={activeRoom.host?._id}
          />
          <RoomChat />
        </div>
      </div>
    </div>
  );
}
