import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAiStore } from '@/store/useAiStore';
import { toast } from 'sonner';
import { GraduationCap, Plus, X, Save, Loader2 } from 'lucide-react';
import type { StudySubject } from '@/services/aiApi';

const STREAMS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'competitive', label: 'Competitive Exams' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Inner form component that receives the study profile as a prop.
 * By using `key={profileVersion}` on this component, React unmounts and
 * remounts it whenever the profile changes, so we can use prop-based
 * initial state without any useEffect-setState synchronization.
 */
function StudyProfileForm({ studyProfile, profileLoading, onSave }: {
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

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    if (subjects.length >= 20) {
      toast.error('Maximum 20 subjects allowed');
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

  const handleSave = async () => {
    await onSave({
      stream: stream || undefined,
      customStreamName: stream === 'custom' ? customStreamName : '',
      subjects,
      examDate: examDate || null,
      weeklyGoalHours,
      availableHoursPerDay,
    });
    toast.success('Study profile saved');
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <CardContent className="space-y-6">
      {/* Stream */}
      <div className="space-y-2">
        <Label>Stream</Label>
        <div className="flex flex-wrap gap-2">
          {STREAMS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setStream(s.value);
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                stream === s.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/20 text-foreground/70 border-border/50 hover:border-border'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {stream === 'custom' && (
          <Input
            placeholder="Enter your stream name"
            value={customStreamName}
            onChange={(e) => setCustomStreamName(e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      {/* Subjects */}
      <div className="space-y-2">
        <Label>Subjects</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a subject"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
          />
          <Button variant="outline" size="icon" onClick={addSubject}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {subjects.map((subject, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/20 border border-border/50"
            >
              <span className="text-sm">{subject.name}</span>
              <button
                onClick={() => {
                  const next =
                    subject.difficulty === 'easy' ? 'medium' : subject.difficulty === 'medium' ? 'hard' : 'easy';
                  updateSubjectDifficulty(i, next);
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded border ${difficultyColors[subject.difficulty || 'medium']}`}
              >
                {subject.difficulty || 'medium'}
              </button>
              <button onClick={() => removeSubject(i)} className="text-muted-foreground hover:text-foreground ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Exam Date</Label>
          <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Weekly Goal (hours)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={weeklyGoalHours}
            onChange={(e) => setWeeklyGoalHours(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Available Hours/Day</Label>
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

      {/* Save */}
      <Button onClick={handleSave} disabled={profileLoading} className="gap-2">
        {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Profile
      </Button>
    </CardContent>
  );
}

export function StudyProfileSettings() {
  const { studyProfile, profileLoading, fetchStudyProfile, updateStudyProfile } = useAiStore();

  // Create a stable version key that changes when the profile object changes,
  // causing the form to remount with fresh initial values.
  const profileVersion = useMemo(
    () => (studyProfile ? JSON.stringify(studyProfile) : 'empty'),
    [studyProfile],
  );

  // Fetch on mount
  useState(() => { fetchStudyProfile(); });

  return (
    <Card className="bg-card border border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5 text-purple-500" />
          Study Profile
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up your study profile to get AI-powered study plans and recommendations.
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
