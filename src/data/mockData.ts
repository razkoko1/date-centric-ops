// Types
export type TaskStatus = 'new' | 'in_progress' | 'done' | 'stuck' | 'cancelled' | 'delayed';
export type Dir = 'rtl' | 'ltr';

export interface User {
  id: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  phasesCount?: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  startTime?: string | null;
  endTime?: string | null;
  status: TaskStatus;
  notes?: string[];
  addOns?: string[];
}

export interface Material {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  itemType?: 'material' | 'tool';
  taken?: boolean;
  unitPrice?: number;
  estimatedTotalCostNis?: number | null;
}

export interface Trade {
  id: string;
  label: string;
}

export interface Referral {
  id: string;
  contactName: string;
  contactPhone: string;
  professionalTypeId: string;
  estimatedPriceByReferrer?: number;
  commissionTier: 2 | 3 | 4;
  status: 'new' | 'pending' | 'accepted' | 'completed';
  description?: string;
  location: string;
  locationLat?: number;
  locationLng?: number;
  imageUrls?: string[];
}

export interface AwardedBid {
  collabId: string;
  tradeNeeded: string;
  description?: string;
  publisherName?: string;
  bid?: { proposedBudgetNis?: number | null };
}

export interface PendingUpdate {
  id: string;
  projectId: string;
  projectName?: string;
  type: 'status_update' | 'new_extra' | 'gantt_shift';
  rawData: Record<string, unknown>;
  sourceLogTextPreview?: string | null;
}

export interface ExternalProvider {
  id: string;
  description: string;
  orderByDate: string;
  priceNis?: number | null;
  quantity?: number;
}

export interface LoadoutSection {
  projectId: string;
  projectName: string;
  taskBlocks: Array<{ key: string; heading: string; items: Material[] }>;
  externalProviders: ExternalProvider[];
}

export type LoadoutPanelState =
  | null
  | { mode: 'all'; sections: LoadoutSection[] }
  | { mode: 'single'; projectId: string; projectName: string; subtitle: string; scope: 'day' | 'task'; items: Material[]; externalProviders: ExternalProvider[] };

// Status display config
export const STATUS_CONFIG: Record<TaskStatus, { label: string; colorClass: string }> = {
  new: { label: 'חדש', colorClass: 'bg-status-new' },
  in_progress: { label: 'בביצוע', colorClass: 'bg-status-in-progress' },
  done: { label: 'הושלם', colorClass: 'bg-status-done' },
  stuck: { label: 'תקוע', colorClass: 'bg-status-stuck' },
  cancelled: { label: 'בוטל', colorClass: 'bg-status-cancelled' },
  delayed: { label: 'עיכוב', colorClass: 'bg-status-delayed' },
};

// Mock data
export const MOCK_USER: User = { id: 'u1', name: 'יוסי כהן' };

export const MOCK_TODAY = '2026-03-24';

export const MOCK_TRADES: Trade[] = [
  { id: 't1', label: 'חשמלאי' },
  { id: 't2', label: 'שרברב' },
  { id: 't3', label: 'צבעי' },
  { id: 't4', label: 'נגר' },
  { id: 't5', label: 'מסגר' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'שיפוץ דירה — רחוב הרצל 42', phasesCount: 3 },
  { id: 'p2', name: 'בניית גג — רמת גן', phasesCount: 2 },
  { id: 'p3', name: 'חיפוי אמבטיה — כפר סבא', phasesCount: 1 },
];

