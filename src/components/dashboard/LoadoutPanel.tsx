import { cn } from '@/lib/utils';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { LoadoutPanelState, Material, ExternalProvider } from '@/data/mockData';

interface LoadoutPanelProps {
  state: LoadoutPanelState;
  formattedDate: string;
  onClose: () => void;
  onRefresh: () => void;
  onToggleMaterialTaken: (id: string) => void;
}

export function LoadoutPanel({ state, formattedDate, onClose, onRefresh, onToggleMaterialTaken }: LoadoutPanelProps) {
  if (!state) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 end-0 z-50 w-[85vw] max-w-md bg-card border-s border-border shadow-2xl animate-slide-in-end flex flex-col" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-foreground">
              {state.mode === 'all' ? 'ציוד וחומרים להיום' : state.projectName}
            </h2>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
            {state.mode === 'single' && <p className="text-xs text-muted-foreground">{state.subtitle}</p>}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="רענון">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="סגירה">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {state.mode === 'all' ? (
            state.sections.map(section => (
              <div key={section.projectId} className="space-y-3">
                <h3 className="font-display font-semibold text-foreground">{section.projectName}</h3>
                {section.taskBlocks.map(block => (
                  <div key={block.key} className="space-y-2">
                    <p className="text-sm font-medium text-foreground border-b border-border pb-1">{block.heading}</p>
                    <LoadoutMaterialList items={block.items} onToggle={onToggleMaterialTaken} />
                  </div>
                ))}
                {section.externalProviders.length > 0 && (
                  <ExternalProvidersList providers={section.externalProviders} />
                )}
              </div>
            ))
          ) : (
            <div className="space-y-3">
              <LoadoutMaterialList items={state.items} onToggle={onToggleMaterialTaken} />
              {state.externalProviders.length > 0 && (
                <ExternalProvidersList providers={state.externalProviders} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LoadoutMaterialList({ items, onToggle }: { items: Material[]; onToggle: (id: string) => void }) {
  const materials = items.filter(i => i.itemType === 'material');
  const tools = items.filter(i => i.itemType === 'tool');

  return (
    <div className="space-y-3">
      {materials.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-2">חומרים</p>
          {materials.map(m => (
            <div key={m.id} className="flex items-center gap-2 py-1.5 text-sm">
              <Checkbox checked={m.taken} onCheckedChange={() => onToggle(m.id)} />
              <span className={cn("flex-1", m.taken && "line-through text-muted-foreground")}>{m.name}</span>
              <span className="text-xs text-muted-foreground">{m.quantity} {m.unit}</span>
              {m.estimatedTotalCostNis && <span className="text-xs font-medium">₪{m.estimatedTotalCostNis.toLocaleString()}</span>}
            </div>
          ))}
        </div>
      )}
      {tools.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-2">כלים</p>
          {tools.map(m => (
            <div key={m.id} className="flex items-center gap-2 py-1.5 text-sm">
              <Checkbox checked={m.taken} onCheckedChange={() => onToggle(m.id)} />
              <span className={cn("flex-1", m.taken && "line-through text-muted-foreground")}>{m.name}</span>
              <span className="text-xs text-muted-foreground">{m.quantity} {m.unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExternalProvidersList({ providers }: { providers: ExternalProvider[] }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground mb-2">ספקים חיצוניים</p>
      <div className="space-y-2">
        {providers.map(ep => (
          <div key={ep.id} className="rounded-lg border border-border p-3 text-sm">
            <p className="font-medium text-foreground">{ep.description}</p>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span>{ep.orderByDate}</span>
              {ep.priceNis && <span className="font-medium text-foreground">₪{ep.priceNis.toLocaleString()}</span>}
              {ep.quantity && <span>כמות: {ep.quantity}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
