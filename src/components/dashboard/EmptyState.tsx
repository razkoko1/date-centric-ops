import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, CalendarDays } from 'lucide-react';

interface EmptyStateProps {
  variant: 'no-projects' | 'no-projects-on-day';
  allProjectsCount?: number;
  onNavigate: (path: string) => void;
}

export function EmptyState({ variant, allProjectsCount = 0, onNavigate }: EmptyStateProps) {
  if (variant === 'no-projects') {
    return (
      <Card className="border-dashed border-2 border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-foreground font-display font-semibold text-lg mb-1">אין פרויקטים עדיין</p>
          <p className="text-muted-foreground text-sm mb-4">צור את תוכנית העבודה הראשונה שלך</p>
          <Button onClick={() => onNavigate('/work-plan')}>
            מעבר לתוכנית עבודה
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-border">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-foreground font-display font-semibold text-lg mb-1">אין פרויקטים מתוכננים ליום זה</p>
        <p className="text-muted-foreground text-sm mb-4">
          יש לך {allProjectsCount} פרויקטים פעילים
        </p>
        <Button variant="secondary" onClick={() => onNavigate('/projects')}>
          צפייה בכל הפרויקטים
        </Button>
      </CardContent>
    </Card>
  );
}
