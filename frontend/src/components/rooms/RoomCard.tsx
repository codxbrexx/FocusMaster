import { motion } from 'framer-motion';
import { Play, Lock, Volume2, Crown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FocusRoom } from '@/store/useRoomStore';

interface RoomCardProps {
  room: FocusRoom;
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const isFull = room.participants.length >= room.maxParticipants;

  const streamStyles: Record<string, { bg: string; text: string }> = {
    engineering: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      text: 'Engineering',
    },
    medical: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'Medical',
    },
    commerce: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'Commerce',
    },
    competitive: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      text: 'Competitive',
    },
  };

  const streamStyle =
    room.stream && streamStyles[room.stream] ? streamStyles[room.stream] : streamStyles.engineering;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border border-[#E6E4DF] hover:border-[#191918]/30 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all rounded-2xl overflow-hidden bg-white flex flex-col justify-between">
        {/* Accent top line */}
        <div className="h-1.5 w-full bg-[#191918]" />

        <div>
          <CardHeader className="pb-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold truncate text-[#191918]">
                    {room.name}
                  </CardTitle>
                  {room.visibility === 'private' && (
                    <span title="Private Room">
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    </span>
                  )}
                </div>

                {room.description && (
                  <p className="text-xs text-[#666560] line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                )}
              </div>

              {room.stream && (
                <Badge
                  className={`text-[10px] font-medium uppercase px-2.5 py-0.5 border ${streamStyle.bg} shrink-0 rounded-full`}
                >
                  {streamStyle.text}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Live Status & Ambient Audio */}
            <div className="flex items-center justify-between text-xs text-[#666560] border-t border-b border-[#E6E4DF] py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{room.status === 'focusing' ? 'In Session' : 'Lobby'}</span>
                </div>
              </div>

              {room.ambientPreset && room.ambientPreset !== 'none' && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#666560] capitalize">
                  <Volume2 className="w-3.5 h-3.5 text-[#191918]" />
                  <span>{room.ambientPreset}</span>
                </div>
              )}
            </div>

            {/* Participants Avatar Stack & Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {room.participants.slice(0, 4).map((p, idx) => (
                    <img
                      key={idx}
                      src={p.user?.picture || 'https://github.com/shadcn.png'}
                      alt={p.user?.name || 'User'}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                  {room.participants.length > 4 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F4F4F0] text-[10px] font-semibold text-[#191918] ring-2 ring-white border border-[#E6E4DF]">
                      +{room.participants.length - 4}
                    </div>
                  )}
                </div>

                <span className="text-xs font-medium text-[#666560]">
                  {room.participants.length} / {room.maxParticipants} online
                </span>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Footer Actions */}
        <div className="p-4 pt-0 flex items-center justify-between border-t border-[#E6E4DF] mt-3 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-[#666560] font-medium">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[110px] text-[11px] text-[#191918]">
              Host: {room.host?.name || 'Anonymous'}
            </span>
          </div>

          <Button
            size="sm"
            disabled={isFull}
            onClick={() => onJoin(room._id)}
            className="gap-1.5 font-medium bg-[#191918] hover:bg-[#333330] text-white rounded-xl shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isFull ? 'Room Full' : 'Join Room'}</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
              +15 XP
            </span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
