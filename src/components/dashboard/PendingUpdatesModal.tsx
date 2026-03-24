import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Languages } from 'lucide-react';
import type { PendingUpdate } from '@/data/mockData';

interface PendingUpdatesModalProps {
  open: boolean;
  items: PendingUpdate[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onDiscard: (projectId: string, id: string) => void;
  onApply: () => void;
  onClose: () => void;
  onTranslate: (id: string) => void;
}

function formatUpdateText(item: PendingUpdate): string {
  const d = item.rawData;
  switch (item.type) {
    case 'status_update':
      return `עדכון סטטוס: "${d.taskName}" → ${d.newStatus}`;
    case 'gantt_shift':
      return `הזזת לוח זמנים: "${d.taskName}" — ${d.shiftDays} ימים`;
    case 'new_extra':
      return `תוספת חדשה: "${d.title}" — ₪${d.estimatedCost}`;
    default:
      return 'עדכון';
  }
}

export function PendingUpdatesModal({ open, items, selectedIds, onToggle, onDiscard, onApply, onClose, onTranslate }: PendingUpdatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[80vh] flex flex-col" dir="rtl" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="font-display">עדכונים ממתינים</DialogTitle>
          <DialogDescription>בחר את העדכונים שברצונך לאשר</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-2 py-2">
          {items.map(item => (
            <div key={item.id} className="flex items-start gap-3 rounded-md border border-border p-3 bg-card">
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={() => onToggle(item.id)}
                aria-label={`בחר עדכון: ${formatUpdateText(item)}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{formatUpdateText(item)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.projectName}</p>
                {item.sourceLogTextPreview && (
                  <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">
                    "{item.sourceLogTextPreview}"
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onTranslate(item.id)}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="תרגום"
                >
                  <Languages className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDiscard(item.projectId, item.id)}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="מחיקה"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>ביטול</Button>
          <Button onClick={onApply} disabled={selectedIds.size === 0}>
            אישור ({selectedIds.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
