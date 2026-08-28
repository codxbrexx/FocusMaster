import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Users, Send, Crown, Flame, Sparkles } from 'lucide-react';
import { useRoomStore, type Participant } from '@/store/useRoomStore';
import { useAuth } from '@/context/AuthContext';

interface RoomChatProps {
  participants?: Participant[];
  hostId?: string;
}

const QUICK_CHEERS = [
  '🔥 Keep grinding!',
  '☕ Coffee break time',
  '💪 Stay focused!',
  '🚀 25m Pomodoro done',
  '💡 Almost at the goal!',
];

export function RoomChat({ participants = [], hostId }: RoomChatProps) {
  const { messages, sendChatMessage } = useRoomStore();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'coworkers'>('chat');
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setText('');
  };

  const handleQuickCheer = (cheerText: string) => {
    sendChatMessage(cheerText);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between overflow-hidden h-full text-slate-900">
      {/* Header Tab Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Room Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('coworkers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'coworkers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Co-Workers</span>
            <span className="bg-[#F0EBFE] text-[#6E36E4] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
              {participants.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>REALTIME</span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {/* Live Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6E36E4] flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">No room messages yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed font-medium">
                  Send an encouragement message or use quick cheers below to study together!
                </p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const msgUser = m.user || (m as any).sender;
                const isMe = msgUser?._id === user?._id;
                const isMsgHost = msgUser?._id === hostId || (msgUser as any) === hostId;

                return (
                  <div key={m.id || (m as any)._id || idx} className="flex items-start gap-2.5">
                    <img
                      src={msgUser?.picture || 'https://github.com/shadcn.png'}
                      alt={msgUser?.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {msgUser?.name || 'Peer'}
                        </span>

                        {isMsgHost && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            HOST
                          </span>
                        )}

                        {isMe && (
                          <span className="bg-purple-50 text-[#6E36E4] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-words">
                        {m.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area: Quick Cheer Chips & Input Box */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5 shrink-0">
            {/* Quick Cheers Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {QUICK_CHEERS.map((cheer, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickCheer(cheer)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  {cheer}
                </button>
              ))}
            </div>

            {/* Form Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Send a room message..."
                className="bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl px-3.5 py-2 text-xs w-full focus:outline-none focus:border-[#6E36E4] font-medium shadow-2xs"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white p-2.5 rounded-xl transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Tab 2: Active Co-Workers List */
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Studying Together Now</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {participants.length} peers currently in this Pomodoro session
            </p>
          </div>

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
                      <span className="font-bold text-slate-900 text-xs truncate max-w-[110px]">
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

                <span className="border border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  IDLE
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
