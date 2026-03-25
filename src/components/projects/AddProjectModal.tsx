import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MOCK_CHAR_PHASES,
  MOCK_PLAN_RESULT,
  type CharPhase,
  type PlanResult,
} from '@/data/projectsData';
import {
  FileText, Mic, Upload, ArrowRight, ArrowLeft, X, Loader2, AlertCircle,
  GripVertical, Pencil, Trash2, Plus, ChevronDown, ChevronUp, MapPin, Check,
} from 'lucide-react';

type AddMode = 'choose' | 'text' | 'voice' | 'boq' | 'clarify' | 'plan';
type VoiceState = 'idle' | 'recording' | 'transcribing' | 'transcribed';
type PlanStep = 'ui_setup' | 'phase_questions' | 'clarifying' | 'ready';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddProjectModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<AddMode>('choose');

  // Text
  const [text, setText] = useState('');

  // Voice
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');

  // BoQ
  const [fileName, setFileName] = useState<string | null>(null);
  const [showColumnMapping, setShowColumnMapping] = useState(false);
  const [colDesc, setColDesc] = useState(0);
  const [colQty, setColQty] = useState<number | undefined>(1);
  const [colUnit, setColUnit] = useState<number | undefined>(2);
  const mockHeaders = ['תיאור', 'כמות', 'יחידה', 'מס פריט'];
  const mockItems = [
    { description: 'קרמיקה 60×60', quantity: '25', unit: 'מ"ר' },
    { description: 'דבק לאריחים', quantity: '10', unit: 'שק' },
    { description: 'פרופילי אלומיניום', quantity: '15', unit: 'יח׳' },
  ];

  // Clarify
  const [clarifyStep, setClarifyStep] = useState(0);
  const [clarifyMainGoal, setClarifyMainGoal] = useState('');
  const [clarifyLocation, setClarifyLocation] = useState('');
  const [clarifyScope, setClarifyScope] = useState('');
  const [clarifyTiming, setClarifyTiming] = useState('');
  const [clarifyNotes, setClarifyNotes] = useState('');

  // Plan
  const [planStep, setPlanStep] = useState<PlanStep>('ui_setup');
  const [identifiedPhases, setIdentifiedPhases] = useState<string[]>(['הריסה והכנה', 'אינסטלציה', 'חשמל', 'ריצוף וחיפוי', 'צביעה וגמר']);
  const [phaseNotes, setPhaseNotes] = useState<Record<string, string>>({});
  const [showPhaseNote, setShowPhaseNote] = useState<Record<string, boolean>>({});
  const [phaseAllocations, setPhaseAllocations] = useState<Record<string, { selfExecute: boolean; teamSize: number }>>({});
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editPhaseValue, setEditPhaseValue] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');
  const [addingPhase, setAddingPhase] = useState(false);
  const [activePhaseTab, setActivePhaseTab] = useState(0);
  const [phaseAnswers, setPhaseAnswers] = useState<Record<string, string | number | boolean | string[]>>({});
  const [phaseGeneralNotes, setPhaseGeneralNotes] = useState<Record<number, string>>({});
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({});
  const [planReply, setPlanReply] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charPhases = MOCK_CHAR_PHASES;
  const planPlan = MOCK_PLAN_RESULT;

  const planSteps: { key: PlanStep; label: string }[] = [
    { key: 'ui_setup', label: 'שלבים' },
    { key: 'phase_questions', label: 'אפיון' },
    { key: 'clarifying', label: 'הבהרות' },
    { key: 'ready', label: 'סיכום' },
  ];

  const resetAll = () => {
    setMode('choose');
    setText('');
    setVoiceState('idle');
    setTranscript('');
    setFileName(null);
    setShowColumnMapping(false);
    setClarifyStep(0);
    setPlanStep('ui_setup');
    setProcessing(false);
    setError(null);
    setProjectLocation('');
    setPlanReply('');
    setActivePhaseTab(0);
    setPhaseAnswers({});
    setAddingPhase(false);
    setEditingPhase(null);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <Button variant="ghost" size="sm" onClick={onClick} className="gap-1">
      <ArrowRight className="h-4 w-4" />
      חזרה
    </Button>
  );

  // Processing overlay
  if (processing) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">מעבד את הנתונים...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error overlay
  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={() => setError(null)}>חזרה</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* MODE: CHOOSE */}
        {mode === 'choose' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">הוספת פרויקט חדש</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">כיצד תרצה לתאר את הפרויקט?</p>
            <div className="space-y-3">
              <button
                onClick={() => { setMode('text'); console.log('onChooseText'); }}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-start"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">תיאור טקסט</p>
                  <p className="text-xs text-muted-foreground">כתוב תיאור חופשי של הפרויקט</p>
                </div>
              </button>
              <button
                onClick={() => { setMode('voice'); console.log('onChooseVoice'); }}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-start"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Mic className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">הקלטה קולית</p>
                  <p className="text-xs text-muted-foreground">הקלט תיאור קולי ונמיר אותו לטקסט</p>
                </div>
              </button>
              <button
                onClick={() => { setMode('boq'); console.log('onChooseBoq'); }}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-start"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">כתב כמויות</p>
                  <p className="text-xs text-muted-foreground">העלה קובץ כתב כמויות (Excel, CSV)</p>
                </div>
              </button>
            </div>
            <Button variant="ghost" className="w-full" onClick={handleClose}>ביטול</Button>
          </div>
        )}

        {/* MODE: TEXT */}
        {mode === 'text' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">תיאור הפרויקט</DialogTitle>
            </DialogHeader>
            <BackButton onClick={() => setMode('choose')} />
            <p className="text-sm text-muted-foreground">תאר את העבודה המתוכננת בכמה משפטים</p>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="למשל: שיפוץ כללי של דירת 4 חדרים, כולל החלפת אינסטלציה, חשמל חדש, ריצוף וצביעה..."
              className="min-h-[120px]"
            />
            <div className="flex gap-2">
              <Button
                disabled={!text.trim()}
                className="flex-1"
                onClick={() => { console.log('onContinueText', text); setMode('plan'); }}
              >
                המשך עם תכנון AI
              </Button>
              <Button
                variant="outline"
                disabled={!text.trim()}
                className="flex-1"
                onClick={() => { console.log('onContinueText (clarify)', text); setMode('clarify'); }}
              >
                שאלון קצר
              </Button>
            </div>
          </div>
        )}

        {/* MODE: VOICE */}
        {mode === 'voice' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">הקלטה קולית</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-6 gap-4">
              {voiceState === 'idle' && (
                <button
                  onClick={() => { setVoiceState('recording'); console.log('onStartRecording'); }}
                  className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  aria-label="התחל הקלטה"
                >
                  <Mic className="h-8 w-8 text-destructive" />
                </button>
              )}
              {voiceState === 'recording' && (
                <>
                  <button
                    onClick={() => { setVoiceState('transcribing'); console.log('onStopRecording'); setTimeout(() => { setVoiceState('transcribed'); setTranscript('שיפוץ כללי של דירת 3 חדרים ברחוב סוקולוב. צריך להחליף את כל האינסטלציה, חשמל חדש מהלוח, ריצוף בכל הדירה ובסוף צביעה מלאה.'); }, 1500); }}
                    className="w-20 h-20 rounded-full bg-destructive animate-pulse flex items-center justify-center"
                    aria-label="עצור הקלטה"
                  >
                    <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
                  </button>
                  <p className="text-sm text-destructive font-medium">מקליט...</p>
                </>
              )}
              {voiceState === 'transcribing' && (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">ממיר לטקסט...</p>
                </>
              )}
              {voiceState === 'transcribed' && (
                <div className="w-full space-y-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => { setVoiceState('idle'); setTranscript(''); console.log('onRecordAgain'); }}>
                      הקלט שוב
                    </Button>
                    <Button className="flex-1" onClick={() => { console.log('onContinueAfterVoice'); setText(transcript); setMode('plan'); }}>
                      המשך
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full" onClick={handleClose}>ביטול</Button>
          </div>
        )}

        {/* MODE: BOQ */}
        {mode === 'boq' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">כתב כמויות</DialogTitle>
            </DialogHeader>
            <BackButton onClick={() => setMode('choose')} />

            {!fileName ? (
              <button
                onClick={() => { setFileName('bill_of_quantities.xlsx'); console.log('onPickFile'); }}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">לחץ לבחירת קובץ או גרור לכאן</p>
                <p className="text-xs text-muted-foreground">Excel, CSV</p>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                  <span className="text-sm text-foreground">{fileName}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFileName(null); setShowColumnMapping(false); console.log('onReplaceFile'); }}>
                    החלף קובץ
                  </Button>
                </div>

                {showColumnMapping ? (
                  <div className="space-y-3 rounded-lg border border-border p-3">
                    <p className="text-sm font-medium text-foreground">מיפוי עמודות</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16 shrink-0">תיאור *</span>
                        <Select value={String(colDesc)} onValueChange={v => setColDesc(Number(v))}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {mockHeaders.map((h, i) => <SelectItem key={i} value={String(i)} className="text-xs">{h}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16 shrink-0">כמות</span>
                        <Select value={colQty !== undefined ? String(colQty) : ''} onValueChange={v => setColQty(v ? Number(v) : undefined)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            {mockHeaders.map((h, i) => <SelectItem key={i} value={String(i)} className="text-xs">{h}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16 shrink-0">יחידה</span>
                        <Select value={colUnit !== undefined ? String(colUnit) : ''} onValueChange={v => setColUnit(v ? Number(v) : undefined)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            {mockHeaders.map((h, i) => <SelectItem key={i} value={String(i)} className="text-xs">{h}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => { setShowColumnMapping(false); console.log('onConfirmMapping'); }}>
                      החל מיפוי
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => { setShowColumnMapping(true); console.log('onOpenMapping'); }}>
                    עריכת מיפוי עמודות
                  </Button>
                )}

                {/* Preview table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-start text-muted-foreground font-medium">#</th>
                        <th className="p-2 text-start text-muted-foreground font-medium">תיאור</th>
                        <th className="p-2 text-start text-muted-foreground font-medium">כמות</th>
                        <th className="p-2 text-start text-muted-foreground font-medium">יחידה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockItems.map((item, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-2 text-muted-foreground">{i + 1}</td>
                          <td className="p-2 text-foreground">{item.description}</td>
                          <td className="p-2 text-foreground">{item.quantity}</td>
                          <td className="p-2 text-muted-foreground">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground p-2 bg-muted/50">מציג 3 מתוך 3 שורות</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1" onClick={() => { setFileName(null); setMode('choose'); console.log('onCancelBoq'); }}>
                    ביטול
                  </Button>
                  <Button className="flex-1" onClick={() => { console.log('onContinueBoq'); setMode('plan'); }}>
                    המשך
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE: CLARIFY WIZARD */}
        {mode === 'clarify' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">שאלון מהיר</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>שלב {Math.min(clarifyStep + 1, 5)} מתוך 5</span>
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden ms-2">
                <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${((clarifyStep + 1) / 5) * 100}%` }} />
              </div>
            </div>

            {/* User text snippet */}
            {text && (
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border border-border">
                <p className="font-medium text-foreground text-xs mb-1">התיאור שלך:</p>
                <p className="line-clamp-2">{text}</p>
              </div>
            )}

            {clarifyStep === 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">מה המטרה העיקרית?</h3>
                <p className="text-xs text-muted-foreground">תאר בקצרה את מטרת הפרויקט</p>
                <Textarea value={clarifyMainGoal} onChange={e => setClarifyMainGoal(e.target.value)} placeholder="שיפוץ מלא, הרחבה, בנייה חדשה..." />
              </div>
            )}
            {clarifyStep === 1 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">מיקום הפרויקט</h3>
                <p className="text-xs text-muted-foreground">כתובת או אזור העבודה</p>
                <Textarea value={clarifyLocation} onChange={e => setClarifyLocation(e.target.value)} placeholder="רחוב, עיר..." />
              </div>
            )}
            {clarifyStep === 2 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">היקף העבודה</h3>
                <p className="text-xs text-muted-foreground">תאר את גודל ומורכבות הפרויקט</p>
                <Textarea value={clarifyScope} onChange={e => setClarifyScope(e.target.value)} placeholder="שטח, מספר חדרים, קומות..." />
              </div>
            )}
            {clarifyStep === 3 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">לו"ז משוער</h3>
                <p className="text-xs text-muted-foreground">מתי תרצה להתחיל ולסיים?</p>
                <Textarea value={clarifyTiming} onChange={e => setClarifyTiming(e.target.value)} placeholder="תאריך התחלה, משך מתוכנן..." />
              </div>
            )}
            {clarifyStep === 4 && (
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">סיכום</h3>
                <p className="text-xs text-muted-foreground">סקירה של המידע שהזנת. לחץ ״סיום״ ליצירת הפרויקט.</p>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {[
                    { label: 'מטרה', value: clarifyMainGoal },
                    { label: 'מיקום', value: clarifyLocation },
                    { label: 'היקף', value: clarifyScope },
                    { label: 'לו"ז', value: clarifyTiming },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">{label}:</span>
                      <span className="text-foreground">{value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => clarifyStep === 0 ? setMode('text') : setClarifyStep(s => s - 1)}>
                חזרה
              </Button>
              {clarifyStep < 4 ? (
                <Button className="flex-1" onClick={() => { setClarifyStep(s => s + 1); console.log('onNextStep', clarifyStep); }}>
                  המשך
                </Button>
              ) : (
                <Button className="flex-1" onClick={() => { console.log('onFinalizeClarify', { clarifyMainGoal, clarifyLocation, clarifyScope, clarifyTiming }); handleClose(); }}>
                  סיום ויצירת פרויקט
                </Button>
              )}
            </div>
          </div>
        )}

        {/* MODE: PLAN WIZARD */}
        {mode === 'plan' && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-display">תכנון פרויקט עם AI</DialogTitle>
            </DialogHeader>

            {/* Step indicator */}
            <div className="flex gap-1">
              {planSteps.map((s, i) => (
                <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-1.5 w-full rounded-full ${planSteps.findIndex(ps => ps.key === planStep) >= i ? 'bg-primary' : 'bg-muted'}`} />
                  <span className={`text-[10px] ${planStep === s.key ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* PLAN STEP: ui_setup */}
            {planStep === 'ui_setup' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">סדר, ערוך ותכנן את שלבי הפרויקט</p>

                <div className="space-y-2">
                  {identifiedPhases.map((phase, i) => {
                    const alloc = phaseAllocations[phase] || { selfExecute: true, teamSize: 2 };
                    return (
                      <div key={phase} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                          {editingPhase === phase ? (
                            <div className="flex items-center gap-1 flex-1">
                              <Input
                                value={editPhaseValue}
                                onChange={e => setEditPhaseValue(e.target.value)}
                                className="h-7 text-sm"
                                autoFocus
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    setIdentifiedPhases(prev => prev.map((p, idx) => idx === i ? editPhaseValue : p));
                                    setEditingPhase(null);
                                    console.log('onRenamePhase', phase, editPhaseValue);
                                  }
                                }}
                              />
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => {
                                setIdentifiedPhases(prev => prev.map((p, idx) => idx === i ? editPhaseValue : p));
                                setEditingPhase(null);
                              }}>
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="flex-1 text-sm font-medium text-foreground">{phase}</span>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingPhase(phase); setEditPhaseValue(phase); }}>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => {
                            setShowPhaseNote(prev => ({ ...prev, [phase]: !prev[phase] }));
                            console.log('onTogglePhaseNote', phase);
                          }}>
                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showPhaseNote[phase] ? 'rotate-180' : ''}`} />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => {
                            setIdentifiedPhases(prev => prev.filter((_, idx) => idx !== i));
                            console.log('onDeletePhase', phase);
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Allocation */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">ביצוע:</span>
                          <button
                            className={`px-2 py-0.5 rounded-full text-xs ${alloc.selfExecute ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                            onClick={() => setPhaseAllocations(prev => ({ ...prev, [phase]: { ...alloc, selfExecute: true } }))}
                          >עצמי</button>
                          <button
                            className={`px-2 py-0.5 rounded-full text-xs ${!alloc.selfExecute ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
                            onClick={() => setPhaseAllocations(prev => ({ ...prev, [phase]: { ...alloc, selfExecute: false } }))}
                          >קבלן משנה</button>
                          {alloc.selfExecute && (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-muted-foreground">צוות:</span>
                              <Slider
                                value={[alloc.teamSize]}
                                min={1} max={10} step={1}
                                onValueChange={([v]) => setPhaseAllocations(prev => ({ ...prev, [phase]: { ...alloc, teamSize: v } }))}
                                className="flex-1"
                              />
                              <span className="text-foreground font-medium w-4 text-center">{alloc.teamSize}</span>
                            </div>
                          )}
                        </div>

                        {showPhaseNote[phase] && (
                          <Textarea
                            value={phaseNotes[phase] || ''}
                            onChange={e => setPhaseNotes(prev => ({ ...prev, [phase]: e.target.value }))}
                            placeholder="הערות לשלב..."
                            className="min-h-[60px] text-sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add phase */}
                {addingPhase ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newPhaseName}
                      onChange={e => setNewPhaseName(e.target.value)}
                      placeholder="שם השלב..."
                      className="h-8 text-sm flex-1"
                      autoFocus
                    />
                    <Button size="sm" className="h-8" onClick={() => {
                      if (newPhaseName.trim()) {
                        setIdentifiedPhases(prev => [...prev, newPhaseName.trim()]);
                        setNewPhaseName('');
                        setAddingPhase(false);
                        console.log('onAddPhase', newPhaseName);
                      }
                    }}>הוסף</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => { setAddingPhase(false); setNewPhaseName(''); }}>ביטול</Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddingPhase(true)}>
                    <Plus className="h-3.5 w-3.5" />
                    הוסף שלב
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setMode('choose')}>
                    <ArrowRight className="h-4 w-4 me-1" />
                    חזרה
                  </Button>
                  <Button className="flex-1" onClick={() => { setPlanStep('phase_questions'); console.log('onSubmitPhaseAllocations'); }}>
                    המשך לאפיון
                  </Button>
                </div>
              </div>
            )}

            {/* PLAN STEP: phase_questions */}
            {planStep === 'phase_questions' && (
              <div className="space-y-3">
                {/* Phase tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1" role="tablist">
                  {charPhases.map((cp, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={activePhaseTab === i}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0 transition-colors ${activePhaseTab === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                      onClick={() => { setActivePhaseTab(i); console.log('onSelectPhaseTab', i); }}
                    >{cp.phaseTitle}</button>
                  ))}
                </div>

                {/* Questions */}
                <div className="space-y-4" role="tabpanel">
                  {charPhases[activePhaseTab]?.questions.map(q => (
                    <div key={q.id} className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">{q.label}</label>

                      {q.type === 'slider' && (
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[Number(phaseAnswers[q.id] ?? q.defaultValue ?? q.min ?? 0)]}
                            min={q.min} max={q.max} step={q.step}
                            onValueChange={([v]) => setPhaseAnswers(prev => ({ ...prev, [q.id]: v }))}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-foreground w-12 text-center">
                            {phaseAnswers[q.id] ?? q.defaultValue} {q.unit}
                          </span>
                        </div>
                      )}

                      {q.type === 'toggle' && (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(phaseAnswers[q.id] ?? q.defaultValue)}
                            onCheckedChange={v => setPhaseAnswers(prev => ({ ...prev, [q.id]: v }))}
                          />
                          <span className="text-xs text-muted-foreground">{phaseAnswers[q.id] ?? q.defaultValue ? 'כן' : 'לא'}</span>
                        </div>
                      )}

                      {q.type === 'select' && q.options && (
                        <div className="flex flex-wrap gap-1.5">
                          {q.options.map(opt => (
                            <button
                              key={opt}
                              className={`px-3 py-1 rounded-full text-xs transition-colors ${phaseAnswers[q.id] === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                              onClick={() => setPhaseAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            >{opt}</button>
                          ))}
                        </div>
                      )}

                      {q.type === 'checkbox' && q.options && (
                        <div className="flex flex-wrap gap-1.5">
                          {q.options.map(opt => {
                            const selected = Array.isArray(phaseAnswers[q.id]) ? (phaseAnswers[q.id] as string[]) : [];
                            const isChecked = selected.includes(opt);
                            return (
                              <button
                                key={opt}
                                className={`px-3 py-1 rounded-full text-xs transition-colors ${isChecked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setPhaseAnswers(prev => ({
                                  ...prev,
                                  [q.id]: isChecked ? selected.filter(s => s !== opt) : [...selected, opt],
                                }))}
                              >{opt}</button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'open' && (
                        <Input
                          value={String(phaseAnswers[q.id] ?? '')}
                          onChange={e => setPhaseAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={q.placeholder}
                          className="text-sm"
                        />
                      )}
                    </div>
                  ))}

                  {/* General notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">הערות כלליות לשלב</label>
                    <Textarea
                      value={phaseGeneralNotes[activePhaseTab] || ''}
                      onChange={e => setPhaseGeneralNotes(prev => ({ ...prev, [activePhaseTab]: e.target.value }))}
                      placeholder="הערות..."
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {activePhaseTab > 0 ? (
                    <Button variant="ghost" onClick={() => { setActivePhaseTab(t => t - 1); console.log('onPrevPhaseQuestionnaire'); }}>
                      <ArrowRight className="h-4 w-4 me-1" />
                      הקודם
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => setPlanStep('ui_setup')}>
                      <ArrowRight className="h-4 w-4 me-1" />
                      חזרה
                    </Button>
                  )}
                  {activePhaseTab < charPhases.length - 1 ? (
                    <Button className="flex-1" onClick={() => { setActivePhaseTab(t => t + 1); console.log('onNextPhaseQuestionnaire'); }}>
                      הבא
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={() => { setPlanStep('clarifying'); console.log('onSubmitQuestionnaire'); }}>
                      סיום ובניית תוכנית
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* PLAN STEP: clarifying */}
            {planStep === 'clarifying' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">שאלת הבהרה מ-AI:</p>
                  <p className="text-sm text-foreground">האם יש גישה חופשית לחניה בסמוך לאתר? זה ישפיע על תכנון הובלת חומרים וציוד כבד.</p>
                </div>
                <Textarea
                  value={planReply}
                  onChange={e => setPlanReply(e.target.value)}
                  placeholder="התשובה שלך..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setPlanStep('phase_questions')}>
                    <ArrowRight className="h-4 w-4 me-1" />
                    חזרה
                  </Button>
                  <Button className="flex-1" onClick={() => { console.log('onSubmitClarifyingReply', planReply); setPlanStep('ready'); }}>
                    שלח
                  </Button>
                </div>
              </div>
            )}

            {/* PLAN STEP: ready */}
            {planStep === 'ready' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h3 className="font-semibold text-foreground text-lg">{planPlan.projectName}</h3>
                  {planPlan.description && <p className="text-sm text-muted-foreground">{planPlan.description}</p>}

                  {planPlan.totalEstimatedBudgetNis && (
                    <div className="flex items-center justify-between py-2 border-y border-border">
                      <span className="text-sm text-muted-foreground">תקציב משוער</span>
                      <span className="font-bold text-foreground text-lg">₪{planPlan.totalEstimatedBudgetNis.toLocaleString()}</span>
                    </div>
                  )}

                  {planPlan.phases && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">שלבים</p>
                      {planPlan.phases.map((ph, i) => {
                        const phaseCost = ph.tasks?.reduce((s, t) => s + (t.estimatedCostNis || 0), 0) || 0;
                        return (
                          <div key={i} className="flex items-center justify-between text-sm py-1">
                            <span className="text-foreground">{ph.title}</span>
                            <div className="flex items-center gap-2">
                              {ph.tasks && <span className="text-xs text-muted-foreground">{ph.tasks.length} משימות</span>}
                              {phaseCost > 0 && <span className="text-xs font-medium text-foreground">₪{phaseCost.toLocaleString()}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {planPlan.collaborations && planPlan.collaborations.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">שיתופי פעולה נדרשים</p>
                      {planPlan.collaborations.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1">
                          <span className="text-foreground">{c.tradeNeeded}</span>
                          <span className="text-xs font-medium text-foreground">₪{c.estimatedBudgetNis.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location (required) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    מיקום הפרויקט *
                  </label>
                  <Input
                    value={projectLocation}
                    onChange={e => { setProjectLocation(e.target.value); console.log('onLocationChange', e.target.value); }}
                    placeholder="הכנס כתובת או אזור..."
                    className="text-sm"
                  />
                  {!projectLocation && <p className="text-xs text-destructive">שדה חובה</p>}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setPlanStep('clarifying')}>
                    <ArrowRight className="h-4 w-4 me-1" />
                    חזרה
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!projectLocation.trim()}
                    onClick={() => { console.log('onCreateProjectFromPlan', { planPlan, projectLocation }); handleClose(); }}
                  >
                    צור פרויקט
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
