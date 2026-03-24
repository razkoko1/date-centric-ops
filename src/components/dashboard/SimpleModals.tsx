import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Receipt, ImageIcon } from 'lucide-react';

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  projectName: string;
}

export function VoiceLogModal({ open, onClose, onSubmit, projectName }: SimpleModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent dir="rtl" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            הקלטה קולית
          </DialogTitle>
          <DialogDescription>{projectName}</DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">לחץ להתחלת הקלטה</p>
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>ביטול</Button>
          <Button onClick={onSubmit}>שמירה</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReceiptUploadModal({ open, onClose, onSubmit, projectName }: SimpleModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent dir="rtl" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            צילום קבלה
          </DialogTitle>
          <DialogDescription>{projectName}</DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center gap-4">
          <div className="h-32 w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">גרור תמונה או לחץ לצילום</p>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>ביטול</Button>
          <Button onClick={onSubmit}>שליחה</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MaterialImageModal({ open, onClose, onSubmit, projectName }: SimpleModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent dir="rtl" aria-modal="true">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            צילום חומרים
          </DialogTitle>
          <DialogDescription>{projectName}</DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center gap-4">
          <div className="h-32 w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">צלם את החומרים שהגיעו לאתר</p>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>ביטול</Button>
          <Button onClick={onSubmit}>שליחה</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
