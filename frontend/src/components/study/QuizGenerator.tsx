import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { HelpCircle, RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { generateQuiz } from '@/services/aiApi';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export function QuizGenerator() {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<{ title: string; questions: Question[] } | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setQuizData(null);
    try {
      const result = await generateQuiz();
      if (result.error) {
        toast.error(result.error);
      } else if (result.quiz) {
        setQuizData(result.quiz);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
      }
    } catch {
      toast.error('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !quizData) return;
    
    setShowResult(true);
    if (selectedOption === quizData.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (!quizData) return;
    
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Quiz finished, show final score (already handled by condition in render)
      setCurrentQuestionIndex(i => i + 1); // Move past last question
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card border-border/50">
      <CardHeader className="border-b border-border/50 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-medium">
            <HelpCircle className="h-5 w-5 text-emerald-500" />
            Pop Quiz
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            Generate Quiz
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6 items-center justify-center">
        {loading ? (
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Reading notes and generating questions...</p>
          </div>
        ) : !quizData ? (
          <div className="text-center space-y-3">
            <div className="bg-emerald-500/10 p-4 rounded-full w-fit mx-auto text-emerald-500">
              <HelpCircle className="h-8 w-8" />
            </div>
            <p className="text-muted-foreground text-sm">
              Generate a quick 5-question quiz based on your uploaded notes to test your knowledge.
            </p>
          </div>
        ) : currentQuestionIndex >= quizData.questions.length ? (
          <div className="text-center space-y-4 w-full">
            <h3 className="text-xl font-bold">Quiz Complete!</h3>
            <div className="text-4xl font-bold text-primary my-4">
              {score} / {quizData.questions.length}
            </div>
            <p className="text-muted-foreground">
              {score === quizData.questions.length ? 'Perfect score! You really know this material.' : 
               score > quizData.questions.length / 2 ? 'Good job! Keep reviewing to get 100%.' : 
               'Time to hit the notes again.'}
            </p>
            <Button onClick={handleGenerate} className="mt-4">Take another quiz</Button>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
              <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
              <span>{quizData.title}</span>
            </div>
            
            <h3 className="text-lg font-medium">{quizData.questions[currentQuestionIndex].question}</h3>
            
            <div className="space-y-3">
              {quizData.questions[currentQuestionIndex].options.map((opt, i) => {
                const isCorrect = i === quizData.questions[currentQuestionIndex].correctAnswerIndex;
                const isSelected = i === selectedOption;
                
                let btnStyle = "border-border/50 hover:border-primary/50 hover:bg-primary/5";
                
                if (showResult) {
                  if (isCorrect) btnStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-500";
                  else if (isSelected && !isCorrect) btnStyle = "border-red-500/50 bg-red-500/10 text-red-500";
                  else btnStyle = "opacity-50 border-border/20";
                } else if (isSelected) {
                  btnStyle = "border-primary bg-primary/10 text-foreground";
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${btnStyle} flex items-center justify-between`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                  </button>
                );
              })}
            </div>
            
            {showResult && (
              <div className="p-4 bg-muted/30 border border-border/50 rounded-xl text-sm">
                <span className="font-semibold block mb-1">Explanation:</span>
                {quizData.questions[currentQuestionIndex].explanation}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {quizData && currentQuestionIndex < quizData.questions.length && (
        <CardFooter className="border-t border-border/50 p-4 bg-background/50">
          {!showResult ? (
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleNext}
            >
              {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
