import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  userName?: string;
  isToday: boolean;
  formattedDate: string;
  stats: { projectsOnDayCount: number; tasksOnDayCount: number; equipmentItemsCount: number };
  onScrollToMaterials: () => void;
}

export function DashboardHeader({ userName, isToday, formattedDate, stats, onScrollToMaterials }: DashboardHeaderProps) {
  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <p className="text-muted-foreground text-sm font-body">
          {userName ? `שלום, ${userName} 👷` : 'שלום 👷'}
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground mt-1">
          {isToday ? 'היום' : formattedDate}
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="פרויקטים" value={stats.projectsOnDayCount} />
        <StatTile label="משימות" value={stats.tasksOnDayCount} />
        <StatTile
          label="ציוד וחומרים"
          value={stats.equipmentItemsCount}
          onClick={onScrollToMaterials}
          interactive
        />
      </div>
    </div>
  );
}

function StatTile({ label, value, onClick, interactive }: {
  label: string;
  value: number;
  onClick?: () => void;
  interactive?: boolean;
}) {
  const Comp = interactive ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-lg bg-card border border-border p-3 text-center transition-all",
        interactive && "cursor-pointer hover:border-primary hover:shadow-md active:scale-[0.97]"
      )}
      {...(interactive ? { 'aria-label': `${label}: ${value}` } : {})}
    >
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Comp>
  );
}
