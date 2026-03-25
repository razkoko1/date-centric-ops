// Types for Projects page
export type ProjectStatus = 'draft' | 'active' | 'done' | 'trash';

export interface ProjectItem {
  id: string;
  userId: string;
  name: string;
  status: ProjectStatus;
  updatedAt: string;
  quoteId?: string | null;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'טיוטה',
  active: 'פעיל',
  done: 'הושלם',
  trash: 'פח',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'bg-status-new text-primary-foreground',
  active: 'bg-status-in-progress text-primary-foreground',
  done: 'bg-status-done text-primary-foreground',
  trash: 'bg-status-cancelled text-primary-foreground',
};

export const MOCK_PROJECT_LIST: ProjectItem[] = [
  { id: 'p1', userId: 'u1', name: 'שיפוץ דירה — רחוב הרצל 42', status: 'active', updatedAt: '2026-03-24', quoteId: 'q1' },
  { id: 'p2', userId: 'u1', name: 'בניית גג — רמת גן', status: 'active', updatedAt: '2026-03-23', quoteId: null },
  { id: 'p3', userId: 'u1', name: 'חיפוי אמבטיה — כפר סבא', status: 'done', updatedAt: '2026-03-20', quoteId: 'q2' },
  { id: 'p4', userId: 'u1', name: 'הרחבת מרפסת — תל אביב', status: 'draft', updatedAt: '2026-03-18', quoteId: null },
  { id: 'p5', userId: 'u1', name: 'שיפוץ חדר רחצה — הרצליה', status: 'trash', updatedAt: '2026-03-15', quoteId: null },
  { id: 'p6', userId: 'u1', name: 'עבודות צבע — פתח תקווה', status: 'trash', updatedAt: '2026-03-10', quoteId: null },
];

// Phase question types for the AI plan wizard
export interface PhaseQuestion {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select' | 'checkbox' | 'open';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean | string[];
}

export interface CharPhase {
  phaseTitle: string;
  questions: PhaseQuestion[];
}

export interface PlanResult {
  projectName: string;
  description?: string;
  totalEstimatedBudgetNis?: number;
  phases?: { title: string; tasks?: { estimatedCostNis?: number }[] }[];
  collaborations?: { tradeNeeded: string; estimatedBudgetNis: number }[];
}

// Mock characterization phases for AI plan wizard
export const MOCK_CHAR_PHASES: CharPhase[] = [
  {
    phaseTitle: 'הריסה והכנה',
    questions: [
      { id: 'q1', label: 'כמה מ"ר לפירוק?', type: 'slider', min: 5, max: 200, step: 5, unit: 'מ"ר', defaultValue: 30 },
      { id: 'q2', label: 'האם יש אסבסט?', type: 'toggle', defaultValue: false },
      { id: 'q3', label: 'סוג הריסה', type: 'select', options: ['ידנית', 'מכנית', 'משולבת'] },
    ],
  },
  {
    phaseTitle: 'אינסטלציה',
    questions: [
      { id: 'q4', label: 'כמה נקודות מים?', type: 'slider', min: 1, max: 30, step: 1, unit: 'נקודות', defaultValue: 8 },
      { id: 'q5', label: 'סוגי צנרת', type: 'checkbox', options: ['PVC', 'נחושת', 'פלדה', 'PPR'] },
      { id: 'q6', label: 'הערות נוספות', type: 'open', placeholder: 'פרטים נוספים...' },
    ],
  },
  {
    phaseTitle: 'חשמל',
    questions: [
      { id: 'q7', label: 'כמה נקודות חשמל?', type: 'slider', min: 5, max: 100, step: 5, unit: 'נקודות', defaultValue: 25 },
      { id: 'q8', label: 'לוח חשמל חדש?', type: 'toggle', defaultValue: true },
      { id: 'q9', label: 'סוג תאורה מועדף', type: 'select', options: ['לד', 'ספוטים', 'שקועי תקרה', 'פסי LED'] },
    ],
  },
];

export const MOCK_PLAN_RESULT: PlanResult = {
  projectName: 'שיפוץ דירה — רחוב הרצל 42',
  description: 'שיפוץ כללי הכולל הריסה, אינסטלציה, חשמל וגמר.',
  totalEstimatedBudgetNis: 185000,
  phases: [
    { title: 'הריסה והכנה', tasks: [{ estimatedCostNis: 15000 }, { estimatedCostNis: 8000 }] },
    { title: 'אינסטלציה', tasks: [{ estimatedCostNis: 22000 }, { estimatedCostNis: 12000 }] },
    { title: 'חשמל', tasks: [{ estimatedCostNis: 18000 }, { estimatedCostNis: 9000 }] },
    { title: 'ריצוף וחיפוי', tasks: [{ estimatedCostNis: 35000 }] },
    { title: 'צביעה וגמר', tasks: [{ estimatedCostNis: 25000 }, { estimatedCostNis: 15000 }] },
  ],
  collaborations: [
    { tradeNeeded: 'שרברב', estimatedBudgetNis: 22000 },
    { tradeNeeded: 'חשמלאי', estimatedBudgetNis: 18000 },
    { tradeNeeded: 'רצף', estimatedBudgetNis: 35000 },
  ],
};
