import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { UploadCloud, FileText, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadDocument, fetchDocuments } from '@/services/aiApi';
import { StudyAssistant } from '@/components/study/StudyAssistant';
import { QuizGenerator } from '@/components/study/QuizGenerator';
import { AiInsightsPanel } from '@/components/dashboard/AiInsightsPanel';
import { StudyPlanCard } from '@/components/dashboard/StudyPlanCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { toast } from 'sonner';

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function StudyPage() {
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

  return (
    <div className="animate-fade-in space-y-8 pb-16 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>AI Study Hub & Insights</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Stream AI Assistant & Personal Study Plan
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate stream-tailored study plans, upload PDF notes for Q&A, and view personalized AI insights.
          </p>
        </div>
      </div>

      {/* AI Insights & Plan Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudyPlanCard />
        </div>
        <AiInsightsPanel />
      </div>

      {/* Recommendations */}
      <RecommendationsCard />

      {/* Documents & Quiz Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents & Upload */}
        <motion.div variants={item} className="space-y-6">
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                <FileText className="h-4 w-4 text-[#6E36E4]" />
                Your Study Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
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
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-[#6E36E4]/40 transition-all ${
                    uploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 mb-3 text-slate-400 animate-spin" />
                    ) : (
                      <UploadCloud className="w-8 h-8 mb-3 text-slate-400" />
                    )}
                    <p className="mb-1 text-xs text-slate-600 font-medium">
                      <span className="font-bold text-[#6E36E4]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400">PDF (Max 5MB)</p>
                  </div>
                </label>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Uploaded Documents
                </h3>
                {loadingDocs ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  </div>
                ) : documents.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    No documents uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                        <FileText className="h-4 w-4 text-[#6E36E4] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-slate-900">{doc.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()} · {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Column: Q&A Assistant */}
        <motion.div variants={item} className="lg:col-span-1 h-[600px] lg:h-auto">
          <StudyAssistant />
        </motion.div>

        {/* Right Column: Quiz Generator */}
        <motion.div variants={item} className="lg:col-span-1 h-[600px] lg:h-auto">
          <QuizGenerator />
        </motion.div>
      </div>
    </div>
  );
}
