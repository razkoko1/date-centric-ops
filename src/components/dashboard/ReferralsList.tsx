import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Phone, MessageCircle, MapPin } from 'lucide-react';
import type { Referral } from '@/data/mockData';
import { getTradeLabel } from '@/data/mockData';

interface ReferralsListProps {
  referrals: Referral[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onCallPhone: (phone: string) => void;
  onOpenWhatsApp: (phone: string) => void;
  onOpenMap: (lat?: number, lng?: number) => void;
}

export function ReferralsList({ referrals, expandedIds, onToggle, onCallPhone, onOpenWhatsApp, onOpenMap }: ReferralsListProps) {
  if (referrals.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-status-new" />
        <h2 className="font-display font-bold text-foreground">הפניות חדשות</h2>
        <span className="text-xs text-muted-foreground">{referrals.length} הפניות</span>
      </div>
      <div className="space-y-2">
        {referrals.map(ref => {
          const expanded = expandedIds.has(ref.id);
          const tradeLabel = getTradeLabel(ref.professionalTypeId);
          const commissionPercent = ref.commissionTier === 2 ? 5 : ref.commissionTier === 3 ? 10 : 15;
          const commissionAmount = ref.estimatedPriceByReferrer
            ? Math.round(ref.estimatedPriceByReferrer * commissionPercent / 100)
            : null;

          return (
            <Card key={ref.id} className="overflow-hidden">
              <button
                onClick={() => onToggle(ref.id)}
                className="w-full flex items-center justify-between p-4 text-start"
                aria-expanded={expanded}
                aria-controls={`referral-panel-${ref.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground text-sm">{ref.contactName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{tradeLabel}</span>
                    {ref.estimatedPriceByReferrer && (
                      <span className="text-xs font-medium text-foreground">₪{ref.estimatedPriceByReferrer.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
              {expanded && (
                <CardContent id={`referral-panel-${ref.id}`} className="pt-0 pb-4 space-y-3 border-t border-border mt-0 px-4">
                  <div className="grid grid-cols-2 gap-2 pt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">טלפון</p>
                      <p className="text-foreground font-medium" dir="ltr">{ref.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">מיקום</p>
                      <p className="text-foreground text-xs">{ref.location}</p>
                    </div>
                  </div>
                  {ref.description && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">תיאור</p>
                      <p className="text-sm text-foreground">{ref.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">מחיר משוער</p>
                      <p className="text-foreground font-semibold">₪{ref.estimatedPriceByReferrer?.toLocaleString()}</p>
                    </div>
                    {commissionAmount !== null && (
                      <div>
                        <p className="text-muted-foreground text-xs">עמלה ({commissionPercent}%)</p>
                        <p className="text-foreground font-semibold">₪{commissionAmount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  {ref.imageUrls && ref.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {ref.imageUrls.map((url, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-muted" />
                      ))}
                    </div>
                  )}
                  {ref.locationLat && (
                    <button
                      onClick={() => onOpenMap(ref.locationLat, ref.locationLng)}
                      className="w-full h-24 rounded-lg bg-muted flex items-center justify-center text-muted-foreground gap-2 text-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      מפה
                    </button>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-1.5" onClick={() => onCallPhone(ref.contactPhone)}>
                      <Phone className="h-4 w-4" />
                      התקשרות
                    </Button>
                    <Button variant="secondary" className="flex-1 gap-1.5" onClick={() => onOpenWhatsApp(ref.contactPhone)}>
                      <MessageCircle className="h-4 w-4" />
                      וואטסאפ
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
