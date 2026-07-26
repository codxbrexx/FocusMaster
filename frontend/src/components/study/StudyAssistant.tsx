import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="flex flex-col h-full bg-card border-border/50">
      <CardHeader className="border-b border-border/50 py-4">
        <CardTitle className="text-lg flex items-center gap-2 font-medium">
          <Bot className="h-5 w-5 text-purple-500" />
          Notes Q&A Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-muted/50 border border-border/50 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.context && msg.context.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                    <p className="font-semibold flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Sources used:
                    </p>
                    {msg.context.map((c, j) => (
                      <div key={j} className="flex gap-2 items-start bg-background/50 p-2 rounded border border-border/30">
                        <FileText className="h-3 w-3 shrink-0 mt-0.5" />
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
              <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="flex gap-2">
            <Input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask a question about your notes..."
              className="bg-card"
              disabled={loading}
            />
            <Button onClick={handleAsk} disabled={loading || !query.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
