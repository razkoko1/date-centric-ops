import type { TaskStatus, Material } from './mockData';

export interface ProjectPhase {
  id: string;
  projectId: string;
  order: number;
  title: string;
  description?: string;
  approved: boolean;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  phaseId?: string | null;
  title: string;
  status: TaskStatus;
  extraTitle?: string | null;
  isExtra?: boolean | null;
  isExtraApproved?: boolean | null;
  extraCostNis?: number | null;
  estimatedHours?: number | null;
  durationDays?: number | null;
}

export interface ProjectDetail {
  id: string;
  userId: string;
  name: string;
  phases?: ProjectPhase[];
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  new: 'חדש',
  in_progress: 'בביצוע',
  done: 'הושלם',
  stuck: 'תקוע',
  delayed: 'עיכוב',
  cancelled: 'בוטל',
};

export const TASK_STATUS_ORDER: TaskStatus[] = ['new', 'in_progress', 'done', 'stuck', 'delayed', 'cancelled'];

export const MOCK_PROJECT_DETAIL: ProjectDetail = {
  id: 'p1',
  userId: 'u1',
  name: 'שיפוץ דירה — רחוב הרצל 42',
  phases: [
    { id: 'ph1', projectId: 'p1', order: 1, title: 'הריסה והכנה', approved: true },
    { id: 'ph2', projectId: 'p1', order: 2, title: 'אינסטלציה וצנרת', approved: true },
    { id: 'ph3', projectId: 'p1', order: 3, title: 'חשמל ותאורה', approved: true },
    { id: 'ph4', projectId: 'p1', order: 4, title: 'ריצוף וחיפוי', approved: false },
    { id: 'ph5', projectId: 'p1', order: 5, title: 'צביעה וגמר', approved: false },
  ],
};

export const MOCK_PROJECT_TASKS: ProjectTask[] = [
  // Phase 1 — הריסה והכנה
  { id: 'dt1', projectId: 'p1', phaseId: 'ph1', title: 'פירוק ריצוף ישן', status: 'done', estimatedHours: 16, durationDays: 2 },
  { id: 'dt2', projectId: 'p1', phaseId: 'ph1', title: 'הסרת טיח פגום', status: 'done', estimatedHours: 8 },
  { id: 'dt3', projectId: 'p1', phaseId: 'ph1', title: 'פינוי פסולת בניין', status: 'in_progress', estimatedHours: 4 },
  // Phase 2 — אינסטלציה
  { id: 'dt4', projectId: 'p1', phaseId: 'ph2', title: 'החלפת צנרת מים חמים וקרים', status: 'in_progress', estimatedHours: 24, durationDays: 3 },
  { id: 'dt5', projectId: 'p1', phaseId: 'ph2', title: 'התקנת ניקוז חדש', status: 'new', estimatedHours: 12 },
  { id: 'dt6', projectId: 'p1', phaseId: 'ph2', title: 'הוספת נקודת גז למטבח', status: 'new', isExtra: true, isExtraApproved: true, extraCostNis: 2800, extraTitle: 'תוספת עבודה — אושר ע״י לקוח', estimatedHours: 6 },
  // Phase 3 — חשמל
  { id: 'dt7', projectId: 'p1', phaseId: 'ph3', title: 'חיווט נקודות חשמל', status: 'new', estimatedHours: 32, durationDays: 4 },
  { id: 'dt8', projectId: 'p1', phaseId: 'ph3', title: 'התקנת לוח חשמל חדש', status: 'new', estimatedHours: 8 },
  // Phase 4 — ריצוף
  { id: 'dt9', projectId: 'p1', phaseId: 'ph4', title: 'הנחת ריצוף סלון ומסדרון', status: 'new', estimatedHours: 40, durationDays: 5 },
  { id: 'dt10', projectId: 'p1', phaseId: 'ph4', title: 'חיפוי קירות אמבטיה', status: 'new', estimatedHours: 24, durationDays: 3 },
  // Phase 5 — צביעה
  { id: 'dt11', projectId: 'p1', phaseId: 'ph5', title: 'שפכטל והכנת משטחים', status: 'new', estimatedHours: 16, durationDays: 2 },
  { id: 'dt12', projectId: 'p1', phaseId: 'ph5', title: 'צביעת כל החדרים', status: 'new', estimatedHours: 24, durationDays: 3 },
  // Orphan tasks (no phase)
  { id: 'dt13', projectId: 'p1', phaseId: null, title: 'בדיקת רטיבות בקיר מזרחי', status: 'stuck', estimatedHours: 4 },
  { id: 'dt14', projectId: 'p1', phaseId: null, title: 'תיקון סדק בתקרה', status: 'delayed', isExtra: true, extraCostNis: 1500, extraTitle: 'ממתין לאישור לקוח', estimatedHours: 6 },
];

