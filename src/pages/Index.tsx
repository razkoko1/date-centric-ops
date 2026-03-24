import { useState, useMemo, useCallback } from 'react';
import {
  MOCK_USER, MOCK_TODAY, MOCK_PROJECTS, MOCK_TASKS,
  MOCK_REFERRALS, MOCK_AWARDED_BIDS, MOCK_PENDING_UPDATES,
  getAllMaterialsCount, buildLoadoutAllDay, buildLoadoutForTask,
  type Task, type TaskStatus, type LoadoutPanelState,
} from '@/data/mockData';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PendingUpdatesBanner } from '@/components/dashboard/PendingUpdatesBanner';
import { PendingUpdatesModal } from '@/components/dashboard/PendingUpdatesModal';
import { DailyUpdateCTA } from '@/components/dashboard/DailyUpdateCTA';
import { DailyStatusSheet } from '@/components/dashboard/DailyStatusSheet';
import { DateNavigator } from '@/components/dashboard/DateNavigator';
import { AgendaSection } from '@/components/dashboard/AgendaSection';
import { AwardedBids } from '@/components/dashboard/AwardedBids';
import { ReferralsList } from '@/components/dashboard/ReferralsList';
import { LoadoutPanel } from '@/components/dashboard/LoadoutPanel';
import { TaskFieldSheet } from '@/components/dashboard/TaskFieldSheet';
import { VoiceLogModal, ReceiptUploadModal, MaterialImageModal } from '@/components/dashboard/SimpleModals';

function formatHebrewDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  return `יום ${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function Index() {
  const dir = 'rtl';
  const [selectedDate, setSelectedDate] = useState(MOCK_TODAY);
  const isToday = selectedDate === MOCK_TODAY;
  const formattedDate = formatHebrewDate(selectedDate);

  // For this mock, projects/tasks are always shown on "today"
  const projectsForDay = isToday ? MOCK_PROJECTS : [];
  const tasksForDay = isToday ? MOCK_TASKS : [];

  const stats = useMemo(() => ({
    projectsOnDayCount: projectsForDay.length,
    tasksOnDayCount: tasksForDay.length,
    equipmentItemsCount: isToday ? getAllMaterialsCount() : 0,
  }), [projectsForDay, tasksForDay, isToday]);

  // State
  const [agendaTab, setAgendaTab] = useState<'tasks' | 'materials'>('tasks');
  const [expandedReferralIds, setExpandedReferralIds] = useState<Set<string>>(new Set());
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [pendingSelected, setPendingSelected] = useState<Set<string>>(new Set());
  const [dailySheetOpen, setDailySheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [loadoutPanel, setLoadoutPanel] = useState<LoadoutPanelState>(null);

  // Modal flags
  const [voiceModalCtx, setVoiceModalCtx] = useState<{ projectId: string; projectName: string } | null>(null);
  const [receiptModalCtx, setReceiptModalCtx] = useState<{ projectId: string; projectName: string } | null>(null);
  const [materialImageCtx, setMaterialImageCtx] = useState<{ projectId: string; projectName: string } | null>(null);

  // Handlers
  const onNavigate = useCallback((path: string) => console.log('Navigate:', path), []);
  const onScrollToMaterials = useCallback(() => { setAgendaTab('materials'); console.log('Scroll to materials'); }, []);

  const getProjectName = (pid: string) => MOCK_PROJECTS.find(p => p.id === pid)?.name || '';

  const onOpenTaskSheet = useCallback((taskId: string) => {
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (task) {
      setEditingTask({ ...task });
      setEditingProjectName(getProjectName(task.projectId));
    }
  }, []);

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <DashboardHeader
          userName={MOCK_USER.name}
          isToday={isToday}
          formattedDate={formattedDate}
          stats={stats}
          onScrollToMaterials={onScrollToMaterials}
        />

        {/* Empty states */}
        {MOCK_PROJECTS.length === 0 ? (
          <EmptyState variant="no-projects" onNavigate={onNavigate} />
        ) : projectsForDay.length === 0 ? (
          <EmptyState variant="no-projects-on-day" allProjectsCount={MOCK_PROJECTS.length} onNavigate={onNavigate} />
        ) : null}

        {/* Pending updates */}
        <PendingUpdatesBanner
          count={MOCK_PENDING_UPDATES.length}
          onOpenModal={() => setPendingModalOpen(true)}
        />

        {/* Daily update CTA */}
        <DailyUpdateCTA onClick={() => setDailySheetOpen(true)} />

        {/* Awarded bids */}
        <AwardedBids
          bids={MOCK_AWARDED_BIDS}
          onConfirm={(id) => console.log('Confirm engagement:', id)}
          onViewDetails={(id) => console.log('View details:', id)}
          onTranslate={(id) => console.log('Translate:', id)}
        />

        {/* Referrals */}
        <ReferralsList
          referrals={MOCK_REFERRALS}
          expandedIds={expandedReferralIds}
          onToggle={(id) => setExpandedReferralIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          })}
          onCallPhone={(p) => console.log('Call:', p)}
          onOpenWhatsApp={(p) => console.log('WhatsApp:', p)}
          onOpenMap={(lat, lng) => console.log('Map:', lat, lng)}
        />

        {/* Date navigator */}
        <DateNavigator
          formattedDate={formattedDate}
          isToday={isToday}
          onPrevDay={() => setSelectedDate(d => addDays(d, -1))}
          onNextDay={() => setSelectedDate(d => addDays(d, 1))}
          onGoToToday={() => setSelectedDate(MOCK_TODAY)}
        />

        {/* Agenda */}
        <AgendaSection
          projects={projectsForDay}
          tasks={tasksForDay}
          agendaTab={agendaTab}
          onTabChange={setAgendaTab}
          onGoToProject={(id) => console.log('Go to project:', id)}
          onOpenTaskSheet={onOpenTaskSheet}
          onOpenLoadoutAllDay={() => setLoadoutPanel({ mode: 'all', sections: buildLoadoutAllDay() })}
          onOpenLoadoutForTask={(pid, tid) => {
            const data = buildLoadoutForTask(pid, tid);
            setLoadoutPanel({ mode: 'single', projectId: pid, ...data, scope: 'task' });
          }}
          onToggleMaterialTaken={(id) => console.log('Toggle material:', id)}
          onRefreshMaterials={() => console.log('Refresh materials')}
        />
      </div>

      {/* Overlays */}
      <PendingUpdatesModal
        open={pendingModalOpen}
        items={MOCK_PENDING_UPDATES}
        selectedIds={pendingSelected}
        onToggle={(id) => setPendingSelected(prev => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        })}
        onDiscard={(pid, id) => console.log('Discard:', pid, id)}
        onApply={() => { console.log('Apply selected:', [...pendingSelected]); setPendingModalOpen(false); }}
        onClose={() => setPendingModalOpen(false)}
        onTranslate={(id) => console.log('Translate pending:', id)}
      />

      <DailyStatusSheet
        open={dailySheetOpen}
        onClose={() => setDailySheetOpen(false)}
        projects={MOCK_PROJECTS}
        onChooseVoice={(pid) => { setDailySheetOpen(false); setVoiceModalCtx({ projectId: pid, projectName: getProjectName(pid) }); }}
        onChooseReceipt={(pid) => { setDailySheetOpen(false); setReceiptModalCtx({ projectId: pid, projectName: getProjectName(pid) }); }}
        onChooseMaterialImage={(pid) => { setDailySheetOpen(false); setMaterialImageCtx({ projectId: pid, projectName: getProjectName(pid) }); }}
      />

      <TaskFieldSheet
        task={editingTask}
        projectName={editingProjectName}
        onStatusChange={(s) => setEditingTask(prev => prev ? { ...prev, status: s } : null)}
        onRecordVoice={() => console.log('Record voice for task')}
        onAddNote={(n) => { if (n) setEditingTask(prev => prev ? { ...prev, notes: [...(prev.notes || []), n] } : null); }}
        onAddAddOn={(a) => { if (a) setEditingTask(prev => prev ? { ...prev, addOns: [...(prev.addOns || []), a] } : null); }}
        onSave={() => { console.log('Save task:', editingTask); setEditingTask(null); }}
        onCancel={() => setEditingTask(null)}
      />

      <LoadoutPanel
        state={loadoutPanel}
        formattedDate={formattedDate}
        onClose={() => setLoadoutPanel(null)}
        onRefresh={() => console.log('Refresh loadout')}
        onToggleMaterialTaken={(id) => console.log('Toggle loadout material:', id)}
      />

      <VoiceLogModal
        open={!!voiceModalCtx}
        onClose={() => setVoiceModalCtx(null)}
        onSubmit={() => { console.log('Submit voice:', voiceModalCtx); setVoiceModalCtx(null); }}
        projectName={voiceModalCtx?.projectName || ''}
      />
      <ReceiptUploadModal
        open={!!receiptModalCtx}
        onClose={() => setReceiptModalCtx(null)}
        onSubmit={() => { console.log('Submit receipt:', receiptModalCtx); setReceiptModalCtx(null); }}
        projectName={receiptModalCtx?.projectName || ''}
      />
      <MaterialImageModal
        open={!!materialImageCtx}
        onClose={() => setMaterialImageCtx(null)}
        onSubmit={() => { console.log('Submit material image:', materialImageCtx); setMaterialImageCtx(null); }}
        projectName={materialImageCtx?.projectName || ''}
      />
    </div>
  );
}
