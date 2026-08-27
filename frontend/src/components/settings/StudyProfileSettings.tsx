import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAiStore } from '@/store/useAiStore';
import { toast } from 'sonner';
import { GraduationCap, Plus, X, Save, Loader2, Check, Sparkles } from 'lucide-react';
import type { StudySubject } from '@/services/aiApi';

interface StreamOption {
  value: string;
  label: string;
  defaultSubjects: string[];
}

const STREAMS: StreamOption[] = [
  {
    value: 'engineering',
    label: 'Engineering',
    defaultSubjects: ['Physics', 'Chemistry', 'Mathematics'],
  },
  {
    value: 'medical',
    label: 'Medical',
    defaultSubjects: ['Physics', 'Chemistry', 'Biology'],
  },
  {
    value: 'commerce',
    label: 'Commerce',
    defaultSubjects: ['Accountancy', 'Economics', 'Business Studies'],
  },
  {
    value: 'competitive',
    label: 'Competitive Exams',
    defaultSubjects: ['General Studies', 'Quantitative Aptitude', 'Reasoning'],
  },
  {
    value: 'custom',
    label: 'Custom',
    defaultSubjects: [],
  },
];

/**
 * Form component for setting study profile data.
 * Remounts via `key={profileVersion}` whenever studyProfile updates in store.
 */
