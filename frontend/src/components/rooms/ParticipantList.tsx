import { Users, Crown, Flame } from 'lucide-react';
import type { Participant } from '@/store/useRoomStore';

interface ParticipantListProps {
  participants: Participant[];
  hostId?: string;
}

export function ParticipantList({ participants, hostId }: ParticipantListProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <h2 className="text-sm font-bold text-slate-900">Active Co-Workers</h2>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {participants.length} Online
        </span>
      </div>

      {/* Participant Items List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {participants.map((p, idx) => {
          const isRoomHost = (p.user as any)?._id === hostId || (p.user as any) === hostId;

          return (
            <div
              key={p.user?._id || idx}
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                isRoomHost
                  ? 'border-amber-300/80 bg-amber-50/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.user?.picture || 'https://github.com/shadcn.png'}
                  alt={p.user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">
                      {p.user?.name || 'Anonymous Student'}
                    </span>
                    {isRoomHost && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                        HOST
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Active Streak</span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <span className="border border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                IDLE
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