export const MOCK_DETAIL_MATERIALS: Record<string, Material[]> = {
  dt1: [
    { id: 'dm1', name: 'פטיש הריסה חשמלי', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
    { id: 'dm2', name: 'שקיות פסולת בניין', quantity: '30', unit: 'יח׳', itemType: 'material', taken: false, unitPrice: 8, estimatedTotalCostNis: 240 },
  ],
  dt3: [
    { id: 'dm3', name: 'מכולת פסולת', quantity: '1', unit: 'יח׳', itemType: 'material', taken: false, unitPrice: 1200, estimatedTotalCostNis: 1200 },
  ],
  dt4: [
    { id: 'dm4', name: 'צינור PPR 25 מ"מ', quantity: '40', unit: 'מטר', itemType: 'material', taken: true, unitPrice: 12, estimatedTotalCostNis: 480 },
    { id: 'dm5', name: 'מפתח צינורות', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
    { id: 'dm6', name: 'הלחמת PPR', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
  ],
  dt6: [
    { id: 'dm7', name: 'צינור גז גמיש', quantity: '3', unit: 'מטר', itemType: 'material', taken: false, unitPrice: 85, estimatedTotalCostNis: 255 },
  ],
  dt7: [
    { id: 'dm8', name: 'כבל חשמל 2.5 מ"מ', quantity: '100', unit: 'מטר', itemType: 'material', taken: false, unitPrice: 3.5, estimatedTotalCostNis: 350 },
    { id: 'dm9', name: 'קופסאות חיבור', quantity: '20', unit: 'יח׳', itemType: 'material', taken: false, unitPrice: 5, estimatedTotalCostNis: 100 },
    { id: 'dm10', name: 'מקדחה אימפקט', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: true },
  ],
  dt9: [
    { id: 'dm11', name: 'אריחי פורצלן 60×60', quantity: '45', unit: 'מ"ר', itemType: 'material', taken: false, unitPrice: 130, estimatedTotalCostNis: 5850 },
    { id: 'dm12', name: 'דבק לאריחים', quantity: '20', unit: 'שק', itemType: 'material', taken: false, unitPrice: 35, estimatedTotalCostNis: 700 },
    { id: 'dm13', name: 'מפלס לייזר', quantity: '1', unit: 'יח׳', itemType: 'tool', taken: false },
  ],
  dt10: [
    { id: 'dm14', name: 'אריחי קרמיקה לקירות', quantity: '18', unit: 'מ"ר', itemType: 'material', taken: false, unitPrice: 95, estimatedTotalCostNis: 1710 },
  ],
  dt12: [
    { id: 'dm15', name: 'צבע פנים לבן', quantity: '20', unit: 'ליטר', itemType: 'material', taken: false, unitPrice: 45, estimatedTotalCostNis: 900 },
    { id: 'dm16', name: 'רולר צבע', quantity: '3', unit: 'יח׳', itemType: 'tool', taken: false },
  ],
};
