import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, CheckCircle2, Eye } from 'lucide-react';
import type { AwardedBid } from '@/data/mockData';

interface AwardedBidsProps {
  bids: AwardedBid[];
  onConfirm: (collabId: string) => void;
  onViewDetails: (collabId: string) => void;
  onTranslate: (collabId: string) => void;
}

export function AwardedBids({ bids, onConfirm, onViewDetails, onTranslate }: AwardedBidsProps) {
  if (bids.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-status-done" />
        <h2 className="font-display font-bold text-foreground">הצעות שזכו</h2>
        <span className="text-xs text-muted-foreground">{bids.length} פריטים</span>
      </div>
      <div className="space-y-2">
        {bids.map(bid => (
          <Card key={bid.collabId} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-semibold text-foreground">{bid.tradeNeeded}</p>
                  {bid.publisherName && (
                    <p className="text-xs text-muted-foreground mt-0.5">מפרסם: {bid.publisherName}</p>
                  )}
                </div>
                {bid.bid?.proposedBudgetNis && (
                  <Badge variant="secondary" className="font-display text-sm font-bold">
                    ₪{bid.bid.proposedBudgetNis.toLocaleString()}
                  </Badge>
                )}
              </div>
              {bid.description && (
                <div className="flex items-start gap-2">
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{bid.description}</p>
                  <button
                    onClick={() => onTranslate(bid.collabId)}
                    className="shrink-0 h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted"
                    aria-label="תרגום"
                  >
                    <Languages className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1.5" onClick={() => onConfirm(bid.collabId)}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  אישור התקשרות
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => onViewDetails(bid.collabId)}>
                  <Eye className="h-3.5 w-3.5" />
                  פרטים
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
