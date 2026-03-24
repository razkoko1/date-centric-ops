import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DateNavigatorProps {
  formattedDate: string;
  isToday: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
}

export function DateNavigator({ formattedDate, isToday, onPrevDay, onNextDay, onGoToToday }: DateNavigatorProps) {
  return (
    <Card className="flex items-center justify-between p-3">
      <Button variant="ghost" size="icon" onClick={onNextDay} aria-label="יום הבא">
        <ChevronRight className="h-5 w-5" />
      </Button>
      <div className="text-center">
        <p className="font-display font-semibold text-foreground text-sm">{formattedDate}</p>
        {!isToday && (
          <button
            onClick={onGoToToday}
            className="text-xs text-primary font-medium hover:underline mt-0.5"
          >
            חזרה להיום
          </button>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onPrevDay} aria-label="יום קודם">
        <ChevronLeft className="h-5 w-5" />
      </Button>
    </Card>
  );
}
