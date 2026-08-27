import { motion } from 'framer-motion';
import { Users, Play, Lock, Volume2 } from 'lucide-react';
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

  const streamColors: Record<string, string> = {
    engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medical: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    commerce: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    competitive: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold truncate text-slate-900 dark:text-slate-100">
                {room.name}
              </CardTitle>
              {room.visibility === 'private' && (
                <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              )}
            </div>

            {room.stream && (
              <Badge className={`text-xs font-semibold capitalize ${streamColors[room.stream] || ''}`}>
                {room.stream}
              </Badge>
            )}
          </div>
          {room.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              {room.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-primary" />
              <span>
                {room.participants.length} / {room.maxParticipants} online
              </span>
            </div>

            {room.ambientPreset !== 'none' && (
              <div className="flex items-center gap-1 text-slate-400 capitalize">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{room.ambientPreset}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <img
                src={room.host?.picture || 'https://github.com/shadcn.png'}
                alt={room.host?.name || 'Host'}
                className="w-6 h-6 rounded-full border border-slate-200"
              />
              <span className="text-xs text-slate-500 truncate max-w-[120px]">
                Host: {room.host?.name || 'Anonymous'}
              </span>
            </div>

            <Button
              size="sm"
              disabled={isFull}
              onClick={() => onJoin(room._id)}
              className="gap-1.5 font-semibold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isFull ? 'Full' : 'Join'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
