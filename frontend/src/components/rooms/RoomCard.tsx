import { motion } from 'framer-motion';
import { MoreHorizontal, Volume2, Crown } from 'lucide-react';
import type { FocusRoom } from '@/store/useRoomStore';

interface RoomCardProps {
  room: FocusRoom;
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const isFull = room.participants.length >= room.maxParticipants;
  const isSession = room.status === 'focusing';

  // Dynamic user avatar list
  const avatars = room.participants.slice(0, 3);
  const remainingCount = room.participants.length > 3 ? room.participants.length - 3 : 0;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between relative h-full">
        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
          {/* Header Row: Title & Options */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight truncate max-w-[180px]">
                  {room.name}
                </h3>
                {room.description && (
                  <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                    {room.description}
                  </p>
                )}
              </div>

              <button
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Room Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Status Pill & Ambient Audio */}
            <div className="flex items-center justify-between mt-3">
              {isSession ? (
                <span className="bg-[#E6F9F0] text-[#10B981] px-3 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  In Session
                </span>
              ) : (
                <span className="bg-[#F0EBFE] text-[#6E36E4] px-3 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E36E4]" />
                  Lobby
                </span>
              )}

              {room.ambientPreset && room.ambientPreset !== 'none' && (
                <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 capitalize">
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{room.ambientPreset}</span>
                </div>
              )}
            </div>
          </div>

          {/* Avatars & Online Counter */}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {avatars.map((p, idx) => (
                  <img
                    key={idx}
                    src={p.user?.picture || 'https://github.com/shadcn.png'}
                    alt={p.user?.name || 'User'}
                    className="w-6 h-6 rounded-full ring-2 ring-white object-cover border border-slate-200"
                  />
                ))}
              </div>

              {remainingCount > 0 && (
                <span className="bg-[#F0EBFE] text-[#6E36E4] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  +{remainingCount}
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>
                {room.participants.length} / {room.maxParticipants} online
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 mt-auto">
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate max-w-[100px]">
              Host: {room.host?.name || 'Ali'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={isFull}
              onClick={() => onJoin(room._id)}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              {isFull ? 'Full' : 'Join Room'}
            </button>

            <span className="bg-[#F0EBFE] text-[#6E36E4] font-bold px-2.5 py-1.5 rounded-xl text-[11px] flex items-center justify-center">
              +15 XP
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
