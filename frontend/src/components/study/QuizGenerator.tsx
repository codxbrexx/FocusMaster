import { useState } from 'react';
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
      setCurrentQuestionIndex(i => i + 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden font-sans text-slate-900">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interactive Quiz</h3>
            <p className="text-[11px] text-slate-500 font-medium">Knowledge assessment</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6E36E4]" /> : <RefreshCw className="h-3.5 w-3.5" />}
          <span>Generate Quiz</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col p-6 items-center justify-center">
        {loading ? (
          <div className="text-center space-y-3">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-[#6E36E4]" />
            <p className="text-xs text-slate-500 font-medium">Analyzing notes and generating active recall questions...</p>
          </div>
        ) : !quizData ? (
          <div className="text-center space-y-3 max-w-xs">
            <div className="bg-emerald-50 p-4 rounded-2xl w-fit mx-auto text-emerald-600 border border-emerald-100">
              <HelpCircle className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Knowledge Check</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Generate a 5-question AI quiz from your uploaded study materials.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              Start Practice Quiz
            </button>
          </div>
        ) : currentQuestionIndex >= quizData.questions.length ? (
          <div className="text-center space-y-4 w-full">
            <h3 className="text-lg font-bold text-slate-900">Quiz Completed!</h3>
            <div className="text-4xl font-bold font-mono text-[#6E36E4] my-2">
              {score} / {quizData.questions.length}
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
              {score === quizData.questions.length ? 'Perfect score! Exceptional mastery of the subject.' : 
               score > quizData.questions.length / 2 ? 'Great effort! Review missed items to optimize retention.' : 
               'Revisit study notes to reinforce core concepts.'}
            </p>
            <button
              onClick={handleGenerate}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Take Another Quiz
            </button>
          </div>
        ) : (
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
              <span className="text-[#6E36E4]">{quizData.title}</span>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {quizData.questions[currentQuestionIndex].question}
            </h3>
            
            <div className="space-y-2.5">
              {quizData.questions[currentQuestionIndex].options.map((opt, i) => {
                const isCorrect = i === quizData.questions[currentQuestionIndex].correctAnswerIndex;
                const isSelected = i === selectedOption;
                
                let btnStyle = "bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-purple-50/50 hover:border-purple-200";
                
                if (showResult) {
                  if (isCorrect) btnStyle = "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold";
                  else if (isSelected && !isCorrect) btnStyle = "border-red-300 bg-red-50 text-red-900 font-bold";
                  else btnStyle = "opacity-40 border-slate-200 bg-slate-50";
                } else if (isSelected) {
                  btnStyle = "border-[#6E36E4] bg-purple-50 text-[#6E36E4] font-bold";
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={showResult}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${btnStyle} flex items-center justify-between cursor-pointer`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
            
            {showResult && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Explanation:</span>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {quizData.questions[currentQuestionIndex].explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {quizData && currentQuestionIndex < quizData.questions.length && (
        <div className="border-t border-slate-100 p-4 bg-slate-50/50">
          {!showResult ? (
            <button 
              className="w-full bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold py-2.5 rounded-xl text-xs shadow-2xs transition-colors disabled:opacity-40 cursor-pointer" 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
            >
              Submit Answer
            </button>
          ) : (
            <button 
              className="w-full bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold py-2.5 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer" 
              onClick={handleNext}
            >
              {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
