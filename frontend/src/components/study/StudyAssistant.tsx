import { useState } from 'react';
import { Bot, Send, Loader2, BookOpen, FileText } from 'lucide-react';
import { queryRag } from '@/services/aiApi';

export function StudyAssistant() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; text: string; context?: string[] }[]>([
    { role: 'assistant', text: 'Hi! Ask me any question based on your uploaded study notes.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    const userMessage = query.trim();
    setQuery('');
    setConversation(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    
    try {
      const result = await queryRag(userMessage);
      if (result.error) {
        setConversation(prev => [...prev, { role: 'assistant', text: result.error }]);
      } else {
        setConversation(prev => [...prev, { role: 'assistant', text: result.answer, context: result.context }]);
      }
    } catch {
      setConversation(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error answering your question.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden font-sans text-slate-900">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6E36E4] flex items-center justify-center border border-purple-100">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notes Q&A Assistant</h3>
          <p className="text-[11px] text-slate-500 font-medium">Context-aware notes retrieval</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px]">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium ${
              msg.role === 'user' 
                ? 'bg-[#6E36E4] text-white rounded-br-none shadow-2xs' 
                : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.context && msg.context.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1.5">
                  <p className="font-bold flex items-center gap-1 text-[#6E36E4]">
                    <BookOpen className="h-3 w-3" /> Retrieved Context:
                  </p>
                  {msg.context.map((c, j) => (
                    <div key={j} className="flex gap-2 items-start bg-white p-2 rounded-xl border border-slate-200/60">
                      <FileText className="h-3 w-3 shrink-0 mt-0.5 text-slate-400" />
                      <span className="italic">"{c}"</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#6E36E4]" />
              <span className="text-xs text-slate-500 font-medium">Reading document index...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <input 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask a question about your uploaded notes..."
            className="flex-1 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6E36E4]/40"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white p-2.5 rounded-xl transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-2xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
