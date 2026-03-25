import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_PROJECT_LIST,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  MOCK_CHAR_PHASES,
  MOCK_PLAN_RESULT,
  type ProjectItem,
  type ProjectStatus,
  type CharPhase,
  type PlanResult,
} from '@/data/projectsData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronDown, ChevronLeft, Trash2, RotateCcw, FileText, Layers, FolderOpen } from 'lucide-react';
import { AddProjectModal } from '@/components/projects/AddProjectModal';

function formatDateHe(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ProjectsPage() {
  const dir = 'rtl';
  const [projects, setProjects] = useState<ProjectItem[]>(MOCK_PROJECT_LIST);
  const [showTrash, setShowTrash] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const mainProjects = useMemo(() => projects.filter(p => p.status !== 'trash'), [projects]);
  const trashProjects = useMemo(() => projects.filter(p => p.status === 'trash'), [projects]);

  const onAddProjectClick = () => setAddModalOpen(true);
  const onOpenWorkPlan = (id: string) => console.log('Open work plan:', id);
  const onStatusChange = (id: string, newStatus: ProjectStatus) => {
    console.log('Status change:', id, newStatus);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };
  const onOpenQuote = (id: string) => console.log('Open quote:', id);
  const onViewPhases = (id: string) => console.log('View phases:', id);
  const onMoveToTrash = (id: string) => {
    console.log('Move to trash:', id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'trash' as ProjectStatus } : p));
  };
  const onRestore = (id: string) => {
    console.log('Restore:', id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'draft' as ProjectStatus } : p));
  };

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-display text-foreground">הפרויקטים שלי</h1>
            <p className="text-sm text-muted-foreground">{mainProjects.length} פרויקטים</p>
          </div>
          <Button onClick={onAddProjectClick} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            הוספת פרויקט
          </Button>
        </div>

        {/* Empty state */}
        {mainProjects.length === 0 && (
          <Card className="p-8 text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <FolderOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-display text-foreground">אין פרויקטים עדיין</h2>
            <p className="text-sm text-muted-foreground">צור את הפרויקט הראשון שלך כדי להתחיל לנהל את העבודה</p>
            <Button onClick={onAddProjectClick} className="gap-1.5">
              <Plus className="h-4 w-4" />
              הוספת פרויקט
            </Button>
          </Card>
        )}

        {/* Project cards */}
        <div className="space-y-3">
          {mainProjects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <button
                onClick={() => onOpenWorkPlan(project.id)}
                className="w-full text-start p-4 pb-2 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      עדכון אחרון: {formatDateHe(project.updatedAt)}
                    </p>
                  </div>
                  <Badge className={`${PROJECT_STATUS_COLORS[project.status]} shrink-0 text-xs`}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </div>
              </button>

              <div className="px-4 pb-3 space-y-2">
                {/* Status select */}
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className="text-xs text-muted-foreground">סטטוס:</span>
                  <Select
                    value={project.status}
                    onValueChange={(v) => onStatusChange(project.id, v as ProjectStatus)}
                  >
                    <SelectTrigger className="h-7 text-xs w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['draft', 'active', 'done', 'trash'] as ProjectStatus[]).map(s => (
                        <SelectItem key={s} value={s} className="text-xs">{PROJECT_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quote link */}
                {project.quoteId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenQuote(project.id); }}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    צפה בהצעת מחיר
                  </button>
                )}

                {/* Footer actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1 text-muted-foreground"
                    onClick={(e) => { e.stopPropagation(); onViewPhases(project.id); }}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    שלבים
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1 text-destructive ms-auto"
                    onClick={(e) => { e.stopPropagation(); onMoveToTrash(project.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    העבר לפח
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trash section */}
        {trashProjects.length > 0 && (
          <Collapsible open={showTrash} onOpenChange={setShowTrash}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              <ChevronDown className={`h-4 w-4 transition-transform ${showTrash ? 'rotate-180' : ''}`} />
              <Trash2 className="h-4 w-4" />
              <span>פח ({trashProjects.length})</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-1">
              {trashProjects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                >
                  <span className="text-sm text-muted-foreground truncate flex-1">{project.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1 shrink-0"
                    onClick={() => onRestore(project.id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    שחזור
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Add project modal */}
      <AddProjectModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
