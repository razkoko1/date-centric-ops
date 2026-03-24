import { Button } from '@/components/ui/button';
import { Mic, Camera } from 'lucide-react';

interface DailyUpdateCTAProps {
  onClick: () => void;
}

export function DailyUpdateCTA({ onClick }: DailyUpdateCTAProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full h-14 text-base font-display font-semibold gap-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
      size="lg"
    >
      <div className="flex items-center gap-1.5">
        <Mic className="h-5 w-5" />
        <Camera className="h-5 w-5" />
      </div>
      עדכון יומי מהשטח
    </Button>
  );
}
