import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/;
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, Receipt, ImageIcon, ChevronLeft } from 'lucide-react';
import type { Project } from '@/data/mockData';
import { useState } from 'react';

interface DailyStatusSheetProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onChooseVoice: (projectId: string) => void;
  onChooseReceipt: (projectId: string) => void;
  onChooseMaterialImage: (projectId: string) => void;
}

export function DailyStatusSheet({ open, onClose, projects, onChooseVoice, onChooseReceipt, onChooseMaterialImage }: DailyStatusSheetProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (p: Project) => {
    setSelectedProject(p);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedProject(null);
    } else {
      onClose();
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      onClose();
      setTimeout(() => { setStep(1); setSelectedProject(null); }, 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0" dir="rtl">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button onClick={handleBack} className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors" aria-label="חזרה">
            <ArrowRight className="h-5 w-5 text-foreground" />
          </button>
          <SheetHeader className="flex-1 space-y-0">
            <SheetTitle className="font-display text-start">
              {step === 1 ? 'עדכון יומי' : selectedProject?.name}
            </SheetTitle>
            <SheetDescription className="text-start">
              {step === 1 ? 'בחר פרויקט' : 'בחר סוג עדכון'}
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-2">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className="w-full flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.98]"
                >
                  <span className="font-display font-semibold text-foreground text-sm">{p.name}</span>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground mb-4">מה תרצה לעדכן?</p>
              <ActionButton
                icon={<Mic className="h-6 w-6" />}
                label="הקלטה קולית"
                description="תאר מה קרה היום באתר"
                onClick={() => selectedProject && onChooseVoice(selectedProject.id)}
              />
              <ActionButton
                icon={<Receipt className="h-6 w-6" />}
                label="צילום קבלה"
                description="תעד הוצאה או רכישה"
                onClick={() => selectedProject && onChooseReceipt(selectedProject.id)}
              />
              <ActionButton
                icon={<ImageIcon className="h-6 w-6" />}
                label="צילום חומרים"
                description="תעד חומרים שהגיעו לאתר"
                onClick={() => selectedProject && onChooseMaterialImage(selectedProject.id)}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ActionButton({ icon, label, description, onClick }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="text-start">
        <p className="font-display font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}
