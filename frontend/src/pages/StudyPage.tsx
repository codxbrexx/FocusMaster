import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { UploadCloud, FileText, Loader2, BookOpen } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadDocument, fetchDocuments } from '@/services/aiApi';
import { StudyAssistant } from '@/components/study/StudyAssistant';
import { QuizGenerator } from '@/components/study/QuizGenerator';
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
    } catch (err) {
      toast.error('Failed to process document');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-500" />
            Study Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your notes to chat with them or generate pop quizzes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents & Upload */}
        <motion.div variants={item} className="space-y-6">
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Your Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 border-border/50 hover:bg-muted/40 hover:border-primary/50 transition-all ${
                    uploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
                    ) : (
                      <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                    )}
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (Max 5MB)</p>
                  </div>
                </label>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Uploaded Documents
                </h3>
                {loadingDocs ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-border/30">
                    No documents uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc._id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/50">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
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