function StudyProfileForm({
  studyProfile,
  profileLoading,
  onSave,
}: {
  studyProfile: {
    stream?: string | null;
    customStreamName?: string | null;
    subjects?: StudySubject[] | null;
    examDate?: string | null;
    weeklyGoalHours?: number | null;
    availableHoursPerDay?: number | null;
  } | null;
  profileLoading: boolean;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [stream, setStream] = useState<string>(studyProfile?.stream || '');
  const [customStreamName, setCustomStreamName] = useState(studyProfile?.customStreamName || '');
  const [subjects, setSubjects] = useState<StudySubject[]>(studyProfile?.subjects || []);
  const [examDate, setExamDate] = useState(studyProfile?.examDate ? studyProfile.examDate.split('T')[0] : '');
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(studyProfile?.weeklyGoalHours || 20);
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState(studyProfile?.availableHoursPerDay || 4);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleStreamSelect = (selectedOption: StreamOption) => {
    const newStreamName = selectedOption.label;
    setStream(newStreamName);

    // If subjects list is empty, auto-populate stream defaults
    if (subjects.length === 0 && selectedOption.defaultSubjects.length > 0) {
      setSubjects(
        selectedOption.defaultSubjects.map((subName) => ({
          name: subName,
          difficulty: 'medium',
        }))
      );
      toast.info(`Loaded default subjects for ${newStreamName}`);
    }
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    if (subjects.length >= 20) {
      toast.error('Maximum 20 subjects allowed');
      return;
    }
    // Prevent duplicate subject names
    if (subjects.some((s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      toast.error('Subject already added');
      return;
    }
    setSubjects([...subjects, { name: newSubjectName.trim(), difficulty: 'medium' }]);
    setNewSubjectName('');
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubjectDifficulty = (index: number, difficulty: 'easy' | 'medium' | 'hard') => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], difficulty };
    setSubjects(updated);
  };

  const loadStreamRecommendedSubjects = () => {
    const currentStreamOpt = STREAMS.find(
      (s) =>
        s.value.toLowerCase() === stream.toLowerCase() ||
        s.label.toLowerCase() === stream.toLowerCase()
    );

    if (currentStreamOpt && currentStreamOpt.defaultSubjects.length > 0) {
      const existingNames = new Set(subjects.map((s) => s.name.toLowerCase()));
      const newSubs: StudySubject[] = [...subjects];

      currentStreamOpt.defaultSubjects.forEach((subName) => {
        if (!existingNames.has(subName.toLowerCase())) {
          newSubs.push({ name: subName, difficulty: 'medium' });
        }
      });

      setSubjects(newSubs);
      toast.success(`Recommended subjects added for ${currentStreamOpt.label}`);
    } else {
      toast.info('Select a standard stream to auto-populate recommended subjects');
    }
  };

  const handleSave = async () => {
    if (!stream) {
      toast.error('Please select a study stream');
      return;
    }

    try {
      await onSave({
        stream: stream || undefined,
        customStreamName: stream.toLowerCase() === 'custom' ? customStreamName : '',
        subjects,
        examDate: examDate || null,
        weeklyGoalHours: Number(weeklyGoalHours) || 20,
        availableHoursPerDay: Number(availableHoursPerDay) || 4,
      });
      toast.success('Study profile updated successfully!');
    } catch {
      toast.error('Failed to save study profile');
    }
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
    hard: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20',
  };

  return (
    <CardContent className="space-y-6">
      {/* Stream Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Academic Stream / Exam Target</Label>
        <div className="flex flex-wrap gap-2.5">
          {STREAMS.map((s) => {
            const isSelected =
              stream.toLowerCase() === s.value.toLowerCase() ||
              stream.toLowerCase() === s.label.toLowerCase();

            return (
              <button
                key={s.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleStreamSelect(s);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 ring-2 ring-purple-500/30 scale-[1.02]'
                    : 'bg-muted/30 text-foreground border-border/80 hover:bg-muted/60 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                {s.label}
              </button>
            );
          })}
        </div>

        {stream.toLowerCase() === 'custom' && (
          <Input
            placeholder="Enter your custom stream name (e.g. CFA, USMLE, SAT)"
            value={customStreamName}
            onChange={(e) => setCustomStreamName(e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      {/* Subjects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">Subjects & Modules</Label>
          {stream && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={loadStreamRecommendedSubjects}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill Recommended
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a subject (e.g. Physics, Organic Chemistry)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSubject();
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addSubject} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {subjects.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {subjects.map((subject, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 shadow-xs transition-all hover:border-border"
              >
                <span className="text-sm font-medium text-foreground">{subject.name}</span>
                <button
                  type="button"
                  title="Click to change difficulty level"
                  onClick={() => {
                    const next =
                      subject.difficulty === 'easy'
                        ? 'medium'
                        : subject.difficulty === 'medium'
                        ? 'hard'
                        : 'easy';
                    updateSubjectDifficulty(i, next);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize cursor-pointer transition-colors ${
                    difficultyColors[subject.difficulty || 'medium']
                  }`}
                >
                  {subject.difficulty || 'medium'}
                </button>
                <button
                  type="button"
                  onClick={() => removeSubject(i)}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-0.5 ml-0.5 cursor-pointer"
                  aria-label="Remove subject"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic pt-1">
            No subjects added yet. Select a stream above or type a subject name.
          </p>
        )}
      </div>

      {/* Exam Date & Goals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Target Exam Date</Label>
          <Input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Weekly Goal (Hours)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={weeklyGoalHours}
            onChange={(e) => setWeeklyGoalHours(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Available Hours/Day</Label>
          <Input
            type="number"
            min={0.5}
            max={16}
            step={0.5}
            value={availableHoursPerDay}
            onChange={(e) => setAvailableHoursPerDay(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={profileLoading}
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 font-medium px-6 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          {profileLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Study Profile
        </Button>
      </div>
    </CardContent>
  );
}

export function StudyProfileSettings() {
  const { studyProfile, profileLoading, fetchStudyProfile, updateStudyProfile } = useAiStore();

  useEffect(() => {
    fetchStudyProfile();
  }, [fetchStudyProfile]);

  // Stable key so form remounts with fresh values when store finishes loading/updating
  const profileVersion = useMemo(
    () => (studyProfile ? JSON.stringify(studyProfile) : 'empty'),
    [studyProfile]
  );

  return (
    <Card className="bg-card border border-border/50 shadow-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Study Profile
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up your stream and subject preferences to personalize AI study plans, focus duration recommendations, and quiz questions.
        </p>
      </CardHeader>
      <StudyProfileForm
        key={profileVersion}
        studyProfile={studyProfile}
        profileLoading={profileLoading}
        onSave={updateStudyProfile}
      />
    </Card>
  );
}
