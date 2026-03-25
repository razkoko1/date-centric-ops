import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Languages, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MOCK_PROJECT_DETAIL,
  MOCK_PROJECT_TASKS,
  MOCK_DETAIL_MATERIALS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  type ProjectTask,
  type ProjectPhase,
} from '@/data/projectDetailData';
import type { Material } from '@/data/mockData';

const ORPHAN_PHASE_KEY = '__none__';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isHydrating] = useState(false);

  // Mock: only p1 has detail data
  const project = projectId === 'p1' ? MOCK_PROJECT_DETAIL : null;
  const allTasks = projectId === 'p1' ? MOCK_PROJECT_TASKS : [];

  const [taskStatuses, setTaskStatuses] = useState<Record<string, ProjectTask['status']>>(() => {
    const map: Record<string, ProjectTask['status']> = {};
    allTasks.forEach(t => { map[t.id] = t.status; });
    return map;
  });
  const [takenState, setTakenState] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    Object.values(MOCK_DETAIL_MATERIALS).flat().forEach(m => { map[m.id] = !!m.taken; });
    return map;
  });

  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => new Set(['ph1', 'ph2']));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const onTogglePhase = useCallback((key: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const onToggleTask = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  }, []);

  const onTaskStatusChange = useCallback((taskId: string, newStatus: ProjectTask['status']) => {
    console.log('onTaskStatusChange', taskId, newStatus);
    setTaskStatuses(prev => ({ ...prev, [taskId]: newStatus }));
  }, []);

  const onToggleMaterialTaken = useCallback((materialId: string, checked: boolean) => {
    console.log('onToggleMaterialTaken', materialId, checked);
    setTakenState(prev => ({ ...prev, [materialId]: checked }));
  }, []);

  const onOpenWorkPlan = useCallback(() => console.log('onOpenWorkPlan', projectId), [projectId]);
  const onTranslateProjectName = useCallback(() => console.log('onTranslateProjectName'), []);
  const onTranslateTaskTitle = useCallback((taskId: string) => console.log('onTranslateTaskTitle', taskId), [taskId]);

  // Group tasks by phase
  const phaseGroups = useMemo(() => {
    const phases = project?.phases?.sort((a, b) => a.order - b.order) || [];
    const groups: { key: string; title: string; tasks: ProjectTask[] }[] = [];

    for (const phase of phases) {
      groups.push({
        key: phase.id,
        title: phase.title,
        tasks: allTasks.filter(t => t.phaseId === phase.id),
      });
    }

    const orphans = allTasks.filter(t => !t.phaseId);
    if (orphans.length > 0) {
      groups.push({ key: ORPHAN_PHASE_KEY, title: 'ללא שלב', tasks: orphans });
    }

    return groups;
  }, [project, allTasks]);

  // Not found / loading
  if (!projectId) return <NotFoundMessage text="מזהה פרויקט חסר" />;
  if (isHydrating) return <LoadingMessage />;
  if (!project) return <NotFoundMessage text="הפרויקט לא נמצא" />;

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Link to="/projects" className="shrink-0">
                <Button variant="ghost" size="icon" aria-label="חזרה לפרויקטים">
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold font-display text-foreground truncate">{project.name}</h1>
              <button
                onClick={onTranslateProjectName}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="תרגום שם פרויקט"
              >
                <Languages className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenWorkPlan} className="shrink-0 gap-1.5">
            <ExternalLink className="h-4 w-4" />
            <span>תוכנית עבודה</span>
          </Button>
        </div>

        {/* Phase list */}
        <div className="space-y-3">
          {phaseGroups.map(group => (
            <PhaseBlock
              key={group.key}
              phaseKey={group.key}
              title={group.title}
              tasks={group.tasks}
              taskStatuses={taskStatuses}
              takenState={takenState}
              isExpanded={expandedPhases.has(group.key)}
              expandedTasks={expandedTasks}
              onTogglePhase={onTogglePhase}
              onToggleTask={onToggleTask}
              onTaskStatusChange={onTaskStatusChange}
              onToggleMaterialTaken={onToggleMaterialTaken}
              onTranslateTaskTitle={onTranslateTaskTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Phase Block ─── */
function PhaseBlock({
  phaseKey, title, tasks, taskStatuses, takenState, isExpanded, expandedTasks,
  onTogglePhase, onToggleTask, onTaskStatusChange, onToggleMaterialTaken, onTranslateTaskTitle,
}: {
  phaseKey: string;
  title: string;
  tasks: ProjectTask[];
  taskStatuses: Record<string, ProjectTask['status']>;
  takenState: Record<string, boolean>;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  onTogglePhase: (key: string) => void;
  onToggleTask: (id: string) => void;
  onTaskStatusChange: (id: string, s: ProjectTask['status']) => void;
  onToggleMaterialTaken: (id: string, c: boolean) => void;
  onTranslateTaskTitle: (id: string) => void;
}) {
  const total = tasks.length;
  const doneCount = tasks.filter(t => (taskStatuses[t.id] || t.status) === 'done').length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => onTogglePhase(phaseKey)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'כווץ' : 'הרחב'} ${title}`}
      >
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? '' : '-rotate-90 rtl:rotate-90'}`} />
        <span className="flex-1 text-start font-display font-semibold text-sm text-card-foreground truncate">{title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <Progress value={pct} className="w-16 h-2" />
          <span className="text-xs text-muted-foreground font-body whitespace-nowrap">{doneCount}/{total}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          {total === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">אין משימות בשלב זה</p>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentStatus={taskStatuses[task.id] || task.status}
                  takenState={takenState}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggle={() => onToggleTask(task.id)}
                  onStatusChange={(s) => onTaskStatusChange(task.id, s)}
                  onToggleMaterialTaken={onToggleMaterialTaken}
                  onTranslate={() => onTranslateTaskTitle(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Task Row ─── */
function TaskRow({
  task, currentStatus, takenState, isExpanded, onToggle, onStatusChange, onToggleMaterialTaken, onTranslate,
}: {
  task: ProjectTask;
  currentStatus: ProjectTask['status'];
  takenState: Record<string, boolean>;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (s: ProjectTask['status']) => void;
  onToggleMaterialTaken: (id: string, c: boolean) => void;
  onTranslate: () => void;
}) {
  const materials = MOCK_DETAIL_MATERIALS[task.id] || [];
  const hasMaterials = materials.length > 0;

  const effortLine = useMemo(() => {
    const parts: string[] = [];
    if (task.estimatedHours) parts.push(`${task.estimatedHours} שעות`);
    if (task.durationDays) parts.push(`${task.durationDays} ימי עבודה`);
    else if (task.estimatedHours && task.estimatedHours >= 9) parts.push(`~${Math.round(task.estimatedHours / 9)} ימי עבודה`);
    return parts.join(' · ');
  }, [task.estimatedHours, task.durationDays]);

  const showExtraBadge = task.isExtra || (task.isExtraApproved && task.extraCostNis && task.extraCostNis > 0);

  return (
    <div className="bg-card">
      {/* Collapsed row */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={onToggle}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'כווץ' : 'הרחב'} ${task.title}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? '' : '-rotate-90 rtl:rotate-90'}`} />
        </button>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-card-foreground truncate">{task.title}</span>
            <button onClick={(e) => { e.stopPropagation(); onTranslate(); }} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="תרגום">
              <Languages className="h-3.5 w-3.5" />
            </button>
            {showExtraBadge && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary whitespace-nowrap">תוספת</Badge>
            )}
          </div>
          {task.extraTitle && <p className="text-xs text-muted-foreground truncate">{task.extraTitle}</p>}
          {effortLine && <p className="text-xs text-muted-foreground">{effortLine}</p>}
        </div>

        {/* Status select */}
        <select
          value={currentStatus}
          onChange={(e) => { e.stopPropagation(); onStatusChange(e.target.value as ProjectTask['status']); }}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs rounded-md border border-border bg-card px-2 py-1 text-card-foreground focus:ring-1 focus:ring-ring"
          aria-label="סטטוס משימה"
        >
          {TASK_STATUS_ORDER.map(s => (
            <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Expanded — Materials & Tools */}
      {isExpanded && hasMaterials && (
        <div className="px-4 pb-4 space-y-3">
          <MaterialsSection materials={materials} takenState={takenState} onToggle={onToggleMaterialTaken} />
        </div>
      )}
      {isExpanded && !hasMaterials && (
        <p className="px-4 pb-4 text-xs text-muted-foreground">אין חומרים או כלים למשימה זו</p>
      )}
    </div>
  );
}

/* ─── Materials & Tools Section ─── */
function MaterialsSection({ materials, takenState, onToggle }: {
  materials: Material[];
  takenState: Record<string, boolean>;
  onToggle: (id: string, c: boolean) => void;
}) {
  const mats = materials.filter(m => m.itemType !== 'tool');
  const tools = materials.filter(m => m.itemType === 'tool');

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 space-y-3">
      <h4 className="text-xs font-display font-semibold text-muted-foreground">חומרים וכלים</h4>

      {mats.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">חומרים</p>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-start py-1 font-medium w-8">נלקח</th>
                  <th className="text-start py-1 font-medium">פריט</th>
                  <th className="text-start py-1 font-medium w-16">כמות</th>
                  <th className="text-start py-1 font-medium w-14">יחידה</th>
                  <th className="text-start py-1 font-medium w-20">מחיר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mats.map(m => (
                  <tr key={m.id}>
                    <td className="py-1.5">
                      <Checkbox
                        checked={!!takenState[m.id]}
                        onCheckedChange={(c) => onToggle(m.id, !!c)}
                        aria-label={`${m.name} נלקח`}
                      />
                    </td>
                    <td className="py-1.5 text-card-foreground">{m.name}</td>
                    <td className="py-1.5">{m.quantity}</td>
                    <td className="py-1.5">{m.unit || '—'}</td>
                    <td className="py-1.5">{formatPrice(m)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-1.5">
            {mats.map(m => <MaterialCard key={m.id} item={m} taken={!!takenState[m.id]} onToggle={onToggle} />)}
          </div>
        </div>
      )}

      {tools.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">כלים</p>
          <div className="hidden sm:block">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-start py-1 font-medium w-8">נלקח</th>
                  <th className="text-start py-1 font-medium">פריט</th>
                  <th className="text-start py-1 font-medium w-16">כמות</th>
                  <th className="text-start py-1 font-medium w-14">יחידה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {tools.map(m => (
                  <tr key={m.id}>
                    <td className="py-1.5">
                      <Checkbox
                        checked={!!takenState[m.id]}
                        onCheckedChange={(c) => onToggle(m.id, !!c)}
                        aria-label={`${m.name} נלקח`}
                      />
                    </td>
                    <td className="py-1.5 text-card-foreground">{m.name}</td>
                    <td className="py-1.5">{m.quantity}</td>
                    <td className="py-1.5">{m.unit || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden space-y-1.5">
            {tools.map(m => <MaterialCard key={m.id} item={m} taken={!!takenState[m.id]} onToggle={onToggle} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function MaterialCard({ item, taken, onToggle }: { item: Material; taken: boolean; onToggle: (id: string, c: boolean) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-2">
      <Checkbox
        checked={taken}
        onCheckedChange={(c) => onToggle(item.id, !!c)}
        aria-label={`${item.name} נלקח`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-card-foreground truncate">{item.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {item.quantity} {item.unit || ''}{item.itemType !== 'tool' && ` · ${formatPrice(item)}`}
        </p>
      </div>
    </div>
  );
}

function formatPrice(m: Material): string {
  if (m.unitPrice && m.quantity) {
    const total = parseFloat(m.quantity) * m.unitPrice;
    if (!isNaN(total)) return `₪${total.toLocaleString()}`;
  }
  if (m.estimatedTotalCostNis != null) return `₪${m.estimatedTotalCostNis.toLocaleString()}`;
  return '—';
}

function LoadingMessage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
      <div className="rounded-lg border border-border bg-card px-6 py-8 text-center space-y-2">
        <p className="text-sm text-muted-foreground">טוען נתוני פרויקט…</p>
      </div>
    </div>
  );
}

function NotFoundMessage({ text }: { text: string }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
      <div className="rounded-lg border border-border bg-card px-6 py-8 text-center space-y-3">
        <p className="text-sm text-foreground font-medium">{text}</p>
        <Link to="/projects">
          <Button variant="outline" size="sm">חזרה לרשימת פרויקטים</Button>
        </Link>
      </div>
    </div>
  );
}
