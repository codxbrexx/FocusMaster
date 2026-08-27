import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
  BookOpen,
  MessageSquareText,
  BrainCircuit,
} from 'lucide-react';
import { uploadDocument, fetchDocuments } from '@/services/aiApi';
import { StudyAssistant } from '@/components/study/StudyAssistant';
import { QuizGenerator } from '@/components/study/QuizGenerator';
import { AiInsightsPanel } from '@/components/dashboard/AiInsightsPanel';
import { StudyPlanCard } from '@/components/dashboard/StudyPlanCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { toast } from 'sonner';

type TabType = 'plan' | 'qa' | 'quiz';

export function StudyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const result = await fetchDocuments();
      setDocuments(result.documents || []);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported currently.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(file);
      toast.success('Document processed successfully!');
      loadDocuments();
    } catch {
      toast.error('Failed to process document');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const TABS = [
    { id: 'plan', label: 'Study Plan & Diagnostics', icon: BookOpen, count: null },
    { id: 'qa', label: 'Notes Q&A Assistant', icon: MessageSquareText, count: documents.length > 0 ? documents.length : null },
    { id: 'quiz', label: 'AI Pop Quiz', icon: BrainCircuit, count: null },
  ] as const;

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-4 md:p-6 pb-24 font-sans text-slate-900">
      {/* Hero Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>AI Study Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Study Assistant & Adaptive Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl">
            Switch between your stream study plan, context-aware PDF notes Q&A, and interactive AI knowledge quizzes.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#6E36E4] shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#6E36E4]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-purple-50 text-[#6E36E4]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering */}
      <AnimatePresence mode="wait">
        {activeTab === 'plan' && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <StudyPlanCard />
            <AiInsightsPanel />
            <RecommendationsCard />
          </motion.div>
        )}

        {activeTab === 'qa' && (
          <motion.div
            key="qa"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Documents Upload */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="h-4 w-4 text-[#6E36E4]" />
                  <h3 className="text-base font-bold text-slate-900">Study Notes & Index</h3>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="pdf-upload"
                    className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-[#6E36E4]/40 transition-all ${
                      uploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 mb-2 text-[#6E36E4] animate-spin" />
                      ) : (
                        <UploadCloud className="w-8 h-8 mb-2 text-[#6E36E4]" />
                      )}
                      <p className="mb-1 text-xs text-slate-600 font-medium">
                        <span className="font-bold text-[#6E36E4]">Click to upload</span> or drag PDF
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">PDF Document (Max 5MB)</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Uploaded Notes ({documents.length})
                  </h4>
                  {loadingDocs ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-[#6E36E4]" />
                    </div>
                  ) : documents.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-xl border border-slate-200/80 font-medium">
                      No documents uploaded yet. Upload a PDF to start asking questions!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {documents.map((doc) => (
                        <div key={doc._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <FileText className="h-4 w-4 text-[#6E36E4] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate text-slate-900">{doc.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {new Date(doc.uploadedAt).toLocaleDateString()} · {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Q&A Assistant Chat */}
            <div className="lg:col-span-2 min-h-[560px]">
              <StudyAssistant />
            </div>
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto min-h-[560px]"
          >
            <QuizGenerator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