export const MOCK_TASKS: Task[] = [
  { id: 'tk1', projectId: 'p1', title: 'התקנת ארונות מטבח', startTime: '08:00', endTime: '12:00', status: 'in_progress', notes: ['צריך לוודא מידות לפני ההתקנה'], addOns: [] },
  { id: 'tk2', projectId: 'p1', title: 'חיווט חשמל במטבח', startTime: '13:00', endTime: '16:00', status: 'new', notes: [], addOns: [] },
  { id: 'tk3', projectId: 'p2', title: 'יציקת בטון לגג', startTime: null, endTime: null, status: 'new', notes: [], addOns: [] },
  { id: 'tk4', projectId: 'p2', title: 'הרכבת קונסטרוקציה', startTime: '07:00', endTime: '15:00', status: 'in_progress', notes: ['ממתינים לפלדות מהספק'], addOns: ['תוספת ברגים — ₪350'] },
  { id: 'tk5', projectId: 'p3', title: 'הדבקת אריחים', startTime: '09:00', endTime: '17:00', status: 'done', notes: [], addOns: [] },
];

export const MOCK_MATERIALS_BY_TASK: Record<string, Material[]> = {
  tk1: [
    { id: 'm1', name: 'ארון עליון 80ס"מ', quantity: '3', unit: 'יח׳', itemType: 'material', taken: true, unitPrice: 450, estimatedTotalCostNis: 1350 },
    { id: 'm2', name: 'ארון תחתון 60ס"מ', quantity: '4', unit: 'יח׳', itemType: 'material', taken: false, unitPrice: 380, estimatedTotalCostNis: 1520 },
    { id: 'm3', name: 'מקדחה אימפקט', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
    { id: 'm4', name: 'סט ברגים', quantity: '2', unit: 'חבילה', itemType: 'tool', taken: false },
  ],
  tk2: [
    { id: 'm5', name: 'כבל חשמל 2.5 מ"מ', quantity: '50', unit: 'מטר', itemType: 'material', taken: false, unitPrice: 3.5, estimatedTotalCostNis: 175 },
    { id: 'm6', name: 'בידוד חשמלי', quantity: '3', unit: 'גליל', itemType: 'material', taken: false, unitPrice: 25, estimatedTotalCostNis: 75 },
    { id: 'm7', name: 'פלייר חשמלאי', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
  ],
  tk3: [
    { id: 'm8', name: 'בטון מוכן B30', quantity: '8', unit: 'קוב', itemType: 'material', taken: false, unitPrice: 650, estimatedTotalCostNis: 5200 },
    { id: 'm9', name: 'רשת ברזל', quantity: '12', unit: 'יח׳', itemType: 'material', taken: false, unitPrice: 85, estimatedTotalCostNis: 1020 },
  ],
  tk4: [
    { id: 'm10', name: 'קורות פלדה IPE200', quantity: '6', unit: 'יח׳', itemType: 'material', taken: true, unitPrice: 1200, estimatedTotalCostNis: 7200 },
    { id: 'm11', name: 'מכונת ריתוך', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
  ],
  tk5: [
    { id: 'm12', name: 'אריחי קרמיקה 60×60', quantity: '25', unit: 'מ"ר', itemType: 'material', taken: true, unitPrice: 120, estimatedTotalCostNis: 3000 },
    { id: 'm13', name: 'דבק לאריחים', quantity: '10', unit: 'שק', itemType: 'material', taken: true, unitPrice: 35, estimatedTotalCostNis: 350 },
  ],
};

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'r1',
    contactName: 'אברהם לוי',
    contactPhone: '054-9876543',
    professionalTypeId: 't1',
    estimatedPriceByReferrer: 8500,
    commissionTier: 3,
    status: 'new',
    description: 'דירת 4 חדרים, צריך להחליף את כל החיווט מהלוח ועד לשקעים. בניין ישן משנות ה-70.',
    location: 'רחוב סוקולוב 15, רמת השרון',
    locationLat: 32.146,
    locationLng: 34.839,
    imageUrls: [],
  },
  {
    id: 'r2',
    contactName: 'מרים דוד',
    contactPhone: '050-1234567',
    professionalTypeId: 't3',
    estimatedPriceByReferrer: 4200,
    commissionTier: 2,
    status: 'new',
    description: 'צביעה מלאה של דירת 3 חדרים כולל תיקוני טיח.',
    location: 'שדרות רוטשילד 88, תל אביב',
  },
];

export const MOCK_AWARDED_BIDS: AwardedBid[] = [
  {
    collabId: 'c1',
    tradeNeeded: 'שרברבות',
    description: 'החלפת צנרת מים חמים וקרים בדירת 5 חדרים. כולל התקנת ברזים חדשים באמבטיה ובמטבח.',
    publisherName: 'דני אסרף',
    bid: { proposedBudgetNis: 12000 },
  },
  {
    collabId: 'c2',
    tradeNeeded: 'ריצוף',
    description: 'ריצוף מרפסת 30 מ"ר בפורצלן.',
    publisherName: 'שרית כהן',
    bid: { proposedBudgetNis: 6500 },
  },
];

export const MOCK_PENDING_UPDATES: PendingUpdate[] = [
  {
    id: 'pu1', projectId: 'p1', projectName: 'שיפוץ דירה — רחוב הרצל 42', type: 'status_update',
    rawData: { taskName: 'התקנת ארונות מטבח', taskId: 'tk1', newStatus: 'done' },
    sourceLogTextPreview: 'עדכון יומי: סיימנו את כל הארונות העליונים, נשארו 2 תחתונים',
  },
  {
    id: 'pu2', projectId: 'p2', projectName: 'בניית גג — רמת גן', type: 'gantt_shift',
    rawData: { taskName: 'יציקת בטון לגג', taskId: 'tk3', shiftDays: 2 },
    sourceLogTextPreview: 'הבטון לא הגיע היום, דוחים ביומיים',
  },
  {
    id: 'pu3', projectId: 'p1', projectName: 'שיפוץ דירה — רחוב הרצל 42', type: 'new_extra',
    rawData: { title: 'תוספת נקודת חשמל בסלון', estimatedCost: 450 },
    sourceLogTextPreview: null,
  },
];

export const MOCK_EXTERNAL_PROVIDERS: ExternalProvider[] = [
  { id: 'ep1', description: 'הובלת בטון — חברת בטון ישראלי', orderByDate: '2026-03-24', priceNis: 2800, quantity: 8 },
  { id: 'ep2', description: 'שכירת מנוף — מנופי השרון', orderByDate: '2026-03-24', priceNis: 3500, quantity: 1 },
];

// Computed helpers
export function getTasksForProject(projectId: string): Task[] {
  return MOCK_TASKS.filter(t => t.projectId === projectId);
}

export function getMaterialsForTask(taskId: string): Material[] {
  return MOCK_MATERIALS_BY_TASK[taskId] || [];
}

export function getTradeLabel(tradeId: string): string {
  return MOCK_TRADES.find(t => t.id === tradeId)?.label || tradeId;
}

export function getAllMaterialsCount(): number {
  return Object.values(MOCK_MATERIALS_BY_TASK).reduce((sum, arr) => sum + arr.length, 0);
}

export function buildLoadoutAllDay(): LoadoutSection[] {
  return MOCK_PROJECTS.map(p => {
    const tasks = getTasksForProject(p.id);
    return {
      projectId: p.id,
      projectName: p.name,
      taskBlocks: tasks.map(t => ({
        key: t.id,
        heading: t.title,
        items: getMaterialsForTask(t.id),
      })),
      externalProviders: MOCK_EXTERNAL_PROVIDERS.filter(() => p.id === 'p2'),
    };
  });
}

export function buildLoadoutForTask(projectId: string, taskId: string): {
  projectName: string;
  subtitle: string;
  items: Material[];
  externalProviders: ExternalProvider[];
} {
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  const task = MOCK_TASKS.find(t => t.id === taskId);
  return {
    projectName: project?.name || '',
    subtitle: task?.title || '',
    items: getMaterialsForTask(taskId),
    externalProviders: [],
  };
}
