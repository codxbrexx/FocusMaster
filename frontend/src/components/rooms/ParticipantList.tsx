import { Users, ShieldCheck } from 'lucide-react';
import type { Participant } from '@/store/useRoomStore';

interface ParticipantListProps {
  participants: Participant[];
  hostId?: string;
}

export function ParticipantList({ participants, hostId }: ParticipantListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
          <Users className="w-4 h-4 text-blue-500" />
          <span>Active Participants</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {participants.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {participants.map((p, idx) => {
          const isHost = p.user._id === hostId;
          return (
            <div
              key={p.user._id || idx}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={p.user.picture || 'https://github.com/shadcn.png'}
                    alt={p.user.name}
                    className="w-7 h-7 rounded-full border border-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {p.user.name}
                    </span>
                    {isHost && (
                      <span title="Host">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                {p.status || 'Focusing'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
