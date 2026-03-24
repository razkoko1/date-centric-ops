import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Package, RefreshCw } from 'lucide-react';
import type { Project, Task, Material } from '@/data/mockData';
import { STATUS_CONFIG, getTasksForProject, getMaterialsForTask } from '@/data/mockData';

interface AgendaSectionProps {
  projects: Project[];
  tasks: Task[];
  agendaTab: 'tasks' | 'materials';
  onTabChange: (tab: 'tasks' | 'materials') => void;
  onGoToProject: (projectId: string) => void;
  onOpenTaskSheet: (taskId: string) => void;
  onOpenLoadoutAllDay: () => void;
  onOpenLoadoutForTask: (projectId: string, taskId: string) => void;
  onToggleMaterialTaken: (materialId: string) => void;
  onRefreshMaterials: () => void;
}

export function AgendaSection({
  projects, tasks, agendaTab, onTabChange,
  onGoToProject, onOpenTaskSheet,
  onOpenLoadoutAllDay, onOpenLoadoutForTask,
  onToggleMaterialTaken, onRefreshMaterials,
}: AgendaSectionProps) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="font-display font-bold text-foreground text-lg">סדר יום</h2>
      <Tabs value={agendaTab} onValueChange={(v) => onTabChange(v as 'tasks' | 'materials')} dir="rtl">
        <TabsList className="w-full">
          <TabsTrigger value="tasks" className="flex-1">משימות</TabsTrigger>
          <TabsTrigger value="materials" className="flex-1">חומרים וציוד</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3 mt-3">
          {projects.map(project => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            if (projectTasks.length === 0) return null;
            return (
              <Card key={project.id}>
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {projectTasks.length} משימות
                      {project.phasesCount ? ` · ${project.phasesCount} שלבים` : ''}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => onGoToProject(project.id)}>
                    <ExternalLink className="h-3 w-3" />
                    פרויקט
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {projectTasks.map(task => {
                    const statusConf = STATUS_CONFIG[task.status];
                    const timeStr = task.startTime && task.endTime
                      ? `${task.startTime} — ${task.endTime}`
                      : 'כל היום';
                    return (
                      <button
                        key={task.id}
                        onClick={() => onOpenTaskSheet(task.id)}
                        className="w-full flex items-center gap-3 p-3 text-start hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono" dir="ltr">{timeStr}</span>
                            <span className="text-muted-foreground">—</span>
                            <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${statusConf.colorClass} text-primary-foreground text-[10px] px-2 py-0.5 shrink-0`}
                        >
                          {statusConf.label}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="materials" className="space-y-3 mt-3">
          <Button variant="outline" className="w-full gap-2" onClick={onOpenLoadoutAllDay}>
            <Package className="h-4 w-4" />
            כל הציוד והחומרים להיום
          </Button>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={onRefreshMaterials}>
              <RefreshCw className="h-3 w-3" />
              רענון
            </Button>
          </div>
          {projects.map(project => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            return (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold text-foreground text-sm">{project.name}</p>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => onGoToProject(project.id)}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                {projectTasks.map(task => {
                  const materials = getMaterialsForTask(task.id);
                  if (materials.length === 0) return null;
                  const mats = materials.filter(m => m.itemType === 'material');
                  const tools = materials.filter(m => m.itemType === 'tool');
                  return (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => onOpenLoadoutForTask(project.id, task.id)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        {mats.length > 0 && (
                          <MaterialTable title="חומרים" items={mats} onToggle={onToggleMaterialTaken} />
                        )}
                        {tools.length > 0 && (
                          <MaterialTable title="כלים" items={tools} onToggle={onToggleMaterialTaken} />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MaterialTable({ title, items, onToggle }: { title: string; items: Material[]; onToggle: (id: string) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">{title}</p>
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 text-sm py-1">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={item.taken}
                onCheckedChange={() => onToggle(item.id)}
                aria-label={`${item.name} נלקח`}
              />
            </div>
            <span className={`flex-1 ${item.taken ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
            {item.estimatedTotalCostNis && (
              <span className="text-xs font-medium text-foreground">₪{item.estimatedTotalCostNis.toLocaleString()}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
