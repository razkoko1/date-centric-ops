import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PendingUpdatesBannerProps {
  count: number;
  onOpenModal: () => void;
}

export function PendingUpdatesBanner({ count, onOpenModal }: PendingUpdatesBannerProps) {
  if (count === 0) return null;
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-sm">עדכונים ממתינים לאישור</p>
            <p className="text-muted-foreground text-xs">{count} פריטים דורשים את תשומת לבך</p>
          </div>
        </div>
        <Button size="sm" onClick={onOpenModal}>
          צפייה
        </Button>
      </CardContent>
    </Card>
  );
}
