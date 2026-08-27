import { Users, Crown, Flame } from 'lucide-react';
import type { Participant } from '@/store/useRoomStore';

interface ParticipantListProps {
  participants: Participant[];
  hostId?: string;
}

export function ParticipantList({ participants, hostId }: ParticipantListProps) {
  return (
    <div className="bg-white border border-[#E6E4DF] rounded-2xl p-5 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-[#191918]">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-[#E6E4DF]">
        <div className="flex items-center gap-2 font-semibold text-[#191918] text-sm">
          <div className="p-1.5 rounded-lg bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF]">
            <Users className="w-4 h-4 text-[#191918]" />
          </div>
          <span>Active Co-Workers</span>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF]">
          {participants.length} Online
        </span>
      </div>

      {/* Participant List */}
      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
        {participants.map((p, idx) => {
          const isHost = p.user._id === hostId;
          const status = p.status || 'Focusing';

          return (
            <div
              key={p.user._id || idx}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isHost
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-[#F4F4F0]/60 border-[#E6E4DF] hover:border-[#191918]/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with Status Dot */}
                <div className="relative">
                  <img
                    src={p.user.picture || 'https://github.com/shadcn.png'}
                    alt={p.user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#191918]">
                      {p.user.name}
                    </span>
                    {isHost && (
                      <span
                        title="Room Host"
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase"
                      >
                        <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                        Host
                      </span>
                    )}
                  </div>

                  {/* Level / Streak indicator */}
                  <div className="flex items-center gap-2 text-[10px] text-[#666560] mt-0.5 font-medium">
                    <span className="flex items-center gap-0.5 text-orange-600 font-semibold">
                      <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                      Active Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                  status === 'Focusing'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
