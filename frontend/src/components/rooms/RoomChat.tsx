import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/store/useRoomStore';

const QUICK_REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '💪', label: 'Power' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '💡', label: 'Idea' },
];

export function RoomChat() {
  const { messages, sendChatMessage } = useRoomStore();
  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setText('');
  };

  const handleQuickReaction = (emoji: string) => {
    sendChatMessage(emoji);
  };

  return (
    <div className="bg-white border border-[#E6E4DF] rounded-2xl p-4 flex flex-col h-[400px] shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-[#191918]">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b pb-3 border-[#E6E4DF]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF]">
            <MessageSquare className="w-4 h-4 text-[#191918]" />
          </div>
          <h3 className="text-sm font-semibold text-[#191918]">
            Live Room Chat
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-[#9C9A92] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Realtime
        </span>
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#9C9A92] space-y-2">
            <MessageSquare className="w-8 h-8 text-[#9C9A92]" />
            <p className="text-xs font-semibold text-[#191918]">No room messages yet</p>
            <p className="text-[11px] text-[#666560]">
              Send an encouragement message or use quick emoji cheers below!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5">
              <img
                src={msg.user.picture || 'https://github.com/shadcn.png'}
                alt={msg.user.name}
                className="w-7 h-7 rounded-full object-cover mt-0.5 border border-[#E6E4DF]"
              />
              <div className="flex-1 bg-[#F4F4F0] p-2.5 rounded-xl border border-[#E6E4DF] text-xs">
                <div className="flex items-center justify-between font-semibold text-[#191918]">
                  <span>{msg.user.name}</span>
                  <span className="text-[10px] text-[#9C9A92] font-normal">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-[#666560] mt-1 leading-relaxed break-words font-normal">
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Reaction Cheer Buttons */}
      <div className="flex items-center gap-1.5 py-2 border-t border-[#E6E4DF] overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold text-[#9C9A92] uppercase tracking-wider shrink-0 mr-1">
          Cheer:
        </span>
        {QUICK_REACTIONS.map((r) => (
          <button
            key={r.emoji}
            type="button"
            onClick={() => handleQuickReaction(r.emoji)}
            className="p-1.5 rounded-lg bg-[#F4F4F0] hover:bg-[#EFECE6] text-sm transition transform active:scale-125 shrink-0 border border-[#E6E4DF]"
            title={r.label}
          >
            {r.emoji}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-[#E6E4DF]">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message..."
          className="text-xs rounded-xl bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] placeholder:text-[#9C9A92] focus:bg-white focus:border-[#191918] focus-visible:ring-0"
        />
        <Button type="submit" size="sm" disabled={!text.trim()} className="rounded-xl shrink-0 gap-1 font-medium bg-[#191918] hover:bg-[#333330] text-white">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
