import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/data/mockData';
import { STATUS_CONFIG } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface TaskFieldSheetProps {
  task: Task | null;
  projectName: string;
  onStatusChange: (status: TaskStatus) => void;
  onRecordVoice: () => void;
  onAddNote: (note: string) => void;
  onAddAddOn: (addOn: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ALL_STATUSES: TaskStatus[] = ['new', 'in_progress', 'done', 'stuck', 'cancelled', 'delayed'];

export function TaskFieldSheet({ task, projectName, onStatusChange, onRecordVoice, onAddNote, onAddAddOn, onSave, onCancel }: TaskFieldSheetProps) {
  const [noteInput, setNoteInput] = useState('');
  const [addOnInput, setAddOnInput] = useState('');

  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-h-[85vh] flex flex-col" dir="rtl" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="font-display">{task.title}</DialogTitle>
          <DialogDescription>{projectName} · {task.title}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-5 py-2">
          {/* Status selector */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">סטטוס</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.map(s => {
                const conf = STATUS_CONFIG[s];
                const active = task.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      active
                        ? `${conf.colorClass} text-primary-foreground border-transparent`
                        : "bg-card border-border text-foreground hover:border-primary/50"
                    )}
                    role="radio"
                    aria-checked={active}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice */}
          <Button variant="outline" className="w-full gap-2" onClick={onRecordVoice}>
            <Mic className="h-4 w-4" />
            הקלטה קולית
          </Button>
          <p className="text-xs text-muted-foreground -mt-3">תאר בקול מה קורה במשימה</p>

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">הערות</p>
            {task.notes && task.notes.length > 0 && (
              <ul className="space-y-1 mb-2">
                {task.notes.map((n, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-1.5">
                    <span className="text-muted-foreground">•</span>{n}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="הוסף הערה..."
                className="flex-1"
              />
              <Button size="icon" variant="outline" onClick={() => { onAddNote(noteInput); setNoteInput(''); }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">תוספות</p>
            {task.addOns && task.addOns.length > 0 && (
              <ul className="space-y-1 mb-2">
                {task.addOns.map((a, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-1.5">
                    <span className="text-muted-foreground">•</span>{a}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                value={addOnInput}
                onChange={e => setAddOnInput(e.target.value)}
                placeholder="הוסף תוספת..."
                className="flex-1"
              />
              <Button size="icon" variant="outline" onClick={() => { onAddAddOn(addOnInput); setAddOnInput(''); }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onCancel}>ביטול</Button>
          <Button onClick={onSave}>שמירה</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
