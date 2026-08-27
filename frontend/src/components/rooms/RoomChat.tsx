import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/store/useRoomStore';

export function RoomChat() {
  const { messages, sendChatMessage } = useRoomStore();
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setText('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-[380px]">
      <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
        <MessageSquare className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Live Room Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No messages yet. Say hi to room members!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <img
                src={msg.user.picture || 'https://github.com/shadcn.png'}
                alt={msg.user.name}
                className="w-6 h-6 rounded-full mt-0.5"
              />
              <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>{msg.user.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a chat message..."
          className="text-xs"
        />
        <Button type="submit" size="sm" disabled={!text.trim()} className="shrink-0">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
